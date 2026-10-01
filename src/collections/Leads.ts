import type { CollectionConfig } from 'payload'

import { notifyTeam } from '../lib/notifications'

const isAdmin = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Solicitare', plural: 'Solicitări' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'phone', 'source', 'status', 'createdAt'], group: 'Relații clienți' },
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
        const sources: Record<string, string> = { contact: 'Formular contact', property: 'Pagină proprietate', valuation: 'Evaluare' }
        await notifyTeam(req.payload, {
          subject: `Solicitare nouă: ${doc.name}`,
          rows: [['Nume', doc.name], ['Telefon', doc.phone], ['E-mail', doc.email], ['Sursă', sources[doc.source] || doc.source], ['Mesaj', doc.message]],
        })
      },
    ],
  },
  fields: [
    { name: 'name', label: 'Nume', type: 'text', required: true },
    { name: 'phone', label: 'Telefon', type: 'text', required: true },
    { name: 'email', label: 'E-mail', type: 'email' },
    { name: 'message', label: 'Mesaj', type: 'textarea', required: true },
    { name: 'property', label: 'Proprietate', type: 'relationship', relationTo: 'properties' },
    {
      name: 'source',
      label: 'Sursă',
      type: 'select',
      defaultValue: 'contact',
      options: [
        { label: 'Formular contact', value: 'contact' },
        { label: 'Pagină proprietate', value: 'property' },
        { label: 'Evaluare', value: 'valuation' },
      ],
    },
    {
      name: 'status',
      label: 'Status intern',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Nouă', value: 'new' },
        { label: 'Contactată', value: 'contacted' },
        { label: 'Închisă', value: 'closed' },
      ],
      access: { create: isAdmin, read: isAdmin, update: isAdmin },
    },
  ],
}
