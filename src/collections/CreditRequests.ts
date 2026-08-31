import type { CollectionConfig } from 'payload'

const isAdmin = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

export const CreditRequests: CollectionConfig = {
  slug: 'credit-requests',
  labels: { singular: 'Cerere de credit', plural: 'Cereri de credit' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'requestedAmount', 'purpose', 'status', 'createdAt'],
    group: 'Relații clienți',
  },
  access: {
    create: () => true,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', label: 'Nume', type: 'text', required: true },
    { name: 'phone', label: 'Telefon', type: 'text', required: true },
    { name: 'email', label: 'E-mail', type: 'email' },
    {
      name: 'purpose',
      label: 'Scopul creditului',
      type: 'select',
      required: true,
      options: [
        { label: 'Achiziție locuință', value: 'purchase' },
        { label: 'Refinanțare', value: 'refinance' },
        { label: 'Alt scop', value: 'other' },
      ],
    },
    { name: 'requestedAmount', label: 'Suma dorită (€)', type: 'number', required: true, min: 1000 },
    { name: 'downPayment', label: 'Avans disponibil (€)', type: 'number', min: 0 },
    { name: 'monthlyIncome', label: 'Venit net lunar (lei)', type: 'number', min: 0 },
    { name: 'message', label: 'Detalii', type: 'textarea' },
    {
      name: 'status',
      label: 'Status intern',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'Nouă', value: 'new' },
        { label: 'Contactată', value: 'contacted' },
        { label: 'În analiză', value: 'review' },
        { label: 'Închisă', value: 'closed' },
      ],
      access: { create: isAdmin, read: isAdmin, update: isAdmin },
    },
  ],
}
