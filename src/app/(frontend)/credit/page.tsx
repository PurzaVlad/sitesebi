import { ArrowRight, BadgeCheck, CheckCircle2, Landmark, Phone, ShieldCheck } from 'lucide-react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getSettings } from '@/lib/site-data'

export const metadata = { title: 'Credit imobiliar' }

type SearchParams = Promise<{ trimis?: string; eroare?: string }>

export default async function CreditPage({ searchParams }: { searchParams: SearchParams }) {
  const [settings, params] = await Promise.all([getSettings(), searchParams])

  return (
    <>
      <Header settings={settings} />
      <section className="contact-page credit-page">
        <div className="container contact-grid">
          <div className="contact-copy credit-copy">
            <span className="eyebrow">Finanțare, explicată simplu</span>
            <h1>Creditul potrivit începe cu cifre clare.</h1>
            <p>Spune-ne pe scurt de ce ai nevoie. Analizăm situația și revenim cu pașii potriviți pentru bugetul tău.</p>
            <div className="credit-benefits">
              <div><Landmark /><span><strong>Opțiuni potrivite situației tale</strong><small>Discutăm realist despre buget, avans și rata lunară.</small></span></div>
              <div><BadgeCheck /><span><strong>Un singur punct de contact</strong><small>Ai claritate de la prima simulare până la dosar.</small></span></div>
              <div><ShieldCheck /><span><strong>Fără obligații</strong><small>Cererea inițială este gratuită și nu te angajează contractual.</small></span></div>
            </div>
            <a className="whatsapp-link" href={`tel:${(settings.phone || '').replace(/\s/g, '')}`}><Phone size={18} /> Preferi să discutăm direct? Sună-ne.</a>
          </div>
          <div className="contact-form-wrap">
            {params.trimis === 'da' ? (
              <div className="form-success"><CheckCircle2 /><span className="eyebrow">Cerere înregistrată</span><h2>Mulțumim. Revenim cu o analiză.</h2><p>Cererea ta a ajuns separat în panoul consultantului. Te contactăm pentru confirmarea informațiilor și următorii pași.</p></div>
            ) : (
              <form className="contact-form" action="/api/credit" method="post">
                <label className="hidden-field">Nu completa acest câmp<input name="website" tabIndex={-1} autoComplete="off" /></label>
                {params.eroare && <p className="form-error" role="alert">Verifică numele, telefonul și suma dorită.</p>}
                <div className="form-row"><label><span>Nume și prenume *</span><input name="name" required autoComplete="name" placeholder="Cum te numești?" /></label><label><span>Telefon *</span><input name="phone" required type="tel" autoComplete="tel" placeholder="07xx xxx xxx" /></label></div>
                <label><span>E-mail</span><input name="email" type="email" autoComplete="email" placeholder="nume@email.ro" /></label>
                <fieldset className="credit-purpose"><legend>Ce te interesează? *</legend><label><input type="radio" name="purpose" value="purchase" defaultChecked /><span>Achiziție</span></label><label><input type="radio" name="purpose" value="refinance" /><span>Refinanțare</span></label><label><input type="radio" name="purpose" value="other" /><span>Alt scop</span></label></fieldset>
                <div className="form-row"><label><span>Suma dorită (€) *</span><input name="requestedAmount" required type="number" min="1000" step="1000" inputMode="numeric" placeholder="ex. 100.000" /></label><label><span>Avans disponibil (€)</span><input name="downPayment" type="number" min="0" step="1000" inputMode="numeric" placeholder="ex. 20.000" /></label></div>
                <label><span>Venit net lunar (lei)</span><input name="monthlyIncome" type="number" min="0" step="100" inputMode="numeric" placeholder="Venitul total al aplicanților" /></label>
                <label><span>Alte detalii</span><textarea name="message" rows={4} placeholder="Spune-ne orice detaliu care ne ajută să înțelegem situația ta..." /></label>
                <label className="checkbox-label"><input type="checkbox" required /><span>Sunt de acord ca datele mele să fie folosite pentru a fi contactat în legătură cu această cerere de credit.</span></label>
                <button className="button button--accent" type="submit"><span>Solicită analiza</span><ArrowRight size={18} /></button>
                <small>Datele sunt folosite doar pentru această solicitare. Nu trimitem comunicări comerciale fără acordul tău.</small>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer settings={settings} />
    </>
  )
}
