import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import React from 'react'
import './styles.css'

const sans = DM_Sans({ subsets: ['latin', 'latin-ext'], variable: '--font-sans' })
const serif = Cormorant_Garamond({ subsets: ['latin', 'latin-ext'], variable: '--font-serif', weight: ['500', '600'] })

export const metadata = {
  description: 'Proprietăți atent selectate în Timișoara și împrejurimi. Consultanță imobiliară clară, de la prima vizionare până la chei.',
  title: { default: 'LC Estate Partners — Imobiliare, fără zgomot', template: '%s — LC Estate Partners' },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="ro" data-scroll-behavior="smooth">
      <body className={`${sans.variable} ${serif.variable}`}>
        <main>{children}</main>
      </body>
    </html>
  )
}
