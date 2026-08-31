import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getSettings } from '@/lib/site-data'

export const metadata = { title: 'Politica de confidențialitate' }

export default async function PrivacyPage() {
  const settings = await getSettings()
  return <><Header settings={settings} /><article className="legal-page container"><span className="eyebrow">Document informativ</span><h1>Politica de confidențialitate</h1><p>Acest text este un model care trebuie verificat și completat cu datele juridice ale agenției înainte de publicarea site-ului.</p><h2>Ce date colectăm</h2><p>Prin formularul de contact colectăm numele, numărul de telefon, adresa de e-mail și mesajul trimis. Datele sunt folosite exclusiv pentru a răspunde solicitării tale.</p><h2>Cât timp păstrăm datele</h2><p>Datele se păstrează doar pe perioada necesară gestionării solicitării și îndeplinirii obligațiilor legale aplicabile.</p><h2>Drepturile tale</h2><p>Poți solicita accesul, corectarea sau ștergerea datelor tale contactându-ne la {settings.email}.</p></article><Footer settings={settings} /></>
}
