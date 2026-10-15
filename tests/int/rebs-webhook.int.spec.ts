// @vitest-environment node
import { createHmac } from 'crypto'
import { beforeAll, describe, expect, it, vi } from 'vitest'

const revalidateTag = vi.fn()
vi.mock('next/cache', () => ({ revalidateTag, unstable_cache: (fn: unknown) => fn }))

const key = Buffer.from('test-secret-key-for-webhooks').toString('base64')
let POST: (request: Request) => Promise<Response>

function signedRequest(body: string, { timestamp = Math.floor(Date.now() / 1000), secret = key } = {}) {
  const id = 'evt_1_1'
  const signature = createHmac('sha256', Buffer.from(secret, 'base64')).update(`${id}.${timestamp}.${body}`).digest('base64')
  return new Request('http://localhost/api/rebs/webhook', {
    method: 'POST',
    body,
    headers: { 'webhook-id': id, 'webhook-timestamp': String(timestamp), 'webhook-signature': `v1,${signature}` },
  })
}

describe('REBS webhook', () => {
  beforeAll(async () => {
    vi.stubEnv('REBS_WEBHOOK_SECRET', `whsec_${key}`)
    POST = (await import('@/app/api/rebs/webhook/route')).POST
  })

  it('refreshes listings on a signed property event', async () => {
    const response = await POST(signedRequest(JSON.stringify({ id: 'evt_1_1', type: 'property.updated', data: { id: 1 } })))
    expect(response.status).toBe(200)
    expect(revalidateTag).toHaveBeenCalledWith('rebs-properties', { expire: 0 })
  })

  it('accepts a ping without refreshing', async () => {
    revalidateTag.mockClear()
    const response = await POST(signedRequest(JSON.stringify({ id: 'evt_1_1', type: 'ping', data: { endpoint_id: 7 } })))
    expect(response.status).toBe(200)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('rejects a wrong signature', async () => {
    const other = Buffer.from('another-key').toString('base64')
    const response = await POST(signedRequest('{"type":"property.deleted"}', { secret: other }))
    expect(response.status).toBe(401)
  })

  it('rejects an old event', async () => {
    const response = await POST(signedRequest('{"type":"property.deleted"}', { timestamp: Math.floor(Date.now() / 1000) - 600 }))
    expect(response.status).toBe(401)
  })
})
