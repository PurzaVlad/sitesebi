import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const draft = await draftMode()
  draft.disable()
  const back = new URL(request.url).searchParams.get('inapoi') || '/'
  // Only same-site paths, never an external redirect.
  const path = back.startsWith('/') && !back.startsWith('//') ? back : '/'
  return NextResponse.redirect(new URL(path, request.url), 303)
}
