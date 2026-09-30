import { ArrowLeft, ArrowRight, Bath, BedDouble, Calendar, CalendarDays, Check, Maximize2, MessageCircle, Phone, Ruler, Zap } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/Footer'
import { AgentPhoto } from '@/components/AgentPhoto'
import { Header } from '@/components/Header'
import { PropertyCard } from '@/components/PropertyCard'
import { PropertyGallery } from '@/components/PropertyGallery'
import { PropertySummary } from '@/components/PropertySummary'
import { ViewingScheduler } from '@/components/ViewingScheduler'
import { getListings, getSettings, getSimilarListings } from '@/lib/site-data'

function getViewingDates() {
  const dates: { value: string; weekday: string; day: string; month: string }[] = []
  const cursor = new Date()
  cursor.setHours(12, 0, 0, 0)

  while (dates.length < 8) {
    cursor.setDate(cursor.getDate() + 1)
    if (cursor.getDay() === 0 || cursor.getDay() === 6) continue
    const value = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`
    dates.push({
      value,
      weekday: cursor.toLocaleDateString('ro-RO', { weekday: 'short' }).replace('.', ''),
      day: String(cursor.getDate()),
      month: cursor.toLocaleDateString('ro-RO', { month: 'short' }).replace('.', ''),
    })
  }
  return dates
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const property = (await getListings()).find((item) => item.slug === slug)
  return property
    ? { title: property.title, description: property.shortDescription, openGraph: { title: property.title, description: property.shortDescription || undefined, images: [property.cover] } }
    : { title: 'Proprietate' }
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [settings, listings] = await Promise.all([getSettings(), getListings()])
  const property = listings.find((item) => item.slug === slug)
  if (!property) notFound()
  const agent = property.agent
  const viewingDates = getViewingDates()
  const similar = getSimilarListings(listings, property)
  const phone = agent?.phone || settings.phone || ''
  const phoneHref = `tel:${phone.replace(/\s/g, '')}`
  const propertyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/proprietati/${property.slug}`
  const whatsappHref = settings.whatsapp
    ? `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(`Bună ziua, mă interesează proprietatea „${property.title}” (LC-${String(Math.abs(property.id)).padStart(4, '0')}). ${propertyUrl}`)}`
    : null

  return (
    <>
      <Header settings={settings} current={`/proprietati?tranzactie=${property.transaction}`} />
      <PropertySummary property={property} />
      <section className="property-detail">
        <div className="container">
          <Link className="back-link" href="/proprietati"><ArrowLeft size={17} /> Înapoi la proprietăți</Link>
          <PropertyGallery images={property.gallery} title={property.title} />
          <div className="property-detail__grid">
            <div className="property-main">
              <div className="facts-grid">
                {property.area && <div><Maximize2 /><span>Suprafață</span><strong>{property.area} m²</strong></div>}
                {property.rooms && <div><BedDouble /><span>Camere</span><strong>{property.rooms}</strong></div>}
                {property.bathrooms && <div><Bath /><span>Băi</span><strong>{property.bathrooms}</strong></div>}
                {property.landArea && <div><Ruler /><span>Teren</span><strong>{property.landArea} m²</strong></div>}
                {property.yearBuilt && <div><Calendar /><span>An</span><strong>{property.yearBuilt}</strong></div>}
                {property.energyClass && <div><Zap /><span>Clasă energie</span><strong>{property.energyClass}</strong></div>}
              </div>
              <div className="property-copy"><span className="eyebrow">Despre proprietate</span><h2>Un loc gândit pentru viața de zi cu zi.</h2><p>{property.description}</p></div>
              {!!property.features?.length && <div className="features"><h2>Dotări și avantaje</h2><div>{property.features.map((item) => <span key={item.id || item.feature}><Check size={17} />{item.feature}</span>)}</div></div>}
            </div>
            <aside className="agent-card" id="vizionare">
              <span className="eyebrow">Programează o vizionare</span>
              {agent && <div className="agent-card__person"><AgentPhoto name={agent.name} src={agent.photoUrl} className="agent-card__avatar" sizes="64px" /><div><strong>{agent.name}</strong><span>{agent.role}</span></div></div>}
              <p>Îți răspundem la întrebări și stabilim o vizionare în ritmul tău.</p>
              <ViewingScheduler propertyId={property.id} propertyTitle={property.title} dates={viewingDates} />
              <a className="button button--dark" href={phoneHref}>{phone}<Phone size={17} /></a>
              {whatsappHref && <a className="button button--outline" href={whatsappHref} target="_blank" rel="noreferrer">Scrie pe WhatsApp<MessageCircle size={17} /></a>}
              <Link className="text-link agent-card__message" href={`/contact?proprietate=${encodeURIComponent(property.title)}&id=${property.id}`}>Preferi e-mailul? Trimite un mesaj</Link>
              <small>ID proprietate: LC-{String(Math.abs(property.id)).padStart(4, '0')}</small>
            </aside>
          </div>
        </div>
      </section>
      {similar.length > 0 && <section className="section section--cream similar-section">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div><span className="eyebrow">Te-ar putea interesa</span><h2>Proprietăți similare</h2></div>
            <Link className="text-link" href={`/proprietati?tranzactie=${property.transaction}`}>Vezi toate proprietățile <ArrowRight size={17} /></Link>
          </div>
          <div className="property-grid">{similar.map((item) => <PropertyCard property={item} key={item.id} />)}</div>
        </div>
      </section>}
      <nav className="mobile-actions" aria-label="Contact rapid">
        <a href={phoneHref}><Phone size={18} />Sună</a>
        {whatsappHref && <a href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={18} />WhatsApp</a>}
        <a className="mobile-actions__primary" href="#vizionare"><CalendarDays size={18} />Vizionare</a>
      </nav>
      <Footer settings={settings} />
    </>
  )
}
