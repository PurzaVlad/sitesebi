import 'dotenv/config'

import path from 'node:path'
import { getPayload } from 'payload'

import { adamProfile, agencyContact, sebastianProfile } from '../src/lib/agency'
import config from '../src/payload.config'

const payload = await getPayload({ config })

try {
  const existingPhoto = await payload.find({ collection: 'media', where: { filename: { equals: 'sebastian-hepes.png' } }, limit: 1 })
  const photo = existingPhoto.docs[0] || await payload.create({
    collection: 'media',
    data: { alt: 'Sebastian Hepes, consultant imobiliar' },
    filePath: path.resolve('public/images/sebastian-hepes.png'),
  })

  async function updateProfile(profile: typeof sebastianProfile, demoName: string, demoEmail: string, photoID?: number) {
    const existing = await payload.find({ collection: 'team-members', where: { name: { equals: profile.name } }, limit: 1 })
    const placeholder = existing.docs.length ? null : await payload.find({ collection: 'team-members', where: { and: [
      { name: { equals: demoName } }, { email: { equals: demoEmail } },
    ] }, limit: 1 })
    const agent = existing.docs[0] || placeholder?.docs[0]
    const data = {
      ...profile,
      ...(photoID ? { photo: photoID } : !existing.docs.length ? { photo: null } : {}),
    }
    return agent
      ? payload.update({ collection: 'team-members', id: agent.id, data })
      : payload.create({ collection: 'team-members', data })
  }

  await updateProfile(sebastianProfile, 'Andrei Mureșan', 'andrei@lcestatepartners.ro', photo.id)
  const adam = await updateProfile(adamProfile, 'Mara Ionescu', 'mara@lcestatepartners.ro')

  // Preserve listings while retiring only the exact obsolete demo profile.
  const obsolete = await payload.find({ collection: 'team-members', where: { and: [
    { name: { equals: 'Vlad Stan' } }, { email: { equals: 'vlad@lcestatepartners.ro' } },
  ] }, limit: 100 })
  for (const agent of obsolete.docs) {
    await payload.update({ collection: 'properties', where: { agent: { equals: agent.id } }, data: { agent: adam.id } })
    await payload.update({ collection: 'team-members', id: agent.id, data: { active: false } })
  }

  await payload.updateGlobal({ slug: 'site-settings', data: agencyContact })
  payload.logger.info('Sebastian Hepes, Adam Mihai și contactul comun al agenției au fost actualizate.')
} finally {
  await payload.destroy()
}
process.exit(0)
