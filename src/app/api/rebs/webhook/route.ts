import { createHmac, timingSafeEqual } from 'crypto'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

import { REBS_PROPERTIES_TAG } from '@/lib/rebs-listings'

const secret = process.env.REBS_WEBHOOK_SECRET || ''

// Standard Webhooks signature: base64 HMAC-SHA256 of "{id}.{timestamp}.{body}" with the base64 part of whsec_….
function validSignature(id: string, timestamp: string, body: string, header: string) {
  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
  const expected = Buffer.from(createHmac('sha256', key).update(`${id}.${timestamp}.${body}`).digest('base64'))
  // During a secret rotation the header holds two space-separated signatures.
  return header.split(' ').some((part) => {
    const signature = Buffer.from(part.replace(/^v1,/, ''))
    return signature.length === expected.length && timingSafeEqual(signature, expected)
  })
}

export async function POST(request: Request) {
  if (!secret) return NextResponse.json({ error: 'Webhook neconfigurat.' }, { status: 503 })

  const body = await request.text()
  const id = request.headers.get('webhook-id') || ''
  const timestamp = request.headers.get('webhook-timestamp') || ''
  const signature = request.headers.get('webhook-signature') || ''
  const age = Math.abs(Date.now() / 1000 - Number(timestamp))

  if (!id || !Number.isFinite(age) || age > 300 || !validSignature(id, timestamp, body, signature)) {
    return NextResponse.json({ error: 'Semnătură invalidă.' }, { status: 401 })
  }

  const event = JSON.parse(body) as { type?: string }
  // Any change to a property (new, edited, sold, photos, agent) refreshes the listings on the next visit.
  if (event.type?.startsWith('property.')) revalidateTag(REBS_PROPERTIES_TAG, { expire: 0 })

  return NextResponse.json({ ok: true })
}
