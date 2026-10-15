// Server-only client for the CRM REBS REST API (docs: <REBS_BASE_URL>/api/docs/).
// The token never reaches the browser: only route handlers and server components import this file.

const token = process.env.REBS_API_TOKEN || ''
const baseUrl = (process.env.REBS_BASE_URL || 'https://lc-estate.crmrebs.com').replace(/\/+$/, '')

export const rebsEnabled = Boolean(token)

export class RebsError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export async function rebsFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!token) throw new RebsError(0, 'REBS_API_TOKEN lipsește.')
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
      ...init.headers,
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  })
  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new RebsError(response.status, `REBS ${init.method || 'GET'} ${path}: ${response.status} ${body.slice(0, 300)}`)
  }
  return response.status === 204 ? (undefined as T) : response.json() as Promise<T>
}

type Page<T> = { count: number; next: string | null; results: T[] }

// The API caps page_size at 20, so follow `next` until the list is complete.
export async function rebsFetchAll<T>(path: string, maxPages = 50): Promise<T[]> {
  const items: T[] = []
  let next: string | null = `${path}${path.includes('?') ? '&' : '?'}page_size=20`
  for (let page = 0; next && page < maxPages; page++) {
    const data: Page<T> = await rebsFetch<Page<T>>(next)
    items.push(...data.results)
    next = data.next ? new URL(data.next).pathname + new URL(data.next).search : null
  }
  return items
}

export function rebsPost<T>(path: string, body: unknown) {
  return rebsFetch<T>(path, { method: 'POST', body: JSON.stringify(body) })
}

export type RebsEnumOption = { id: number; label: string }

export type RebsProperty = {
  id: number
  display_id: string
  title: string
  description: string
  agent: number | null
  property_type: number
  apartment_type: number | null
  house_type: number | null
  commercial_building_type: number | null
  land_type: number | null
  city: string
  zone: number | null
  street: string
  lat: number | null
  lng: number | null
  surface_useable: number | null
  surface_built: number | null
  surface_total: number | null
  surface_land: number | null
  surface_yard: number | null
  surface_terrace: number | null
  surface_balconies: number | null
  surface_unit: number | null
  rooms: number | null
  bedrooms: number | null
  kitchens: number | null
  bathrooms: number | null
  has_bathroom_window: boolean
  balconies: number | null
  terraces: number | null
  parking_spots: number | null
  garages: number | null
  lifts: number | null
  building_type: number | null
  building_floors: number | null
  building_underground_floors: number | null
  building_construction_year: number | null
  building_structure: number | null
  floor_multi: number[] | null
  partitioning: number | null
  orientation: number | null
  comfort: number | null
  polish_year: number | null
  interior_state: number | null
  construction_status: number | null
  roof: number | null
  has_basement: boolean
  has_semibasement: boolean
  has_mansard: boolean
  has_attic: boolean
  new_building: boolean
  thermally_rehabilitated: boolean
  pet_friendly: boolean
  energy_class: number | null
  total_energy_consumption: number | null
  for_sale: boolean
  for_rent: boolean
  price_sale: number | null
  price_rent: number | null
  currency_sale: number | null
  currency_rent: number | null
  negotiable_sale_price: boolean
  negotiable_rent_price: boolean
  vat_sale: number | null
  vat_rent: number | null
  vat_sale_display: string
  vat_rent_display: string
  maintenance_cost: number | null
  guarantee_cost: number | null
  availability: number
  disponibility: string
  date_added: string
  date_modified_by_user: string | null
  video_link: string
  virtual_tour_link: string
  tags: string[]
}

export type RebsImage = { id: number; url: string; order: number; is_sketch: boolean; public: boolean }

export type RebsUser = {
  id: number
  email: string
  first_name: string
  last_name: string
  phone: string
  position: string
  description: string
  avatar: string | null
  is_active: boolean
}

export type RebsTagIndex = { tags: Record<string, string>; tag_groups: Record<string, string> }

export type RebsNamed = { id: number; name: string }
