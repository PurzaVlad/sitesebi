import 'dotenv/config'

import path from 'node:path'
import { getPayload } from 'payload'

import config from '../src/payload.config'

const payload = await getPayload({ config })
const existing = await payload.find({ collection: 'team-members', where: { name: { equals: 'Sebastian Hepes' } }, limit: 1 })
const placeholder = await payload.find({ collection: 'team-members', where: { and: [
  { name: { equals: 'Andrei Mureșan' } },
  { email: { equals: 'andrei@lcestatepartners.ro' } },
] }, limit: 1 })
const agent = existing.docs[0] || placeholder.docs[0]
const existingPhoto = await payload.find({ collection: 'media', where: { filename: { equals: 'sebastian-hepes.png' } }, limit: 1 })
const photo = existingPhoto.docs[0] || await payload.create({
  collection: 'media',
  data: { alt: 'Sebastian Hepes, consultant imobiliar' },
  filePath: path.resolve('public/images/sebastian-hepes.png'),
})
const profile = {
  name: 'Sebastian Hepes',
  role: 'Consultant imobiliar',
  photo: photo.id,
  bio: 'Consultanță pentru cumpărare, vânzare și închiriere în Timișoara și împrejurimi. De la alegerea proprietății până la pregătirea tranzacției.',
  order: 1,
  active: true,
}

if (agent) {
  await payload.update({ collection: 'team-members', id: agent.id, data: {
    ...profile,
    // Remove only the replaced demo contact details; retain an existing real profile's details.
    ...(existing.docs[0] ? {} : { phone: '', email: '' }),
  } })
} else {
  await payload.create({ collection: 'team-members', data: profile })
}

payload.logger.info('Profilul lui Sebastian Hepes a fost actualizat. Datele de contact pot fi completate în CMS.')
await payload.destroy()
process.exit(0)
