import { NextResponse } from 'next/server'
import { getPayload, type Where } from 'payload'

import config from '@/payload.config'

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

function slotConditions(propertyId: number, propertyTitle: string, date: string): Where[] {
  const property: Where = propertyId > 0
    ? { property: { equals: propertyId } }
    : { propertyTitle: { equals: propertyTitle } }
  return [{ date: { equals: date } }, property, { status: { not_equals: 'cancelled' } }]
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
  const result = await payload.find({
    collection: 'viewings',
    limit: 20,
    where: { and: slotConditions(propertyId, propertyTitle, date) },
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
  const propertyTitle = String(body.propertyTitle || '').trim()
  const propertyId = Number(body.propertyId)

  if (name.length < 2 || phone.length < 6 || !propertyTitle || !validDate(date) || !allowedTimes.includes(time as typeof allowedTimes[number])) {
    return NextResponse.json({ error: 'Completează datele obligatorii.' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const existing = await payload.find({
    collection: 'viewings',
    limit: 1,
    where: {
      and: [
        ...slotConditions(propertyId, propertyTitle, date),
        { time: { equals: time } },
      ],
    },
  })

  if (existing.totalDocs > 0) {
    return NextResponse.json({ error: 'Intervalul tocmai a fost rezervat. Alege altă oră.' }, { status: 409 })
  }

  await payload.create({
    collection: 'viewings',
    data: {
      name,
      phone,
      email: email || undefined,
      note: note || undefined,
      date,
      time: time as typeof allowedTimes[number],
      propertyTitle,
      ...(propertyId > 0 ? { property: propertyId } : {}),
    },
  })

  return NextResponse.json({ ok: true })
}
