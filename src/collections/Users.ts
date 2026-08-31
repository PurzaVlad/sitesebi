import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Administrator', plural: 'Administratori' },
  admin: {
    useAsTitle: 'email',
    group: 'Configurare',
  },
  auth: true,
  fields: [{ name: 'name', label: 'Nume', type: 'text' }],
}
