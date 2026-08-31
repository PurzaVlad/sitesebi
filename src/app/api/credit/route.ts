import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'

function value(form: FormData, key: string) {
  return String(form.get(key) || '').trim()
}

function numericValue(form: FormData, key: string) {
  const parsed = Number(value(form, key).replace(',', '.'))
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
}

export async function POST(request: Request) {
  const form = await request.formData()
  if (value(form, 'website')) return NextResponse.redirect(new URL('/credit?trimis=da', request.url), 303)

  const name = value(form, 'name')
  const phone = value(form, 'phone')
  const email = value(form, 'email')
  const rawPurpose = value(form, 'purpose')
  const purpose = rawPurpose === 'refinance' || rawPurpose === 'other' ? rawPurpose : 'purchase'
  const requestedAmount = numericValue(form, 'requestedAmount')
  const downPayment = numericValue(form, 'downPayment')
  const monthlyIncome = numericValue(form, 'monthlyIncome')
  const message = value(form, 'message')

  if (name.length < 2 || phone.length < 6 || !requestedAmount || requestedAmount < 1000) {
    return NextResponse.redirect(new URL('/credit?eroare=date', request.url), 303)
  }

  const payload = await getPayload({ config })
  await payload.create({
    collection: 'credit-requests',
    data: {
      name,
      phone,
      email: email || undefined,
      purpose,
      requestedAmount,
      downPayment,
      monthlyIncome,
      message: message || undefined,
    },
  })

  return NextResponse.redirect(new URL('/credit?trimis=da', request.url), 303)
}
