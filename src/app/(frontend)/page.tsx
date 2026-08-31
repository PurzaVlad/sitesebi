import { ArrowRight, BadgeCheck, BarChart3, Home, KeyRound, Landmark, MessageSquareText, Search, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PropertyCard } from '@/components/PropertyCard'
import { SearchFilters } from '@/components/SearchFilters'
import { getListings, getSettings } from '@/lib/site-data'

export default async function HomePage() {
  const [settings, listings] = await Promise.all([getSettings(), getListings()])
  const featured = listings.filter((property) => property.featured).slice(0, 3)
  const visibleListings = featured.length === 3 ? featured : listings.slice(0, 3)

  return (
    <>
      <section className="hero">
        <Image className="hero__image" src="/images/hero-villa.webp" alt="Vilă contemporană într-o zonă verde" fill priority sizes="100vw" />
        <div className="hero__shade" />
        <Header settings={settings} overlay />
        <div className="container hero__content">
          <h1>{settings.heroTitle}</h1>
          <p>{settings.heroSubtitle}</p>
          <div className="hero__actions">
            <Link className="button button--light" href="/proprietati">Descoperă proprietățile <ArrowRight size={18} /></Link>
            <Link className="text-link text-link--light" href="/contact?tip=evaluare">Vreau să vând o proprietate</Link>
          </div>
        </div>
        <div className="hero-search-wrap container"><SearchFilters variant="hero" /></div>
      </section>

      <section className="section section--cream">
        <div className="container section-heading section-heading--split">
          <div><span className="eyebrow">Selecția noastră</span><h2>Proprietăți care merită văzute.</h2></div>
          <p>Mai puține anunțuri, mai multă claritate. Verificăm informațiile și selectăm proprietăți pe care le-am recomanda cu încredere.</p>
        </div>
        <div className="container property-grid">
          {visibleListings.map((property, index) => <PropertyCard property={property} priority={index === 0} key={property.id} />)}
        </div>
        <div className="container section-action"><Link className="button button--outline" href="/proprietati">Vezi toate proprietățile <ArrowRight size={18} /></Link></div>
      </section>

      <section className="section process-section" id="servicii">
        <div className="container process-grid">
          <div className="process-intro">
            <span className="eyebrow">Cum lucrăm</span>
            <h2>O decizie mare.<br />Un proces simplu.</h2>
            <p>Ținem lucrurile clare de la prima discuție până la semnătură. Știi mereu ce urmează, ce acte sunt necesare și de ce.</p>
            <Link className="text-link" href="/contact">Hai să discutăm <ArrowRight size={17} /></Link>
          </div>
          <div className="process-list">
            <article><span>01</span><div><MessageSquareText /><h3>Înțelegem ce contează</h3><p>Buget, zonă, ritm de viață și lucrurile la care nu vrei să renunți.</p></div></article>
            <article><span>02</span><div><Search /><h3>Selectăm, nu doar căutăm</h3><p>Primești o listă scurtă de opțiuni relevante, cu informațiile esențiale verificate.</p></div></article>
            <article><span>03</span><div><ShieldCheck /><h3>Negociem și verificăm</h3><p>Te ajutăm cu oferta, documentele și fiecare detaliu până la tranzacție.</p></div></article>
            <article><span>04</span><div><KeyRound /><h3>Rămânem aproape</h3><p>Predarea cheilor nu încheie relația. Suntem aici și după mutare.</p></div></article>
          </div>
        </div>
      </section>

      <section className="credit-slide-section">
        <Link className="container credit-slide" href="/credit">
          <div className="credit-slide__icon"><Landmark /></div>
          <div className="credit-slide__copy">
            <span className="eyebrow eyebrow--light">Credit imobiliar</span>
            <h2>Ai găsit locul.<br />Hai să clarificăm finanțarea.</h2>
            <p>O analiză simplă, construită în jurul bugetului, avansului și planurilor tale.</p>
          </div>
          <div className="credit-slide__action">
            <span><BadgeCheck size={17} /> Cerere fără obligații</span>
            <strong>Solicită o analiză <ArrowRight size={18} /></strong>
          </div>
        </Link>
      </section>

      <section className="stats-strip">
        <div className="container stats-grid">
          <div><Home /><strong>180+</strong><span>proprietăți tranzacționate</span></div>
          <div><BarChart3 /><strong>96%</strong><span>clienți din recomandări</span></div>
          <div><MessageSquareText /><strong>4.9/5</strong><span>evaluare medie clienți</span></div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container cta-panel">
          <span className="eyebrow eyebrow--light">Începem cu o conversație</span>
          <h2>Spune-ne ce cauți.<br />Noi știm de unde să începem.</h2>
          <div><Link className="button button--light" href="/contact">Programează o discuție <ArrowRight size={18} /></Link><a className="cta-phone" href={`tel:${(settings.phone || '').replace(/\s/g, '')}`}>{settings.phone}</a></div>
        </div>
      </section>
      <Footer settings={settings} />
    </>
  )
}
