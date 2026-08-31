import { Menu, Phone, X } from 'lucide-react'
import Link from 'next/link'

import type { SiteSetting } from '@/payload-types'
import { Logo } from './Logo'

const links = [
  { href: '/proprietati', label: 'Proprietăți' },
  { href: '/credit', label: 'Credit' },
  { href: '/echipa', label: 'Echipa' },
  { href: '/contact', label: 'Contact' },
]

export function Header({ settings, overlay = false }: { settings: SiteSetting; overlay?: boolean }) {
  const phoneHref = `tel:${(settings.phone || '').replace(/\s/g, '')}`

  return (
    <header className={`site-header${overlay ? ' site-header--overlay' : ''}`}>
      <div className="container site-header__inner">
        <Logo light={overlay} />
        <nav className="desktop-nav" aria-label="Navigație principală">
          {links.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
        </nav>
        <a className="header-phone" href={phoneHref}><Phone size={16} /> {settings.phone}</a>
        <details className="mobile-menu">
          <summary aria-label="Deschide meniul"><Menu className="menu-open" /><X className="menu-close" /></summary>
          <div className="mobile-menu__panel">
            <nav aria-label="Navigație mobilă">
              {links.map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
            </nav>
            <a className="button button--dark" href={phoneHref}>Sună-ne <Phone size={17} /></a>
          </div>
        </details>
      </div>
    </header>
  )
}
