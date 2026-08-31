import type { CollectionConfig } from 'payload'

const isAdmin = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: { singular: 'Membru al echipei', plural: 'Echipă' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'role', 'phone', 'active'], group: 'Conținut' },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', label: 'Nume', type: 'text', required: true },
    { name: 'role', label: 'Rol', type: 'text', required: true },
    { name: 'photo', label: 'Fotografie', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        { name: 'phone', label: 'Telefon', type: 'text' },
        { name: 'email', label: 'E-mail', type: 'email' },
      ],
    },
    { name: 'bio', label: 'Descriere', type: 'textarea' },
    { name: 'order', label: 'Ordine afișare', type: 'number', defaultValue: 10 },
    { name: 'active', label: 'Afișează pe site', type: 'checkbox', defaultValue: true },
  ],
}
