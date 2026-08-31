import { Search } from 'lucide-react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PropertyCard } from '@/components/PropertyCard'
import { SearchFilters } from '@/components/SearchFilters'
import { getListings, getSettings } from '@/lib/site-data'

export const metadata = { title: 'Proprietăți' }

type SearchParams = Promise<{ tranzactie?: string; tip?: string; zona?: string; pret?: string }>

export default async function PropertiesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const [settings, listings] = await Promise.all([getSettings(), getListings()])
  const zone = (params.zona || '').toLocaleLowerCase('ro')
  const maxPrice = Number(params.pret) || Infinity
  const transaction = params.tranzactie || 'sale'
  const filtered = listings.filter((property) =>
    property.transaction === transaction &&
    (!params.tip || property.propertyType === params.tip) &&
    (!zone || property.location.toLocaleLowerCase('ro').includes(zone)) &&
    property.price <= maxPrice,
  )

  return (
    <>
      <Header settings={settings} />
      <section className="page-hero page-hero--properties">
        <div className="container"><span className="eyebrow">Portofoliu actual</span><h1>Proprietăți alese<br />cu discernământ.</h1><p>Explorează selecția, filtrează simplu și cere detaliile care contează.</p></div>
      </section>
      <section className="listing-section">
        <div className="container">
          <SearchFilters variant="catalog" initial={params} />
          <div className="listing-results"><p><strong>{filtered.length}</strong> {filtered.length === 1 ? 'proprietate găsită' : 'proprietăți găsite'}</p></div>
          {filtered.length ? <div className="property-grid property-grid--catalog">{filtered.map((property) => <PropertyCard property={property} key={property.id} />)}</div> : <div className="empty-state"><Search size={30} /><h2>N-am găsit o potrivire exactă.</h2><p>Încearcă să elimini un filtru sau spune-ne direct ce cauți.</p><a className="button button--dark" href="/contact">Trimite-ne cerințele</a></div>}
        </div>
      </section>
      <Footer settings={settings} />
    </>
  )
}
