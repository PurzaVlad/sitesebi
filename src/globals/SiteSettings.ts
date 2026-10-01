import type { GlobalConfig } from 'payload'
import { agencyContact } from '../lib/agency'

const isAdmin = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Setări site',
  admin: { group: 'Configurare' },
  access: { read: () => true, update: isAdmin },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'agencyName', label: 'Numele agenției', type: 'text', defaultValue: 'LC Estate Partners' },
        { name: 'city', label: 'Oraș', type: 'text', defaultValue: 'Timișoara' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', label: 'Telefon', type: 'text', defaultValue: agencyContact.phone },
        { name: 'email', label: 'E-mail', type: 'email', defaultValue: agencyContact.email },
      ],
    },
    { name: 'address', label: 'Adresă', type: 'text', defaultValue: 'Str. Eugeniu de Savoya 12, Timișoara' },
    { name: 'whatsapp', label: 'Număr WhatsApp (format internațional)', type: 'text', defaultValue: agencyContact.whatsapp },
    { name: 'heroTitle', label: 'Titlu principal', type: 'text', defaultValue: 'Locul potrivit se simte ca acasă.' },
    {
      name: 'heroSubtitle',
      label: 'Text principal',
      type: 'textarea',
      defaultValue: 'Proprietăți atent selectate în Timișoara și împrejurimi, prezentate clar și fără presiune.',
    },
    {
      type: 'row',
      fields: [
        { name: 'facebook', label: 'Facebook', type: 'text' },
        { name: 'instagram', label: 'Instagram', type: 'text' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Parteneriat credit',
      admin: { description: 'Consultantul financiar partener afișat pe pagina Credit. Cererile de credit îi sunt trimise și lui pe e-mail.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'creditPartnerName', label: 'Nume consultant / firmă', type: 'text' },
            { name: 'creditPartnerEmail', label: 'E-mail consultant', type: 'email' },
          ],
        },
      ],
    },
  ],
}
