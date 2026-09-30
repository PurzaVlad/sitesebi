import { DM_Sans } from 'next/font/google'
import { draftMode } from 'next/headers'
import React from 'react'

import { PreviewBar } from '@/components/PreviewBar'
import './styles.css'

const sans = DM_Sans({ subsets: ['latin', 'latin-ext'], variable: '--font-sans' })

export const viewport = { themeColor: '#0a1b2c' }

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: { type: 'website', locale: 'ro_RO', siteName: 'LC Estate Partners', images: ['/images/hero-villa.webp'] },
  description: 'Proprietăți atent selectate în Timișoara și împrejurimi. Consultanță imobiliară clară, de la prima vizionare până la chei.',
  title: { default: 'LC Estate Partners — Imobiliare, fără zgomot', template: '%s — LC Estate Partners' },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const { isEnabled: preview } = await draftMode()

  return (
    <html lang="ro" data-scroll-behavior="smooth">
      <body className={sans.variable}>
        {preview && <PreviewBar />}
        <main>{children}</main>
      </body>
    </html>
  )
}
