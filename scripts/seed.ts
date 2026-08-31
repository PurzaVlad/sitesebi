import 'dotenv/config'

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'

import config from '../src/payload.config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const imagePath = (name: string) => path.resolve(dirname, '../public/images', name)

async function upload(filename: string, alt: string) {
  return payload.create({ collection: 'media', data: { alt }, filePath: imagePath(filename) })
}

const payload = await getPayload({ config })
const existing = await payload.find({ collection: 'properties', limit: 1 })

if (existing.totalDocs > 0) {
  payload.logger.info('Baza de date conține deja proprietăți. Seed-ul a fost oprit pentru a evita duplicatele.')
  process.exit(0)
}

payload.logger.info('Încarc imaginile demo...')
const [villa, apartment, penthouse, house, andreiPhoto, maraPhoto, vladPhoto] = await Promise.all([
  upload('property-villa.jpg', 'Vilă contemporană cu grădină'),
  upload('property-apartment.jpg', 'Interior apartament luminos'),
  upload('property-penthouse.jpg', 'Interior penthouse modern'),
  upload('property-house.jpg', 'Casă modernă de închiriat'),
  upload('agent-andrei.jpg', 'Andrei Mureșan'),
  upload('agent-mara.jpg', 'Mara Ionescu'),
  upload('agent-vlad.jpg', 'Vlad Stan'),
])

payload.logger.info('Creez echipa demo...')
const [andrei, mara, vlad] = await Promise.all([
  payload.create({ collection: 'team-members', data: { name: 'Andrei Mureșan', role: 'Fondator & broker imobiliar', phone: '+40 723 000 000', email: 'andrei@lcestatepartners.ro', bio: 'Coordonează strategia agenției și tranzacțiile rezidențiale premium. Crede în evaluări corecte și conversații directe.', photo: andreiPhoto.id, order: 1, active: true } }),
  payload.create({ collection: 'team-members', data: { name: 'Mara Ionescu', role: 'Consultant rezidențial', phone: '+40 723 000 001', email: 'mara@lcestatepartners.ro', bio: 'Cunoaște cartierele Timișoarei în detaliu și transformă o listă de dorințe într-o selecție scurtă, relevantă.', photo: maraPhoto.id, order: 2, active: true } }),
  payload.create({ collection: 'team-members', data: { name: 'Vlad Stan', role: 'Consultant investiții', phone: '+40 723 000 002', email: 'vlad@lcestatepartners.ro', bio: 'Analizează oportunități de investiție și randamente, cu recomandări argumentate și date ușor de înțeles.', photo: vladPhoto.id, order: 3, active: true } }),
])

const common = { status: 'available' as const, currency: 'EUR' as const, energyClass: 'A', publishedAt: new Date().toISOString() }

payload.logger.info('Creez proprietățile demo...')
await Promise.all([
  payload.create({ collection: 'properties', data: { ...common, title: 'Vilă contemporană cu grădină matură', slug: 'vila-contemporana-dumbravita', transaction: 'sale', propertyType: 'house', price: 389000, location: 'Dumbrăvița, Timiș', shortDescription: 'Arhitectură curată, lumină naturală și o grădină gândită pentru seri liniștite în familie.', description: 'O casă atent proiectată pentru viața de zi cu zi: zone de zi ample, bucătărie deschisă, dormitoare bine proporționate și legătură firească între interior și grădină. Finisajele sunt neutre și durabile, iar zona oferă acces rapid către oraș.', area: 186, landArea: 520, rooms: 5, bathrooms: 3, yearBuilt: 2024, features: [{ feature: 'Încălzire în pardoseală' }, { feature: 'Terasă acoperită' }, { feature: 'Două locuri de parcare' }, { feature: 'Sistem smart home' }], images: [villa.id, house.id, apartment.id], agent: andrei.id, featured: true } }),
  payload.create({ collection: 'properties', data: { ...common, title: 'Apartament luminos lângă Parcul Botanic', slug: 'apartament-parcul-botanic', transaction: 'sale', propertyType: 'apartment', price: 164000, location: 'Cetate, Timișoara', shortDescription: 'Un apartament echilibrat, renovat complet, la câteva minute de centrul orașului.', description: 'Situat într-o clădire bine întreținută, apartamentul combină detaliile clasice cu o amenajare contemporană. Zona de zi este generoasă, dormitoarele sunt retrase, iar parcul și centrul sunt la distanță de mers pe jos.', area: 78, rooms: 3, bathrooms: 2, floor: '2 / 4', yearBuilt: 1986, energyClass: 'B', features: [{ feature: 'Renovat complet' }, { feature: 'Balcon' }, { feature: 'Boxă la subsol' }, { feature: 'Aer condiționat' }], images: [apartment.id, penthouse.id], agent: mara.id, featured: true } }),
  payload.create({ collection: 'properties', data: { ...common, title: 'Penthouse cu terasă panoramică', slug: 'penthouse-terasa-torontalului', transaction: 'sale', propertyType: 'penthouse', status: 'reserved', price: 278000, location: 'Torontalului, Timișoara', shortDescription: 'Spații deschise, terasă de 64 m² și vedere amplă peste nordul orașului.', description: 'Un penthouse aerisit, cu o zonă de zi concepută în jurul terasei și ferestre ample pe două orientări. Proprietatea se vinde complet finisată și include două locuri de parcare.', area: 112, rooms: 4, bathrooms: 2, floor: '7 / 7', yearBuilt: 2023, features: [{ feature: 'Terasă 64 m²' }, { feature: 'Lift' }, { feature: 'Două parcări' }, { feature: 'Vedere panoramică' }], images: [penthouse.id, apartment.id], agent: vlad.id, featured: true } }),
  payload.create({ collection: 'properties', data: { ...common, title: 'Casă calmă, aproape de Pădurea Verde', slug: 'casa-padurea-verde', transaction: 'rent', propertyType: 'house', price: 1350, location: 'Ghiroda, Timiș', shortDescription: 'Casă mobilată, cu birou separat și curte privată, disponibilă imediat.', description: 'Potrivită pentru o familie care își dorește apropiere de natură și acces bun către oraș. Casa este mobilată complet, are o zonă de lucru separată și o curte ușor de întreținut.', area: 148, landArea: 390, rooms: 4, bathrooms: 2, yearBuilt: 2021, features: [{ feature: 'Complet mobilată' }, { feature: 'Birou separat' }, { feature: 'Curte privată' }, { feature: 'Disponibilă imediat' }], images: [house.id, villa.id], agent: mara.id, featured: false } }),
])

payload.logger.info('Seed finalizat. Poți porni aplicația și crea primul administrator la /admin.')
process.exit(0)
