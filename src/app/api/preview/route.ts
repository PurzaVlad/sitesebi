import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@/payload.config'

// Opened by the admin "Preview" button and the Live Preview iframe.
export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get('slug') || ''
  if (!/^[a-z0-9-]+$/i.test(slug)) return new Response('Adresă invalidă.', { status: 400 })

  // Only a logged-in admin may see unpublished drafts.
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) return new Response('Autentifică-te în panoul de administrare pentru previzualizare.', { status: 401 })

  const draft = await draftMode()
  draft.enable()
  return NextResponse.redirect(new URL(`/proprietati/${slug}`, request.url))
}
