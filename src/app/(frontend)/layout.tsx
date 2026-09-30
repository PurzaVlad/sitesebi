import { DM_Sans } from 'next/font/google'
import React from 'react'
import './styles.css'
import './westhub.css'

const sans = DM_Sans({ subsets: ['latin', 'latin-ext'], variable: '--font-sans' })

export const metadata = {
  description: 'Proprietăți atent selectate în Timișoara și împrejurimi. Consultanță imobiliară clară, de la prima vizionare până la chei.',
  title: { default: 'LC Estate Partners — Imobiliare, fără zgomot', template: '%s — LC Estate Partners' },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="ro" data-scroll-behavior="smooth">
      <body className={sans.variable}>
        <main>{children}</main>
      </body>
    </html>
  )
}
