import { ArrowLeft, Bath, BedDouble, Calendar, Check, Maximize2, MessageCircle, Phone, Ruler, Zap } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { ViewingScheduler } from '@/components/ViewingScheduler'
import { formatPrice, getListingBySlug, getSettings, typeLabels } from '@/lib/site-data'

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
  const property = await getListingBySlug(slug)
  return property ? { title: property.title, description: property.shortDescription } : { title: 'Proprietate' }
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [settings, property] = await Promise.all([getSettings(), getListingBySlug(slug)])
  if (!property) notFound()
  const agent = property.agent
  const viewingDates = getViewingDates()

  return (
    <>
      <Header settings={settings} />
      <section className="property-detail">
        <div className="container">
          <Link className="back-link" href="/proprietati"><ArrowLeft size={17} /> Înapoi la proprietăți</Link>
          <div className="property-detail__heading">
            <div><div className="property-detail__tags"><span>{property.transaction === 'sale' ? 'De vânzare' : 'De închiriat'}</span><span>{typeLabels[property.propertyType]}</span></div><h1>{property.title}</h1><p>{property.location}</p></div>
            <strong>{formatPrice(property)}</strong>
          </div>
          <div className="gallery-grid">
            {property.gallery.slice(0, 3).map((image, index) => <div className={`gallery-grid__item gallery-grid__item--${index + 1}`} key={image}><Image src={image} fill alt={`${property.title} — imagine ${index + 1}`} priority={index === 0} sizes={index === 0 ? '(max-width: 800px) 100vw, 66vw' : '34vw'} /></div>)}
          </div>
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
            <aside className="agent-card">
              <span className="eyebrow">Programează o vizionare</span>
              {agent && <div className="agent-card__person"><div className="agent-card__avatar">{agent.name.split(' ').map((word) => word[0]).slice(0, 2).join('')}</div><div><strong>{agent.name}</strong><span>{agent.role}</span></div></div>}
              <p>Îți răspundem la întrebări și stabilim o vizionare în ritmul tău.</p>
              <ViewingScheduler propertyId={property.id} propertyTitle={property.title} dates={viewingDates} />
              <a className="button button--dark" href={`tel:${(agent?.phone || settings.phone || '').replace(/\s/g, '')}`}>{agent?.phone || settings.phone}<Phone size={17} /></a>
              <Link className="button button--outline" href={`/contact?proprietate=${encodeURIComponent(property.title)}&id=${property.id}`}>Trimite un mesaj<MessageCircle size={17} /></Link>
              <small>ID proprietate: LC-{String(Math.abs(property.id)).padStart(4, '0')}</small>
            </aside>
          </div>
        </div>
      </section>
      <Footer settings={settings} />
    </>
  )
}
