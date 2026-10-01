import type { CollectionConfig } from 'payload'

import { notifyTeam } from '../lib/notifications'

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
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return
        await notifyTeam(req.payload, {
          subject: `Vizionare programată: ${doc.propertyTitle}, ${doc.date} ${doc.time}`,
          rows: [['Proprietate', doc.propertyTitle], ['Data', doc.date], ['Ora', doc.time], ['Nume', doc.name], ['Telefon', doc.phone], ['E-mail', doc.email], ['Observații', doc.note]],
        })
      },
    ],
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
