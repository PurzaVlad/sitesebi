import { unstable_cache } from 'next/cache'

import {
  rebsFetch,
  rebsFetchAll,
  type RebsEnumOption,
  type RebsImage,
  type RebsNamed,
  type RebsProperty,
  type RebsTagIndex,
  type RebsUser,
} from './rebs'
import type { Agent, Listing } from './site-data'

export const REBS_PROPERTIES_TAG = 'rebs-properties'

// Availability ids from /api/enums/: 1 = Activă, 7 = Antecontract / Rezervat. Everything else is off the market.
const ACTIVE = 1
const RESERVED = 7

type Enums = Record<string, RebsEnumOption[]>

type Reference = {
  enums: Enums
  tags: RebsTagIndex
  users: RebsUser[]
}

// Enum labels, feature tags and agents change rarely; one fetch a day is enough.
const getReference = unstable_cache(async (): Promise<Reference> => {
  const [enums, tags, users] = await Promise.all([
    rebsFetch<Enums>('/api/enums/'),
    rebsFetch<RebsTagIndex>('/api/tag-groups/'),
    rebsFetchAll<RebsUser>('/api/users/'),
  ])
  return { enums, tags: { tags: tags.tags, tag_groups: tags.tag_groups }, users }
}, ['rebs-reference'], { revalidate: 86_400, tags: ['rebs-reference'] })

async function mapLimit<T, R>(items: T[], limit: number, task: (item: T) => Promise<R>) {
  const results: R[] = new Array(items.length)
  let cursor = 0
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++
      results[index] = await task(items[index])
    }
  }))
  return results
}

export type RebsSnapshot = {
  properties: RebsProperty[]
  images: Record<number, string[]>
  zones: Record<number, string>
}

// Raw CRM data, cached until the REBS webhook revalidates the tag (or 15 minutes pass, as a safety net).
export const getRebsSnapshot = unstable_cache(async (): Promise<RebsSnapshot> => {
  const all = await rebsFetchAll<RebsProperty>('/api/properties/?ordering=-date_added')
  const properties = all.filter((property) => property.availability === ACTIVE || property.availability === RESERVED)

  const images: Record<number, string[]> = {}
  await mapLimit(properties, 6, async (property) => {
    const list = await rebsFetch<RebsImage[]>(`/api/properties/${property.id}/images/`)
    images[property.id] = list
      .filter((image) => image.public)
      // Floor plans go after the photos.
      .sort((a, b) => Number(a.is_sketch) - Number(b.is_sketch) || a.order - b.order)
      .map((image) => image.url)
  })

  const zones: Record<number, string> = {}
  const zoneIds = [...new Set(properties.map((property) => property.zone).filter((id): id is number => Boolean(id)))]
  await mapLimit(zoneIds, 6, async (id) => {
    zones[id] = (await rebsFetch<RebsNamed>(`/api/zones/${id}/`)).name
  })

  return { properties, images, zones }
}, [REBS_PROPERTIES_TAG], { revalidate: 900, tags: [REBS_PROPERTIES_TAG] })

// REBS stores locality names without diacritics.
const placeNames: Record<string, string> = {
  timisoara: 'Timișoara',
  dumbravita: 'Dumbrăvița',
  'mosnita noua': 'Moșnița Nouă',
  'mosnita veche': 'Moșnița Veche',
  chisoda: 'Chișoda',
  sacalaz: 'Săcălaz',
  sanandrei: 'Sânandrei',
  'sanmihaiu roman': 'Sânmihaiu Român',
  'dudestii noi': 'Dudeștii Noi',
  bucovat: 'Bucovăț',
}

// Timișoara neighbourhoods, also stored without diacritics.
const zoneNames: Record<string, string> = {
  brancoveanu: 'Brâncoveanu',
  cetatii: 'Cetății',
  circumvalatiunii: 'Circumvalațiunii',
  'calea sagului': 'Calea Șagului',
  'complexul studentesc': 'Complexul Studențesc',
  dambovita: 'Dâmbovița',
  ronat: 'Ronaț',
  'mircea cel batran': 'Mircea cel Bătrân',
  'piata 700': 'Piața 700',
  'piata victoriei': 'Piața Victoriei',
  'stefan cel mare': 'Ștefan cel Mare',
  sagului: 'Șagului',
  buziasului: 'Buziașului',
}

function placeName(value: string) {
  return placeNames[value.trim().toLowerCase()] || value.trim()
}

function zoneName(value: string) {
  return zoneNames[value.trim().toLowerCase()] || value.trim()
}

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '')
}

const numberFormat = new Intl.NumberFormat('ro-RO', { maximumFractionDigits: 2 })
const area = (value: number | null | undefined) => (value ? `${numberFormat.format(value)} m²` : null)
const yes = (value: boolean | null | undefined) => (value ? 'Da' : null)

