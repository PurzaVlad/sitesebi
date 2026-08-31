import { CheckCircle2, Clock3, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getSettings } from '@/lib/site-data'

export const metadata = { title: 'Contact' }

type SearchParams = Promise<{ tip?: string; proprietate?: string; id?: string; trimis?: string }>

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const [settings, params] = await Promise.all([getSettings(), searchParams])
  const isValuation = params.tip === 'evaluare'
  const prefilledMessage = params.proprietate ? `Bună ziua, mă interesează proprietatea „${params.proprietate}”. Aș dori mai multe detalii.` : ''

  return (
    <>
      <Header settings={settings} />
      <section className="contact-page">
        <div className="container contact-grid">
          <div className="contact-copy">
            <span className="eyebrow">Suntem aproape</span>
            <h1>{isValuation ? 'Hai să vedem cât valorează proprietatea ta.' : 'Începem cu o conversație simplă.'}</h1>
            <p>{isValuation ? 'Trimite-ne câteva informații. Te contactăm pentru o evaluare realistă, fără obligații.' : 'Scrie-ne ce cauți sau ce vrei să vinzi. Revenim cu întrebările potrivite, fără discursuri de vânzare.'}</p>
            <div className="contact-details">
              <a href={`tel:${(settings.phone || '').replace(/\s/g, '')}`}><Phone /><span><small>Telefon</small><strong>{settings.phone}</strong></span></a>
              <a href={`mailto:${settings.email}`}><Mail /><span><small>E-mail</small><strong>{settings.email}</strong></span></a>
              <div><MapPin /><span><small>Birou</small><strong>{settings.address}</strong></span></div>
              <div><Clock3 /><span><small>Program</small><strong>Luni–Vineri, 09:00–18:00</strong></span></div>
            </div>
            <a className="whatsapp-link" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle size={19} /> Preferi WhatsApp? Scrie-ne aici.</a>
          </div>
          <div className="contact-form-wrap">
            {params.trimis === 'da' ? (
              <div className="form-success"><CheckCircle2 /><span className="eyebrow">Mesaj trimis</span><h2>Mulțumim. Revenim cât mai curând.</h2><p>Solicitarea ta este deja în panoul echipei. În timpul programului răspundem, de regulă, în aceeași zi.</p></div>
            ) : (
              <form className="contact-form" action="/api/contact" method="post">
                <input type="hidden" name="source" value={isValuation ? 'valuation' : params.proprietate ? 'property' : 'contact'} />
                {params.id && <input type="hidden" name="propertyId" value={params.id} />}
                <label className="hidden-field">Nu completa acest câmp<input name="website" tabIndex={-1} autoComplete="off" /></label>
                <div className="form-row"><label><span>Nume și prenume *</span><input name="name" required autoComplete="name" placeholder="Cum te numești?" /></label><label><span>Telefon *</span><input name="phone" required type="tel" autoComplete="tel" placeholder="07xx xxx xxx" /></label></div>
                <label><span>E-mail</span><input name="email" type="email" autoComplete="email" placeholder="nume@email.ro" /></label>
                <label><span>{isValuation ? 'Detalii despre proprietate *' : 'Cum te putem ajuta? *'}</span><textarea name="message" required rows={6} defaultValue={prefilledMessage} placeholder={isValuation ? 'Tip proprietate, zonă, suprafață și orice detaliu relevant...' : 'Spune-ne pe scurt ce cauți sau ce vrei să vinzi...'} /></label>
                <label className="checkbox-label"><input type="checkbox" required /><span>Sunt de acord ca datele mele să fie folosite pentru a fi contactat în legătură cu această solicitare.</span></label>
                <button className="button button--accent" type="submit"><span>Trimite mesajul</span><Send size={17} /></button>
                <small>Nu trimitem newslettere și nu împărtășim datele tale cu terți.</small>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer settings={settings} />
    </>
  )
}
