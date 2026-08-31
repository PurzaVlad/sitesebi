import { ArrowUpRight, Camera, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

import type { SiteSetting } from '@/payload-types'
import { Logo } from './Logo'

export function Footer({ settings }: { settings: SiteSetting }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-intro">
          <Logo light />
          <p>Imobiliare explicate simplu. Proprietăți atent selectate, consultanță onestă și timp pentru decizia ta.</p>
        </div>
        <div>
          <h3>Explorează</h3>
          <Link href="/proprietati">Proprietăți</Link>
          <Link href="/credit">Credit</Link>
          <Link href="/echipa">Echipa</Link>
          <Link href="/#servicii">Servicii</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div>
          <h3>Contact</h3>
          <a href={`tel:${(settings.phone || '').replace(/\s/g, '')}`}><Phone size={15} />{settings.phone}</a>
          <a href={`mailto:${settings.email}`}><Mail size={15} />{settings.email}</a>
          <span><MapPin size={15} />{settings.address}</span>
        </div>
        <div className="footer-cta">
          <h3>Ai o proprietate?</h3>
          <p>Primești o evaluare realistă și un plan clar de promovare.</p>
          <Link href="/contact?tip=evaluare">Solicită o evaluare <ArrowUpRight size={17} /></Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {settings.agencyName}. Toate drepturile rezervate.</span>
        <div><Link href="/politica-confidentialitate">Confidențialitate</Link>{settings.instagram && <a href={settings.instagram} aria-label="Instagram"><Camera size={16} /></a>}</div>
      </div>
    </footer>
  )
}
