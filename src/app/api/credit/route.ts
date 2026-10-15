import { after, NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { rebsEnabled } from '@/lib/rebs'
import { pushCreditToRebs, syncToRebs } from '@/lib/rebs-leads'

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
  const purpose = rawPurpose === 'refinance' || rawPurpose === 'loan' || rawPurpose === 'other' ? rawPurpose : 'purchase'
  const requestedAmount = numericValue(form, 'requestedAmount')
  const downPayment = numericValue(form, 'downPayment')
  const monthlyIncome = numericValue(form, 'monthlyIncome')
  const message = value(form, 'message')

  if (name.length < 2 || phone.length < 6 || !requestedAmount || requestedAmount < 1000) {
    return NextResponse.redirect(new URL('/credit?eroare=date', request.url), 303)
  }

  const payload = await getPayload({ config })
  const creditRequest = await payload.create({
    collection: 'credit-requests',
    data: {
      name,
      phone,
      email: email || undefined,
      purpose,
      requestedAmount,
      downPayment,
      monthlyIncome,
      notaryHelp: value(form, 'notaryHelp') === 'da',
      message: message || undefined,
    },
  })

  if (rebsEnabled) {
    const purposes = { purchase: 'Credit ipotecar', refinance: 'Refinanțare', loan: 'Împrumut bancar', other: 'Alt scop' }
    const summary = [
      ['Tip', purposes[purpose]], ['Suma dorită', `${requestedAmount} €`], ['Avans', downPayment != null ? `${downPayment} €` : null],
      ['Venit net lunar', monthlyIncome != null ? `${monthlyIncome} lei` : null], ['Sprijin notar', value(form, 'notaryHelp') === 'da' ? 'Da' : 'Nu'],
      ['Detalii', message], ['Telefon', phone], ['E-mail', email],
    ].filter(([, text]) => text).map(([label, text]) => `${label}: ${text}`).join('\n')
    after(async () => {
      const crmStatus = await syncToRebs(() => pushCreditToRebs({ name, phone, email, summary }))
      await payload.update({ collection: 'credit-requests', id: creditRequest.id, data: { crmStatus } })
    })
  }

  return NextResponse.redirect(new URL('/credit?trimis=da', request.url), 303)
}
