import { Bath, BedDouble, LandPlot, MapPin, Maximize2, PanelsTopLeft } from 'lucide-react'
import Image from 'next/image'

import { formatPrice, type Listing, typeLabels } from '@/lib/site-data'

export function PropertySummary({ property }: { property: Listing }) {
  return (
    <section className="property-summary" aria-label="Informații principale despre proprietate">
      <Image className="property-summary__image" src={property.cover} alt="" fill priority sizes="100vw" />
      <div className="property-summary__shade" />
      <div className="container property-summary__inner">
        <div className="property-summary__heading">
          <div>
            <div className="property-summary__tags">
              <span>{property.transaction === 'sale' ? 'De vânzare' : 'De închiriat'}</span>
              <span>{typeLabels[property.propertyType]}</span>
              {property.status === 'reserved' && <span>Rezervată</span>}
            </div>
            <h1>{property.title}</h1>
          </div>
          <strong className="property-summary__price">{formatPrice(property)}</strong>
        </div>
        <p className="property-summary__location"><MapPin size={17} />{property.location}</p>
        <p className="property-summary__id">ID: LC-{String(Math.abs(property.id)).padStart(4, '0')}</p>
        <dl className="property-summary__facts">
          {property.rooms != null && <div><BedDouble aria-hidden="true" /><dt>Camere</dt><dd>{property.rooms}<span>{property.rooms === 1 ? 'Cameră' : 'Camere'}</span></dd></div>}
          {property.bathrooms != null && <div><Bath aria-hidden="true" /><dt>Băi</dt><dd>{property.bathrooms}<span>{property.bathrooms === 1 ? 'Baie' : 'Băi'}</span></dd></div>}
          {property.area != null && <div><Maximize2 aria-hidden="true" /><dt>Suprafață utilă</dt><dd>{new Intl.NumberFormat('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(property.area)}<span>m² utili</span></dd></div>}
          {property.floor ? <div><PanelsTopLeft aria-hidden="true" /><dt>Etaj</dt><dd className="property-summary__floor">{/^\d/.test(property.floor) && <span>Etaj</span>}{property.floor}</dd></div> : property.landArea != null && <div><LandPlot aria-hidden="true" /><dt>Teren</dt><dd>{property.landArea}<span>m² teren</span></dd></div>}
        </dl>
      </div>
    </section>
  )
}
