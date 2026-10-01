import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { CreditRequests } from './collections/CreditRequests'
import { Media } from './collections/Media'
import { Leads } from './collections/Leads'
import { Properties } from './collections/Properties'
import { TeamMembers } from './collections/TeamMembers'
import { Viewings } from './collections/Viewings'
import { SiteSettings } from './globals/SiteSettings'
import { migrations } from './migrations'
import { emailEnabled } from './lib/notifications'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— LC Estate Partners',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Properties, TeamMembers, Leads, CreditRequests, Viewings],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  email: emailEnabled
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM || process.env.SMTP_USER || '',
        defaultFromName: 'LC Estate Partners',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 465),
          secure: Number(process.env.SMTP_PORT || 465) === 465,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        },
      })
    : undefined,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      // The Vercel Turso integration provides TURSO_*; DATABASE_* covers local and Docker setups.
      url: process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || '',
      authToken: process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN,
    },
    // Serverless deployments have no startup process to run the migration CLI.
    prodMigrations: process.env.VERCEL ? migrations : undefined,
  }),
  sharp,
  plugins: [
    // Vercel has no persistent disk, so uploads go to Blob storage once the store is connected.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
