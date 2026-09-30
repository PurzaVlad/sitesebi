import { ArrowUpRight, Bath, BedDouble, Maximize2, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { formatPrice, formatPricePerArea, type Listing } from '@/lib/site-data'

export function PropertyCard({ property, priority = false }: { property: Listing; priority?: boolean }) {
  const pricePerArea = formatPricePerArea(property)

  return (
    <article className="property-card">
      <div className="property-card__image">
        <Image src={property.cover} alt="" fill sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw" priority={priority} />
        <span className="property-card__type">{property.transaction === 'sale' ? 'De vânzare' : 'De închiriat'}</span>
        {property.status === 'reserved' && <span className="property-card__status">Rezervată</span>}
      </div>
      <div className="property-card__content">
        <div className="property-card__location"><MapPin size={14} /> {property.location}</div>
        {/* The title link stretches over the whole card, so one tab stop opens the listing. */}
        <h3><Link className="property-card__link" href={`/proprietati/${property.slug}`}>{property.title}</Link></h3>
        <div className="property-card__meta">
          {property.rooms && <span><BedDouble size={16} />{property.rooms} camere</span>}
          {property.bathrooms && <span><Bath size={16} />{property.bathrooms} băi</span>}
          {property.area && <span><Maximize2 size={15} />{property.area} m²</span>}
        </div>
        <div className="property-card__footer">
          <div><strong>{formatPrice(property)}</strong>{pricePerArea && <small>{pricePerArea}</small>}</div>
          <span className="property-card__arrow" aria-hidden="true"><ArrowUpRight size={20} /></span>
        </div>
      </div>
    </article>
  )
}
