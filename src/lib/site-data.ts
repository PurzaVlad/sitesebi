import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'

import type { Media, Property, SiteSetting, TeamMember } from '@/payload-types'
import { publishedOnly } from '@/collections/Properties'
import config from '@/payload.config'
import { adamProfile, agencyContact, sebastianProfile } from './agency'

export type Listing = Omit<Property, 'images' | 'agent'> & {
  cover: string
  gallery: string[]
  agent?: Agent | null
}

export type Agent = Omit<TeamMember, 'photo'> & { photoUrl: string }

const now = new Date().toISOString()

export const defaultSettings: SiteSetting = {
  id: 0,
  agencyName: 'LC Estate Partners',
  city: 'Timișoara',
  ...agencyContact,
  address: 'Str. Eugeniu de Savoya 12, Timișoara',
  heroTitle: 'Locul potrivit se simte ca acasă.',
  heroSubtitle: 'Proprietăți atent selectate în Timișoara și împrejurimi, prezentate clar și fără presiune.',
}

export const demoAgents: Agent[] = [
  {
    id: -1,
    ...sebastianProfile,
    photoUrl: '/images/sebastian-hepes.png',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: -2,
    ...adamProfile,
    photoUrl: '',
    createdAt: now,
    updatedAt: now,
  },
]

export const demoListings: Listing[] = [
  {
    id: -1,
    title: 'Vilă contemporană cu grădină matură',
    slug: 'vila-contemporana-dumbravita',
    transaction: 'sale',
    propertyType: 'house',
    status: 'available',
    price: 389000,
    currency: 'EUR',
    location: 'Dumbrăvița, Timiș',
    shortDescription: 'Arhitectură curată, lumină naturală și o grădină gândită pentru seri liniștite în familie.',
    description: 'O casă atent proiectată pentru viața de zi cu zi: zone de zi ample, bucătărie deschisă, dormitoare bine proporționate și legătură firească între interior și grădină. Finisajele sunt neutre și durabile, iar zona oferă acces rapid către oraș.',
    area: 186,
    landArea: 520,
    rooms: 5,
    bathrooms: 3,
    yearBuilt: 2024,
    energyClass: 'A',
    features: [{ feature: 'Încălzire în pardoseală' }, { feature: 'Terasă acoperită' }, { feature: 'Două locuri de parcare' }, { feature: 'Sistem smart home' }],
    featured: true,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    cover: '/images/property-villa.jpg',
    gallery: ['/images/property-villa.jpg', '/images/property-house.jpg', '/images/property-apartment.jpg'],
    agent: demoAgents[0],
  },
  {
    id: -2,
    title: 'Apartament luminos lângă Parcul Botanic',
    slug: 'apartament-parcul-botanic',
    transaction: 'sale',
    propertyType: 'apartment',
    status: 'available',
    price: 164000,
    currency: 'EUR',
    location: 'Cetate, Timișoara',
    shortDescription: 'Un apartament echilibrat, renovat complet, la câteva minute de centrul orașului.',
    description: 'Situat într-o clădire bine întreținută, apartamentul combină detaliile clasice cu o amenajare contemporană. Zona de zi este generoasă, dormitoarele sunt retrase, iar parcul și centrul sunt la distanță de mers pe jos.',
    area: 78,
    rooms: 3,
    bathrooms: 2,
    floor: '2 / 4',
    yearBuilt: 1986,
    energyClass: 'B',
    features: [{ feature: 'Renovat complet' }, { feature: 'Balcon' }, { feature: 'Boxă la subsol' }, { feature: 'Aer condiționat' }],
    featured: true,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    cover: '/images/property-apartment.jpg',
    gallery: ['/images/property-apartment.jpg', '/images/property-penthouse.jpg'],
    agent: demoAgents[1],
  },
  {
    id: -3,
    title: 'Penthouse cu terasă panoramică',
    slug: 'penthouse-terasa-torontalului',
    transaction: 'sale',
    propertyType: 'penthouse',
    status: 'reserved',
    price: 278000,
    currency: 'EUR',
    location: 'Torontalului, Timișoara',
    shortDescription: 'Spații deschise, terasă de 64 m² și vedere amplă peste nordul orașului.',
    description: 'Un penthouse aerisit, cu o zonă de zi concepută în jurul terasei și ferestre ample pe două orientări. Proprietatea se vinde complet finisată și include două locuri de parcare.',
    area: 112,
    rooms: 4,
    bathrooms: 2,
    floor: '7 / 7',
    yearBuilt: 2023,
    energyClass: 'A',
    features: [{ feature: 'Terasă 64 m²' }, { feature: 'Lift' }, { feature: 'Două parcări' }, { feature: 'Vedere panoramică' }],
    featured: true,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    cover: '/images/property-penthouse.jpg',
    gallery: ['/images/property-penthouse.jpg', '/images/property-apartment.jpg'],
    agent: demoAgents[1],
  },
  {
    id: -4,
    title: 'Casă calmă, aproape de Pădurea Verde',
    slug: 'casa-padurea-verde',
    transaction: 'rent',
    propertyType: 'house',
    status: 'available',
    price: 1350,
    currency: 'EUR',
    location: 'Ghiroda, Timiș',
    shortDescription: 'Casă mobilată, cu birou separat și curte privată, disponibilă imediat.',
    description: 'Potrivită pentru o familie care își dorește apropiere de natură și acces bun către oraș. Casa este mobilată complet, are o zonă de lucru separată și o curte ușor de întreținut.',
    area: 148,
    landArea: 390,
    rooms: 4,
    bathrooms: 2,
    yearBuilt: 2021,
    energyClass: 'A',
    features: [{ feature: 'Complet mobilată' }, { feature: 'Birou separat' }, { feature: 'Curte privată' }, { feature: 'Disponibilă imediat' }],
    featured: false,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    cover: '/images/property-house.jpg',
    gallery: ['/images/property-house.jpg', '/images/property-villa.jpg'],
    agent: demoAgents[1],
  },
]

