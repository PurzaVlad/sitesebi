// Registers the REBS webhook that refreshes the site's listings when a property changes in the CRM.
// Usage: pnpm rebs:webhook https://domeniul-site-ului.ro   (lists the key's webhooks when run without a URL)
import { config } from 'dotenv'

config({ path: ['.env.local', '.env'] })

const { rebsFetch, rebsPost } = await import('../src/lib/rebs')

type Webhook = { id: number; url: string; event_types: string[]; is_active: boolean; secret?: string }

const site = process.argv[2]?.replace(/\/+$/, '')
const existing = await rebsFetch<Webhook[] | { results: Webhook[] }>('/api/webhooks/')
const hooks = Array.isArray(existing) ? existing : existing.results

if (!site) {
  console.log(hooks.length ? hooks.map((hook) => `#${hook.id} ${hook.is_active ? 'activ' : 'inactiv'} ${hook.url} [${hook.event_types.join(', ')}]`).join('\n') : 'Niciun webhook înregistrat.')
  process.exit(0)
}

if (!/^https:\/\//.test(site)) throw new Error('Adresa trebuie să înceapă cu https://')

const url = `${site}/api/rebs/webhook`
const current = hooks.find((hook) => hook.url === url)
if (current) {
  console.log(`Webhook-ul există deja (#${current.id}). Pentru un secret nou: POST /api/webhooks/${current.id}/rotate-secret/`)
  process.exit(0)
}

const created = await rebsPost<Webhook>('/api/webhooks/', {
  url,
  description: 'Site LC Estate Partners – actualizare proprietăți',
  event_types: ['property.created', 'property.updated', 'property.deleted'],
  include_bulk: true,
})

console.log(`Webhook creat (#${created.id}) pentru ${url}.`)
console.log(`Adaugă în variabilele de mediu ale site-ului (Vercel → Settings → Environment Variables):\n\nREBS_WEBHOOK_SECRET=${created.secret}\n`)
console.log('Apoi redeploy. REBS trimite imediat un eveniment „ping” pentru verificare.')