function cleanText(value: string) {
  return value.replace(/\r\n/g, '\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
}

function summary(description: string) {
  const plain = description
    .replace(/[\p{Extended_Pictographic}️]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (plain.length <= 200) return plain
  const cut = plain.slice(0, 200)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

function landSquareMeters(property: RebsProperty) {
  if (!property.surface_land) return null
  // surface_unit: 1 = mp, 3 = ari, 2 = hectare.
  if (property.surface_unit === 3) return property.surface_land * 100
  if (property.surface_unit === 2) return property.surface_land * 10_000
  return property.surface_land
}

function mapAgent(user: RebsUser): Agent {
  return {
    id: user.id,
    name: `${user.first_name} ${user.last_name}`.trim(),
    role: user.position || 'Consultant imobiliar',
    phone: user.phone || null,
    email: user.email || null,
    bio: user.description || null,
    photoUrl: user.avatar || '',
    order: null,
    active: true,
    createdAt: '',
    updatedAt: '',
  }
}

type DetailRow = [string, string | number | null | undefined]

function buildListing(property: RebsProperty, transaction: 'sale' | 'rent', snapshot: RebsSnapshot, reference: Reference): Listing {
  const { enums } = reference
  const label = (name: string, id: number | null | undefined) =>
    id == null ? null : enums[name]?.find((option) => option.id === id)?.label || null
  const labels = (name: string, ids: number[] | null | undefined) =>
    ids?.length ? ids.map((id) => label(name, id)).filter(Boolean).join(', ') : null

  const isSale = transaction === 'sale'
  const price = (isSale ? property.price_sale : property.price_rent) || 0
  const currencyId = isSale ? property.currency_sale : property.currency_rent
  const currency = currencyId === 2 ? 'RON' : currencyId === 3 ? 'USD' : 'EUR'
  const apartmentType = property.property_type === 1 ? property.apartment_type : null
  const propertyType: Listing['propertyType'] =
    property.property_type === 1 ? (apartmentType === 2 ? 'penthouse' : 'apartment')
      : property.property_type === 2 ? 'house'
        : property.property_type === 5 ? 'land'
          : 'commercial'

  const floorLabel = labels('floors', property.floor_multi)
  const floor = floorLabel ? (property.building_floors ? `${floorLabel} / ${property.building_floors}` : floorLabel) : null
  const city = placeName(property.city || '')
  const zone = property.zone && snapshot.zones[property.zone] ? zoneName(snapshot.zones[property.zone]) : null
  const location = [zone, city].filter(Boolean).join(', ')
  const landArea = landSquareMeters(property)
  const subtype = label('apartment_type', apartmentType) || label('house_type', property.house_type)
    || label('commercial_building_type', property.commercial_building_type) || label('land_type', property.land_type)
  const typeName = label('property_type', property.property_type)
  const annexes = [
    property.has_basement && 'Subsol',
    property.has_semibasement && 'Demisol',
    property.has_mansard && 'Mansardă',
    property.has_attic && 'Pod',
  ].filter(Boolean).join(', ')
  const pricePerArea = isSale && price && property.surface_useable ? Math.round(price / property.surface_useable) : null
  const currencySymbol = currency === 'RON' ? 'lei' : currency === 'USD' ? '$' : '€'
  const vat = isSale ? property.vat_sale_display : property.vat_rent_display

  const groups: { title: string; rows: DetailRow[] }[] = [
    {
      title: 'Suprafețe și compartimentare',
      rows: [
        ['Tip proprietate', [typeName, subtype && subtype !== typeName ? subtype.toLowerCase() : null].filter(Boolean).join(', ')],
        ['Suprafață utilă', area(property.surface_useable)],
        ['Suprafață construită', area(property.surface_built)],
        ['Suprafață totală', area(property.surface_total)],
        ['Suprafață teren', area(landArea)],
        ['Suprafață curte', area(property.surface_yard)],
        ['Suprafață terase', area(property.surface_terrace)],
        ['Suprafață balcoane', area(property.surface_balconies)],
        ['Camere', property.rooms],
        ['Dormitoare', property.bedrooms],
        ['Bucătării', property.kitchens],
        ['Băi', property.bathrooms ? `${property.bathrooms}${property.has_bathroom_window ? ' (cu geam)' : ''}` : null],
        ['Balcoane', property.balconies],
        ['Terase', property.terraces],
        ['Compartimentare', label('partitioning', property.partitioning)],
        ['Confort', label('comfort', property.comfort)],
        ['Orientare', label('orientation', property.orientation)],
        ['Etaj', floor],
      ],
    },
    {
      title: 'Clădire',
      rows: [
        ['Tip clădire', label('building_type', property.building_type)],
        ['An construcție', property.building_construction_year],
        ['Etaje clădire', property.building_floors],
        ['Etaje subterane', property.building_underground_floors],
        ['Structură', label('building_structure', property.building_structure)],
        ['Acoperiș', label('roof', property.roof)],
        ['Stadiu construcție', label('construction_status', property.construction_status)],
        ['Construcție nouă', yes(property.new_building)],
        ['Reabilitată termic', yes(property.thermally_rehabilitated)],
        ['Lifturi', property.lifts],
        ['Anexe', annexes || null],
        ['Locuri de parcare', property.parking_spots],
        ['Garaje', property.garages],
      ],
    },
    {
      title: 'Stare și energie',
      rows: [
        ['Stare interior', label('interior_state', property.interior_state)],
        ['An renovare', property.polish_year],
        ['Clasă energetică', label('energy_class', property.energy_class)],
        ['Consum energie', property.total_energy_consumption ? `${numberFormat.format(property.total_energy_consumption)} kWh/m²/an` : null],
        ['Animale acceptate', yes(property.pet_friendly)],
      ],
    },
    {
      title: 'Preț și disponibilitate',
      rows: [
        ['Preț', price ? `${numberFormat.format(price)} ${currencySymbol}${isSale ? '' : ' / lună'}` : null],
        ['Preț / m²', pricePerArea ? `${numberFormat.format(pricePerArea)} ${currencySymbol} / m²` : null],
        ['Negociabil', yes(isSale ? property.negotiable_sale_price : property.negotiable_rent_price)],
        ['TVA', vat || null],
        ['Cost întreținere', property.maintenance_cost ? `${numberFormat.format(property.maintenance_cost)} ${currencySymbol} / lună` : null],
        ['Garanție', !isSale && property.guarantee_cost ? `${numberFormat.format(property.guarantee_cost)} ${currencySymbol}` : null],
        ['Disponibilitate', property.disponibility || null],
      ],
    },
  ]

  const detailGroups = groups
    .map((group) => ({
      title: group.title,
      rows: group.rows
        .filter(([, value]) => value !== null && value !== undefined && value !== '' && value !== 0)
        .map(([name, value]) => ({ label: name, value: String(value) })),
    }))
    .filter((group) => group.rows.length)

  const featureMap = new Map<string, string[]>()
  for (const tag of property.tags || []) {
    const [groupKey, tagKey] = tag.includes('/') ? tag.split('/') : ['', tag]
    const tagLabel = reference.tags.tags[tagKey]
    if (!tagLabel) continue
    const groupTitle = reference.tags.tag_groups[groupKey] || 'Alte dotări'
    featureMap.set(groupTitle, [...(featureMap.get(groupTitle) || []), tagLabel])
  }
  const featureGroups = [...featureMap].map(([title, items]) => ({ title, items: [...new Set(items)] }))

  const gallery = snapshot.images[property.id] || []
  const description = cleanText(property.description || '')
  const user = reference.users.find((item) => item.id === property.agent)
  const both = property.for_sale && property.for_rent

  return {
    id: property.id,
    reference: property.display_id,
    title: property.title,
    slug: `${slugify(property.title)}-${property.display_id.toLowerCase()}${both && !isSale ? '-inchiriere' : ''}`,
    transaction,
    propertyType,
    status: property.availability === RESERVED ? 'reserved' : 'available',
    price,
    currency,
    location,
    city: city || null,
    zone,
    shortDescription: summary(description),
    description,
    area: property.surface_useable,
    landArea,
    rooms: property.rooms,
    bathrooms: property.bathrooms,
    floor,
    yearBuilt: property.building_construction_year,
    energyClass: label('energy_class', property.energy_class),
    features: featureGroups.flatMap((group) => group.items.map((feature) => ({ feature }))),
    featureGroups,
    detailGroups,
    videoUrl: property.video_link || null,
    virtualTourUrl: property.virtual_tour_link || null,
    featured: false,
    publishedAt: property.date_added,
    createdAt: property.date_added,
    updatedAt: property.date_modified_by_user || property.date_added,
    cover: gallery[0] || '/images/property-villa.jpg',
    gallery: gallery.length ? gallery : ['/images/property-villa.jpg'],
    agent: user ? mapAgent(user) : null,
    crm: { propertyId: property.id, agentId: property.agent, propertyType: property.property_type },
  }
}

export async function loadRebsListings(): Promise<Listing[]> {
  const [snapshot, reference] = await Promise.all([getRebsSnapshot(), getReference()])
  return snapshot.properties.flatMap((property) => {
    const listings: Listing[] = []
    if (property.for_sale && property.price_sale) listings.push(buildListing(property, 'sale', snapshot, reference))
    if (property.for_rent && property.price_rent) listings.push(buildListing(property, 'rent', snapshot, reference))
    return listings
  })
}
