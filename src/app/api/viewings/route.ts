import { after, NextResponse } from 'next/server'
import { getPayload, type Where } from 'payload'

import config from '@/payload.config'
import { pushViewingToRebs, syncToRebs } from '@/lib/rebs-leads'
import { getListings, type Listing } from '@/lib/site-data'

const allowedTimes = ['10:00', '12:00', '15:00', '17:00'] as const

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const selected = new Date(`${value}T12:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const limit = new Date(today)
  limit.setDate(limit.getDate() + 60)
  return selected >= today && selected <= limit && selected.getDay() !== 0 && selected.getDay() !== 6
}

function slotConditions(listing: Listing | undefined, propertyId: number, propertyTitle: string, date: string): Where[] {
  const property: Where = listing?.crm
    ? { crmPropertyId: { equals: listing.crm.propertyId } }
    : propertyId > 0
      ? { property: { equals: propertyId } }
      : { propertyTitle: { equals: propertyTitle } }
  return [{ date: { equals: date } }, property, { status: { not_equals: 'cancelled' } }]
}

async function findListing(propertyId: number) {
  return propertyId ? (await getListings()).find((item) => item.id === propertyId) : undefined
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const date = url.searchParams.get('date') || ''
  const propertyId = Number(url.searchParams.get('propertyId'))
  const propertyTitle = url.searchParams.get('propertyTitle') || ''

  if (!validDate(date) || (!propertyTitle && propertyId <= 0)) {
    return NextResponse.json({ error: 'Parametri invalizi.' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const listing = await findListing(propertyId)
  const result = await payload.find({
    collection: 'viewings',
    limit: 20,
    where: { and: slotConditions(listing, propertyId, propertyTitle, date) },
  })

  return NextResponse.json({ booked: result.docs.map((viewing) => viewing.time) })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null
  if (!body || String(body.company || '')) return NextResponse.json({ ok: true })

  const name = String(body.name || '').trim()
  const phone = String(body.phone || '').trim()
  const email = String(body.email || '').trim()
  const note = String(body.note || '').trim()
  const date = String(body.date || '')
  const time = String(body.time || '')
  const propertyId = Number(body.propertyId)
  const listing = await findListing(propertyId)
  // Trust the server's copy of the title when the listing is known.
  const propertyTitle = listing?.title || String(body.propertyTitle || '').trim()

  if (name.length < 2 || phone.length < 6 || !propertyTitle || !validDate(date) || !allowedTimes.includes(time as typeof allowedTimes[number])) {
    return NextResponse.json({ error: 'Completează datele obligatorii.' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const existing = await payload.find({
    collection: 'viewings',
    limit: 1,
    where: {
      and: [
        ...slotConditions(listing, propertyId, propertyTitle, date),
        { time: { equals: time } },
      ],
    },
  })

  if (existing.totalDocs > 0) {
    return NextResponse.json({ error: 'Intervalul tocmai a fost rezervat. Alege altă oră.' }, { status: 409 })
  }

  const viewing = await payload.create({
    collection: 'viewings',
    data: {
      name,
      phone,
      email: email || undefined,
      note: note || undefined,
      date,
      time: time as typeof allowedTimes[number],
      propertyTitle: listing?.crm ? `${propertyTitle} (${listing.reference})` : propertyTitle,
      ...(listing?.crm ? { crmPropertyId: listing.crm.propertyId } : propertyId > 0 ? { property: propertyId } : {}),
    },
  })

  // The visitor gets the confirmation right away; the CRM copy is created after the response.
  if (listing?.crm) {
    after(async () => {
      const crmStatus = await syncToRebs(() => pushViewingToRebs({ name, phone, email, note, date, time, listing }))
      await payload.update({ collection: 'viewings', id: viewing.id, data: { crmStatus } })
    })
  }

  return NextResponse.json({ ok: true })
}
