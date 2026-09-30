'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { Eye } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

// Shown only in draft mode: marks the page as a preview and reloads it on every admin save.
export function PreviewBar() {
  const router = useRouter()
  const pathname = usePathname()
  const serverURL = typeof window === 'undefined' ? '' : window.location.origin

  return (
    <>
      <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={serverURL} />
      <form className="preview-bar" action={`/api/preview/exit?inapoi=${encodeURIComponent(pathname)}`} method="post">
        <span><Eye size={16} /> Previzualizare: vezi și modificările nepublicate.</span>
        <button type="submit">Ieși din previzualizare</button>
      </form>
    </>
  )
}
