import { ArrowRight, BadgeCheck, Building2, Home, KeyRound, Landmark, LandPlot, MessageCircle, MessageSquareText, Phone, Search, ShieldCheck, Store } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PropertyCard } from '@/components/PropertyCard'
import { SearchFilters } from '@/components/SearchFilters'
import { getAgents, getListings, getSettings } from '@/lib/site-data'

export default async function HomePage() {
  const [settings, listings, agents] = await Promise.all([getSettings(), getListings(), getAgents()])
  const sebastian = agents.find((agent) => agent.name === 'Sebastian Hepes')
  const featured = listings.filter((property) => property.featured).slice(0, 3)
  const visibleListings = featured.length === 3 ? featured : listings.slice(0, 3)

  return (
    <>
      <section className="hero">
        <Image className="hero__image" src="/images/hero-villa.webp" alt="Vilă contemporană într-o zonă verde" fill priority sizes="100vw" />
        <div className="hero__shade" />
        <Header settings={settings} overlay current="/" />
        <div className="container hero__content">
          <span className="eyebrow eyebrow--light">Imobiliare în {settings.city} și împrejurimi</span>
          <h1>{settings.heroTitle}</h1>
          <p>{settings.heroSubtitle}</p>
          <div className="hero__actions">
            <Link className="button button--light" href="/proprietati">Descoperă proprietățile <ArrowRight size={18} /></Link>
            <Link className="text-link text-link--light" href="/contact?tip=evaluare">Vreau să vând o proprietate</Link>
          </div>
        </div>
        <div className="hero-search-wrap container"><SearchFilters variant="hero" /></div>
        <nav className="container property-types" aria-label="Caută după tipul proprietății">
          <Link href="/proprietati?tip=apartment"><Building2 /><span>Apartamente</span></Link>
          <Link href="/proprietati?tip=house"><Home /><span>Case / Vile</span></Link>
          <Link href="/proprietati?tip=penthouse"><Building2 /><span>Penthouse-uri</span></Link>
          <Link href="/proprietati?tip=land"><LandPlot /><span>Terenuri</span></Link>
          <Link href="/proprietati?tip=commercial"><Store /><span>Spații comerciale</span></Link>
        </nav>
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

      {sebastian && <section className="section consultant-section">
        <div className="container consultant-grid">
          <div className="consultant-photo"><Image src={sebastian.photoUrl} alt="Sebastian Hepes, consultant imobiliar" fill quality={90} sizes="(max-width: 800px) 100vw, 42vw" /></div>
          <div className="consultant-copy">
            <span className="eyebrow">Consultantul tău imobiliar</span>
            <h2>Sebastian Hepes</h2>
            <p className="consultant-role">{sebastian.role} · {settings.agencyName}</p>
            <p>{sebastian.bio}</p>
            <div className="consultant-services"><span>Cumpărare</span><span>Vânzare</span><span>Închiriere</span></div>
            <div className="consultant-actions">
              <Link className="button button--dark" href="/contact">Discută cu Sebastian <ArrowRight size={18} /></Link>
              <a className="button button--outline" href={`tel:${(sebastian.phone || settings.phone || '').replace(/\s/g, '')}`}><Phone size={17} /> {sebastian.phone || settings.phone}</a>
            </div>
            <dl className="consultant-stats">
              <div><dt>proprietăți tranzacționate</dt><dd>180+</dd></div>
              <div><dt>clienți din recomandări</dt><dd>96%</dd></div>
              <div><dt>evaluare medie clienți</dt><dd>4.9/5</dd></div>
            </dl>
          </div>
        </div>
      </section>}

      <section className="section process-section" id="servicii">
        <div className="container process-grid">
          <div className="process-intro">
            <span className="eyebrow">Cum lucrăm</span>
            <h2>O decizie mare.<br />Un proces simplu.</h2>
            <p>Ținem lucrurile clare de la prima discuție până la semnătură. Știi mereu ce urmează, ce acte sunt necesare și de ce.</p>
            <Link className="text-link" href="/contact">Hai să discutăm <ArrowRight size={17} /></Link>
          </div>
          <div className="process-list">
            <article><MessageSquareText /><span>01</span><h3>Înțelegem ce contează</h3><p>Buget, zonă, ritm de viață și lucrurile la care nu vrei să renunți.</p></article>
            <article><Search /><span>02</span><h3>Selectăm, nu doar căutăm</h3><p>Primești o listă scurtă de opțiuni relevante, cu informațiile esențiale verificate.</p></article>
            <article><ShieldCheck /><span>03</span><h3>Negociem și verificăm</h3><p>Te ajutăm cu oferta, documentele și fiecare detaliu până la tranzacție.</p></article>
            <article><KeyRound /><span>04</span><h3>Rămânem aproape</h3><p>Predarea cheilor nu încheie relația. Suntem aici și după mutare.</p></article>
          </div>
        </div>
      </section>

      <section className="credit-slide-section">
        <Link className="container credit-slide" href="/credit">
          <div className="credit-slide__icon"><Landmark /></div>
          <div className="credit-slide__copy">
            <span className="eyebrow eyebrow--light">Credit imobiliar</span>
            <h2>Ai găsit locul.<br />Hai să clarificăm finanțarea.</h2>
            <p>Lucrăm în echipă cu un consultant financiar partener pentru credit ipotecar, refinanțare și împrumuturi bancare.</p>
          </div>
          <div className="credit-slide__action">
            <span><BadgeCheck size={17} /> Cerere fără obligații</span>
            <strong>Solicită o analiză <ArrowRight size={18} /></strong>
          </div>
        </Link>
      </section>

      <section className="section cta-section">
        <div className="container cta-panel">
          <div>
            <span className="eyebrow eyebrow--light">Începem cu o conversație</span>
            <h2>Spune-ne ce cauți. Noi știm de unde să începem.</h2>
            <p>Răspundem de regulă în aceeași zi lucrătoare, fără obligații și fără presiune.</p>
          </div>
          <div className="cta-panel__actions">
            <Link className="button button--light" href="/contact">Programează o discuție <ArrowRight size={18} /></Link>
            <a className="cta-option" href={`tel:${(settings.phone || '').replace(/\s/g, '')}`}><Phone size={18} /><span><small>Sună-ne</small>{settings.phone}</span></a>
            {settings.whatsapp && <a className="cta-option" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle size={18} /><span><small>WhatsApp</small>Scrie-ne un mesaj</span></a>}
          </div>
        </div>
      </section>
      <Footer settings={settings} />
    </>
  )
}
