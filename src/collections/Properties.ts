import type { CollectionConfig, Where } from 'payload'

const isAdmin = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

// Listings saved before drafts existed have no status and count as published.
export const publishedOnly: Where = {
  or: [{ _status: { equals: 'published' } }, { _status: { exists: false } }],
}

const previewPath = (slug: string) => `/api/preview?slug=${encodeURIComponent(slug)}`

export const Properties: CollectionConfig = {
  slug: 'properties',
  labels: {
    singular: 'Proprietate',
    plural: 'Proprietăți',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'transaction', 'price', 'location', 'status'],
    group: 'Conținut',
    // "Preview" opens the listing in draft mode; the preview route checks the admin session.
    preview: (doc) => (doc?.slug ? previewPath(String(doc.slug)) : null),
    livePreview: {
      url: ({ data }) => (data?.slug ? previewPath(String(data.slug)) : ''),
      breakpoints: [
        { label: 'Mobil', name: 'mobile', width: 390, height: 844 },
        { label: 'Tabletă', name: 'tablet', width: 820, height: 1180 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  versions: {
    maxPerDoc: 20,
    // Autosave keeps the live preview in sync while typing, without publishing.
    drafts: { autosave: { interval: 800 } },
  },
  access: {
    // Visitors only see published listings; logged-in editors also see drafts.
    read: ({ req }) => (req.user ? true : publishedOnly),
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Informații principale',
          fields: [
            { name: 'title', label: 'Titlu', type: 'text', required: true },
            {
              name: 'slug',
              label: 'Adresă URL (slug)',
              type: 'text',
              required: true,
              unique: true,
              admin: { description: 'Exemplu: vila-moderna-dumbravita' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'transaction',
                  label: 'Tip ofertă',
                  type: 'select',
                  required: true,
                  defaultValue: 'sale',
                  options: [
                    { label: 'De vânzare', value: 'sale' },
                    { label: 'De închiriat', value: 'rent' },
                  ],
                },
                {
                  name: 'propertyType',
                  label: 'Tip proprietate',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Apartament', value: 'apartment' },
                    { label: 'Casă / Vilă', value: 'house' },
                    { label: 'Penthouse', value: 'penthouse' },
                    { label: 'Teren', value: 'land' },
                    { label: 'Spațiu comercial', value: 'commercial' },
                  ],
                },
                {
                  name: 'status',
                  label: 'Status',
                  type: 'select',
                  required: true,
                  defaultValue: 'available',
                  options: [
                    { label: 'Disponibilă', value: 'available' },
                    { label: 'Rezervată', value: 'reserved' },
                    { label: 'Vândută / Închiriată', value: 'sold' },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'price', label: 'Preț', type: 'number', required: true, min: 0 },
                {
                  name: 'currency',
                  label: 'Monedă',
                  type: 'select',
                  defaultValue: 'EUR',
                  options: ['EUR', 'RON'],
                },
                { name: 'location', label: 'Zonă / Localitate', type: 'text', required: true },
              ],
            },
            {
              name: 'shortDescription',
              label: 'Descriere scurtă',
              type: 'textarea',
              required: true,
              maxLength: 220,
            },
            { name: 'description', label: 'Descriere completă', type: 'textarea', required: true },
          ],
        },
        {
          label: 'Detalii & dotări',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'area', label: 'Suprafață utilă (m²)', type: 'number', min: 0 },
                { name: 'landArea', label: 'Teren (m²)', type: 'number', min: 0 },
                { name: 'rooms', label: 'Camere', type: 'number', min: 0 },
                { name: 'bathrooms', label: 'Băi', type: 'number', min: 0 },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'floor', label: 'Etaj', type: 'text' },
                { name: 'yearBuilt', label: 'An construcție', type: 'number', min: 1800, max: 2100 },
                { name: 'energyClass', label: 'Clasă energetică', type: 'text' },
              ],
            },
            {
              name: 'features',
              label: 'Dotări',
              type: 'array',
              fields: [{ name: 'feature', label: 'Dotare', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'Media & publicare',
          fields: [
            {
              name: 'images',
              label: 'Galerie foto',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
            },
            {
              name: 'agent',
              label: 'Agent responsabil',
              type: 'relationship',
              relationTo: 'team-members',
            },
            { name: 'featured', label: 'Promovează pe prima pagină', type: 'checkbox', defaultValue: false },
            { name: 'publishedAt', label: 'Data publicării', type: 'date', defaultValue: () => new Date() },
          ],
        },
      ],
    },
  ],
}