function mediaUrl(value: number | Media | null | undefined, size?: 'card' | 'thumbnail') {
  if (!value || typeof value === 'number') return null
  return (size && value.sizes?.[size]?.url) || value.url || null
}

function mapAgent(agent: TeamMember): Agent {
  return {
    ...agent,
    // Keep the portrait's original framing; square CMS thumbnails can crop the face.
    photoUrl: mediaUrl(agent.photo) || (agent.name === 'Sebastian Hepes' ? '/images/sebastian-hepes.png' : ''),
  }
}

function mapProperty(property: Property): Listing {
  const gallery = (property.images || [])
    .map((image) => mediaUrl(image))
    .filter((url): url is string => Boolean(url))

  return {
    ...property,
    cover: (property.images || []).map((image) => mediaUrl(image, 'card')).find(Boolean) || gallery[0] || '/images/property-villa.jpg',
    gallery: gallery.length ? gallery : ['/images/property-villa.jpg'],
    agent: property.agent && typeof property.agent === 'object' ? mapAgent(property.agent) : null,
  }
}

export const getSettings = unstable_cache(async () => {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    return { ...defaultSettings, ...settings }
  } catch {
    return defaultSettings
  }
}, ['site-settings'], { revalidate: 60 })

async function loadListings(draft: boolean) {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'properties',
      depth: 2,
      limit: 100,
      sort: '-publishedAt',
      draft,
      where: draft ? undefined : publishedOnly,
    })
    return result.docs.length ? result.docs.map(mapProperty) : demoListings
  } catch {
    return demoListings
  }
}

const getPublishedListings = unstable_cache(() => loadListings(false), ['properties'], { revalidate: 30 })

// Draft mode is only enabled through /api/preview, which requires an admin session.
export async function getListings() {
  const { isEnabled } = await draftMode()
  return isEnabled ? loadListings(true) : getPublishedListings()
}

export const getAgents = unstable_cache(async () => {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'team-members',
      depth: 1,
      limit: 50,
      sort: 'order',
      where: { active: { equals: true } },
    })

    if (!result.docs.length) return demoAgents

    return result.docs.map(mapAgent)
  } catch {
    return demoAgents
  }
}, ['team-members'], { revalidate: 60 })

export function formatPrice(property: Pick<Listing, 'price' | 'currency' | 'transaction'>) {
  const formatted = new Intl.NumberFormat('ro-RO').format(property.price)
  const suffix = property.transaction === 'rent' ? ' / lună' : ''
  return `${formatted} ${property.currency === 'RON' ? 'lei' : '€'}${suffix}`
}

export function formatPricePerArea(property: Pick<Listing, 'price' | 'currency' | 'transaction' | 'area'>) {
  if (property.transaction !== 'sale' || !property.area) return null
  const formatted = new Intl.NumberFormat('ro-RO').format(Math.round(property.price / property.area))
  return `${formatted} ${property.currency === 'RON' ? 'lei' : '€'} / m²`
}

export function getSimilarListings(listings: Listing[], property: Listing, count = 3) {
  const candidates = listings.filter((item) => item.id !== property.id && item.transaction === property.transaction)
  // Same property type first, then the closest price.
  return candidates
    .sort((a, b) =>
      Number(b.propertyType === property.propertyType) - Number(a.propertyType === property.propertyType) ||
      Math.abs(a.price - property.price) - Math.abs(b.price - property.price))
    .slice(0, count)
}

export const typeLabels: Record<Listing['propertyType'], string> = {
  apartment: 'Apartament',
  house: 'Casă / Vilă',
  penthouse: 'Penthouse',
  land: 'Teren',
  commercial: 'Spațiu comercial',
}
