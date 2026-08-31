import type { CollectionConfig } from 'payload'

const isAdmin = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

export const Viewings: CollectionConfig = {
  slug: 'viewings',
  labels: { singular: 'Vizionare', plural: 'Vizionări' },
  admin: {
    useAsTitle: 'propertyTitle',
    defaultColumns: ['date', 'time', 'propertyTitle', 'name', 'phone', 'status'],
    group: 'Relații clienți',
  },
  access: {
    create: () => true,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'date', label: 'Data', type: 'text', required: true },
        {
          name: 'time',
          label: 'Ora',
          type: 'select',
          required: true,
          options: ['10:00', '12:00', '15:00', '17:00'],
        },
      ],
    },
    { name: 'propertyTitle', label: 'Proprietate', type: 'text', required: true },
    { name: 'property', label: 'Înregistrare proprietate', type: 'relationship', relationTo: 'properties' },
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Nume client', type: 'text', required: true },
        { name: 'phone', label: 'Telefon', type: 'text', required: true },
      ],
    },
    { name: 'email', label: 'E-mail', type: 'email' },
    { name: 'note', label: 'Observații', type: 'textarea' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'scheduled',
      options: [
        { label: 'Programată', value: 'scheduled' },
        { label: 'Confirmată', value: 'confirmed' },
        { label: 'Finalizată', value: 'completed' },
        { label: 'Anulată', value: 'cancelled' },
      ],
      access: { create: isAdmin, read: isAdmin, update: isAdmin },
    },
  ],
}
