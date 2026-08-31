import { ArrowRight, Mail, Phone, Quote } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getAgents, getSettings } from '@/lib/site-data'

export const metadata = { title: 'Echipa' }

export default async function TeamPage() {
  const [settings, agents] = await Promise.all([getSettings(), getAgents()])

  return (
    <>
      <Header settings={settings} />
      <section className="page-hero page-hero--team">
        <div className="container team-hero-grid">
          <div><span className="eyebrow">Oameni, nu agenți de vânzări</span><h1>De partea ta,<br />de la început.</h1></div>
          <div><p>Suntem o echipă mică intenționat. Asta înseamnă atenție reală, răspunsuri rapide și un consultant care îți cunoaște povestea.</p><Quote size={42} /></div>
        </div>
      </section>
      <section className="section team-section">
        <div className="container team-grid">
          {agents.map((agent, index) => (
            <article className={`team-card${index === 0 ? ' team-card--lead' : ''}`} key={agent.id}>
              <div className="team-card__photo"><Image src={agent.photoUrl} alt={agent.name} fill sizes={index === 0 ? '(max-width: 800px) 100vw, 48vw' : '(max-width: 800px) 100vw, 24vw'} /></div>
              <div className="team-card__copy"><span>{agent.role}</span><h2>{agent.name}</h2><p>{agent.bio}</p><div>{agent.phone && <a href={`tel:${agent.phone.replace(/\s/g, '')}`} aria-label={`Sună-l pe ${agent.name}`}><Phone size={17} /></a>}{agent.email && <a href={`mailto:${agent.email}`} aria-label={`Trimite e-mail lui ${agent.name}`}><Mail size={17} /></a>}</div></div>
            </article>
          ))}
        </div>
      </section>
      <section className="team-values">
        <div className="container">
          <div><span className="eyebrow eyebrow--light">Ce ne ține împreună</span><h2>Standardele noastre<br />nu sunt negociabile.</h2></div>
          <div className="values-list"><article><span>01</span><h3>Spunem lucrurilor pe nume.</h3><p>Un preț nerealist sau o proprietate nepotrivită nu devin mai bune dacă le ambalăm frumos.</p></article><article><span>02</span><h3>Pregătim fiecare detaliu.</h3><p>De la fotografii la acte și negociere, experiența bună se construiește înainte de vizionare.</p></article><article><span>03</span><h3>Rămânem curioși.</h3><p>Piața se schimbă. Învățăm constant și ne bazăm recomandările pe informații actuale.</p></article></div>
        </div>
      </section>
      <section className="section"><div className="container centered-cta"><h2>Poate suntem echipa potrivită pentru tine.</h2><p>Spune-ne ce vrei să obții și vedem împreună cum putem ajuta.</p><Link className="button button--dark" href="/contact">Începe o conversație <ArrowRight size={18} /></Link></div></section>
      <Footer settings={settings} />
    </>
  )
}
