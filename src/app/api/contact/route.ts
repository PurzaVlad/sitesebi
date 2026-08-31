import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'

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

  const payload = await getPayload({ config })
  await payload.create({
    collection: 'leads',
    data: {
      name,
      phone,
      email: email || undefined,
      message,
      source,
      ...(propertyId > 0 ? { property: propertyId } : {}),
    },
  })

  return NextResponse.redirect(new URL('/contact?trimis=da', request.url), 303)
}
