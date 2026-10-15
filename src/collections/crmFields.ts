import type { Field } from 'payload'

const isAdmin = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

// Filled by the site after it sends the request to REBS; visitors cannot set it.
export const crmStatusField: Field = {
  name: 'crmStatus',
  label: 'Sincronizare REBS',
  type: 'text',
  admin: { readOnly: true, position: 'sidebar', description: 'Ce s-a creat în CRM pentru această solicitare.' },
  access: { create: isAdmin, update: isAdmin },
}

export const crmPropertyField: Field = {
  name: 'crmPropertyId',
  label: 'ID proprietate REBS',
  type: 'number',
  admin: { readOnly: true, position: 'sidebar' },
  access: { create: isAdmin, update: isAdmin },
}
