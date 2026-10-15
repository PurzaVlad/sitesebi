import { unstable_cache } from 'next/cache'

import { rebsFetchAll, rebsPost, type RebsNamed } from './rebs'
import type { Listing } from './site-data'

const LEAD_SOURCE = 'Site companie'
const defaultAgentId = Number(process.env.REBS_DEFAULT_AGENT_ID) || null

const getLookups = unstable_cache(async () => {
  const [activityTypes, requestStatuses] = await Promise.all([
    rebsFetchAll<RebsNamed>('/api/activity-types/'),
    rebsFetchAll<RebsNamed>('/api/request-pipeline-statuses/'),
  ])
  const byName = (items: RebsNamed[], name: string) =>
    items.find((item) => item.name.localeCompare(name, 'ro', { sensitivity: 'base' }) === 0)?.id
  return {
    viewingType: byName(activityTypes, 'Vizionare'),
    todoType: byName(activityTypes, 'To do'),
    viewingStatus: byName(requestStatuses, 'Vizionare'),
  }
}, ['rebs-lookups'], { revalidate: 86_400, tags: ['rebs-reference'] })

// Viewing slots are Romanian local time; REBS expects an ISO date-time with offset.
function bucharestTime(date: string, time: string, addHours = 0) {
  const [hours, minutes] = time.split(':').map(Number)
  const local = `${date}T${String(hours + addHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`
  const offset = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Bucharest', timeZoneName: 'longOffset' })
    .formatToParts(new Date(`${local}Z`))
    .find((part) => part.type === 'timeZoneName')?.value.replace('GMT', '') || '+00:00'
  return `${local}${offset || '+00:00'}`
}

type Person = { name: string; phone: string; email?: string | null }

async function createContact(person: Person, agentId: number | null) {
  const [firstName, ...rest] = person.name.trim().split(/\s+/)
  // REBS returns the existing contact when the phone number is already known.
  const contact = await rebsPost<{ id: number }>('/api/contacts/', {
    first_name: firstName,
    last_name: rest.join(' '),
    phone: person.phone,
    ...(person.email ? { email: person.email } : {}),
    ...(agentId ? { agents: [agentId] } : {}),
  })
  return contact.id
}

function lines(rows: [string, string | number | null | undefined][]) {
  return rows.filter(([, value]) => value !== undefined && value !== null && value !== '').map(([label, value]) => `${label}: ${value}`).join('\n')
}

export type CrmResult = { contactId: number; requestId?: number; activityId?: number }

export function describeCrmResult(result: CrmResult) {
  return [`contact #${result.contactId}`, result.requestId && `cerere #${result.requestId}`, result.activityId && `activitate #${result.activityId}`]
    .filter(Boolean).join(', ')
}

// A visitor asking about a listing becomes a contact plus a request linked to that property.
async function createPropertyRequest(person: Person, listing: Listing, title: string, details: string, statusId?: number) {
  const agentId = listing.crm?.agentId || defaultAgentId
  const contactId = await createContact(person, agentId)
  const request = await rebsPost<{ id: number }>('/api/requests/', {
    title,
    details,
    contact_ids: [contactId],
    lead_source_name: LEAD_SOURCE,
    lead_property_id: listing.crm?.propertyId,
    transaction_type: listing.transaction === 'rent' ? 1 : 2,
    property_type: listing.crm?.propertyType,
    ...(agentId ? { agent: agentId } : {}),
    ...(statusId ? { pipeline_status: statusId } : {}),
  })
  return { contactId, requestId: request.id, agentId }
}

export async function pushViewingToRebs(input: Person & { note?: string | null; date: string; time: string; listing: Listing }) {
  const { listing } = input
  const lookups = await getLookups()
  const details = lines([
    ['Programare de pe site', `${input.date}, ora ${input.time}`],
    ['Proprietate', `${listing.title} (${listing.reference})`],
    ['Telefon', input.phone],
    ['E-mail', input.email],
    ['Observații client', input.note],
  ])
  const { contactId, requestId, agentId } = await createPropertyRequest(input, listing, `Vizionare ${listing.reference}: ${listing.title}`.slice(0, 200), details, lookups.viewingStatus)
  const activity = await rebsPost<{ id: number }>('/api/activities/', {
    title: `Vizionare ${listing.reference} – ${input.name} (de confirmat)`.slice(0, 200),
    details: `${details}\n\nProgramarea a fost făcută de client pe site. Sunați pentru confirmare.`,
    ...(lookups.viewingType ? { type: lookups.viewingType } : {}),
    date_from: bucharestTime(input.date, input.time),
    date_to: bucharestTime(input.date, input.time, 1),
    all_day: false,
    ...(agentId ? { user_ids: [agentId] } : {}),
    properties: [listing.crm?.propertyId],
    contacts: [contactId],
    requests: [requestId],
  })
  return { contactId, requestId, activityId: activity.id }
}

export async function pushInquiryToRebs(input: Person & { message: string; source: 'contact' | 'property' | 'valuation'; listing?: Listing | null }) {
  const { listing } = input
  if (listing?.crm) {
    const details = lines([['Mesaj de pe site', input.message], ['Telefon', input.phone], ['E-mail', input.email]])
    const { contactId, requestId } = await createPropertyRequest(input, listing, `Solicitare ${listing.reference}: ${listing.title}`.slice(0, 200), details)
    return { contactId, requestId }
  }
  const title = input.source === 'valuation' ? 'Evaluare / vânzare proprietate' : 'Mesaj formular contact'
  return createFollowUp(input, `${title} – ${input.name}`, lines([['Mesaj', input.message], ['Telefon', input.phone], ['E-mail', input.email]]))
}

export async function pushCreditToRebs(input: Person & { summary: string }) {
  return createFollowUp(input, `Cerere credit imobiliar – ${input.name}`, input.summary)
}

// Messages without a listing (sellers, credit, general questions) become a contact with a to-do for the team.
async function createFollowUp(person: Person, title: string, details: string): Promise<CrmResult> {
  const lookups = await getLookups()
  const contactId = await createContact(person, defaultAgentId)
  const activity = await rebsPost<{ id: number }>('/api/activities/', {
    title: title.slice(0, 200),
    details: `${details}\n\nSursă: ${LEAD_SOURCE}`,
    ...(lookups.todoType ? { type: lookups.todoType } : {}),
    date_from: new Date().toISOString(),
    all_day: false,
    ...(defaultAgentId ? { user_ids: [defaultAgentId] } : {}),
    contacts: [contactId],
  })
  return { contactId, activityId: activity.id }
}

// Returns the text stored on the local record, so the team can see whether the CRM got the request.
export async function syncToRebs(task: () => Promise<CrmResult>) {
  try {
    return `Trimis în REBS: ${describeCrmResult(await task())}`
  } catch (error) {
    console.error('[REBS] Solicitarea nu a putut fi trimisă:', error)
    return `Eroare la trimiterea în REBS: ${error instanceof Error ? error.message : String(error)}`.slice(0, 500)
  }
}
