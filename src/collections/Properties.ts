import type { CollectionConfig } from 'payload'

const isAdmin = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

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
  },
  access: {
    read: () => true,
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
