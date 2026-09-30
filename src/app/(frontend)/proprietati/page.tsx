import { Search } from 'lucide-react'
import Link from 'next/link'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PropertyCard } from '@/components/PropertyCard'
import { SearchFilters } from '@/components/SearchFilters'
import { SortSelect } from '@/components/SortSelect'
import { getListings, getSettings } from '@/lib/site-data'

export const metadata = { title: 'Proprietăți' }

type SearchParams = Promise<{ tranzactie?: string; tip?: string; zona?: string; pret?: string; pretMin?: string; sort?: string }>

export default async function PropertiesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const [settings, listings] = await Promise.all([getSettings(), getListings()])
  const zone = (params.zona || '').toLocaleLowerCase('ro')
  const parsedMax = Number(params.pret)
  const maxPrice = params.pret && Number.isFinite(parsedMax) && parsedMax >= 0 ? parsedMax : Infinity
  const minPrice = Math.max(0, Number(params.pretMin) || 0)
  const transaction = params.tranzactie || 'sale'
  const filtered = listings.filter((property) =>
    property.transaction === transaction &&
    (!params.tip || property.propertyType === params.tip) &&
    (!zone || property.location.toLocaleLowerCase('ro').includes(zone)) &&
    property.price >= minPrice && property.price <= maxPrice,
  )
  if (params.sort === 'pret-asc') filtered.sort((a, b) => a.price - b.price)
  if (params.sort === 'pret-desc') filtered.sort((a, b) => b.price - a.price)
  if (params.sort === 'suprafata') filtered.sort((a, b) => (b.area || 0) - (a.area || 0))

  return (
    <>
      <Header settings={settings} current={`/proprietati?tranzactie=${transaction}`} />
      <section className="page-hero page-hero--properties">
        <div className="container"><span className="eyebrow">Portofoliu actual</span><h1>Proprietăți alese<br />cu discernământ.</h1><p>Explorează selecția, filtrează simplu și cere detaliile care contează.</p></div>
      </section>
      <section className="listing-section">
        <div className="container">
          <SearchFilters variant="catalog" initial={params} />
          <div className="listing-results"><p><strong>{filtered.length}</strong> {filtered.length === 1 ? 'proprietate găsită' : 'proprietăți găsite'} {transaction === 'rent' ? 'de închiriat' : 'de vânzare'}</p>{filtered.length > 1 && <SortSelect params={params} />}</div>
          {filtered.length ? <div className="property-grid property-grid--catalog">{filtered.map((property) => <PropertyCard property={property} key={property.id} />)}</div> : <div className="empty-state"><Search size={30} /><h2>N-am găsit o potrivire exactă.</h2><p>Încearcă să elimini un filtru sau spune-ne direct ce cauți. Multe proprietăți ajung la noi înainte să fie publicate.</p><div className="empty-state__actions"><Link className="button button--outline" href={`/proprietati?tranzactie=${transaction}`}>Șterge filtrele</Link><Link className="button button--dark" href="/contact">Trimite-ne cerințele</Link></div></div>}
        </div>
      </section>
      <Footer settings={settings} />
    </>
  )
}
