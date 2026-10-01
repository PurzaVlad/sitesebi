import type { CollectionConfig } from 'payload'

import { notifyTeam } from '../lib/notifications'

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
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return
        const settings = await req.payload.findGlobal({ slug: 'site-settings', req })
        const purposes: Record<string, string> = { purchase: 'Credit ipotecar', refinance: 'Refinanțare', loan: 'Împrumut bancar', other: 'Alt scop' }
        await notifyTeam(req.payload, {
          subject: `Cerere nouă de credit: ${doc.name}`,
          extraRecipients: [settings.creditPartnerEmail],
          rows: [
            ['Nume', doc.name], ['Telefon', doc.phone], ['E-mail', doc.email],
            ['Tip', purposes[doc.purpose] || doc.purpose], ['Suma dorită (€)', doc.requestedAmount],
            ['Avans (€)', doc.downPayment], ['Venit net lunar (lei)', doc.monthlyIncome],
            ['Sprijin notar', doc.notaryHelp ? 'Da' : 'Nu'], ['Detalii', doc.message],
          ],
        })
      },
    ],
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
        { label: 'Credit ipotecar', value: 'purchase' },
        { label: 'Refinanțare', value: 'refinance' },
        { label: 'Împrumut bancar', value: 'loan' },
        { label: 'Alt scop', value: 'other' },
      ],
    },
    { name: 'requestedAmount', label: 'Suma dorită (€)', type: 'number', required: true, min: 1000 },
    { name: 'downPayment', label: 'Avans disponibil (€)', type: 'number', min: 0 },
    { name: 'monthlyIncome', label: 'Venit net lunar (lei)', type: 'number', min: 0 },
    { name: 'notaryHelp', label: 'Dorește sprijin pentru notar', type: 'checkbox', defaultValue: false },
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
