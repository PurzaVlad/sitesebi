import { after, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { rebsEnabled } from '@/lib/rebs'
import { pushInquiryToRebs, syncToRebs } from '@/lib/rebs-leads'
import { getListings } from '@/lib/site-data'

function value(form: FormData, key: string) {
  return String(form.get(key) || '').trim()
}

export async function POST(request: Request) {
  const form = await request.formData()
  if (value(form, 'website')) return NextResponse.redirect(new URL('/contact?trimis=da', request.url), 303)

  const name = value(form, 'name')
  const phone = value(form, 'phone')
  const email = value(form, 'email')
  const message = value(form, 'message')
  const rawSource = value(form, 'source')
  const source = rawSource === 'valuation' || rawSource === 'property' ? rawSource : 'contact'
  const propertyId = Number(value(form, 'propertyId'))

  if (name.length < 2 || phone.length < 6 || message.length < 5) {
    return NextResponse.redirect(new URL('/contact?eroare=date', request.url), 303)
  }

  const listing = propertyId ? (await getListings()).find((item) => item.id === propertyId) : undefined
  const payload = await getPayload({ config })
  const lead = await payload.create({
    collection: 'leads',
    data: {
      name,
      phone,
      email: email || undefined,
      message: listing?.crm ? `${message}\n\nProprietate: ${listing.title} (${listing.reference})` : message,
      source,
      ...(listing?.crm ? { crmPropertyId: listing.crm.propertyId } : propertyId > 0 ? { property: propertyId } : {}),
    },
  })

  if (rebsEnabled) {
    after(async () => {
      const crmStatus = await syncToRebs(() => pushInquiryToRebs({ name, phone, email, message, source, listing }))
      await payload.update({ collection: 'leads', id: lead.id, data: { crmStatus } })
    })
  }

  return NextResponse.redirect(new URL('/contact?trimis=da', request.url), 303)
}
