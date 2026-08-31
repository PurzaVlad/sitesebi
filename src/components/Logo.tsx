import Image from 'next/image'
import Link from 'next/link'

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link className={`logo${light ? ' logo--light' : ''}`} href="/" aria-label="LC Estate Partners — pagina principală">
      <Image className="logo__image" src="/images/lc-estate-logo-web.png" alt="LC Estate Partners" width={581} height={512} priority />
    </Link>
  )
}
