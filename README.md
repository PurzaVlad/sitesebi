# LC Estate Partners

Site complet pentru agenție imobiliară, cu interfață publică și panou de administrare în aceeași aplicație.

## Ce conține

- pagină principală responsive;
- catalog de proprietăți cu filtre;
- pagină individuală cu galerie, detalii, dotări și agent responsabil;
- pagină de echipă;
- contact și solicitare de evaluare;
- pagină dedicată creditului, cu formular de analiză;
- formulare salvate automat în baza de date;
- programare automată a vizionărilor, cu intervale ocupate blocate;
- CMS la `/admin` pentru proprietăți, media, echipă, solicitări, cereri de credit și setările agenției;
- SQLite pentru instalarea simplă și migrații versionate;
- Dockerfile și Docker Compose cu volum persistent.

## Pornire locală

Cerințe: Node.js 20.9+ și npm.

```bash
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run dev
```

Site-ul este disponibil la `http://localhost:3000`. La prima accesare a `http://localhost:3000/admin`, Payload cere crearea contului de administrator.

`npm run seed` încarcă echipa și proprietățile demo o singură dată. Dacă există deja cel puțin o proprietate, comanda se oprește fără să dubleze datele.

## Administrare

În `/admin`, clientul poate:

- adăuga, modifica și arhiva proprietăți;
- încărca și ordona fotografii;
- alege proprietățile promovate pe home;
- gestiona membrii echipei;
- vedea solicitările venite din formulare și schimba statusul lor;
- vedea și gestiona separat cererile de credit;
- vedea, confirma, finaliza sau anula vizionările programate;
- modifica numele agenției, telefonul, adresa, WhatsApp și textele hero.

Datele demonstrative din cod sunt folosite doar dacă baza de date nu are încă proprietăți sau membri ai echipei. După popularea CMS-ului, site-ul citește exclusiv conținutul administrat.

Pentru o bază de date populată cu vechiul demo, `node --import=tsx scripts/update-sebastian.ts` configurează Sebastian Hepes și Adam Mihai, telefoanele lor și e-mailul comun `lc.estate.solution@gmail.com`. Încarcă fotografiile furnizate ale lui Sebastian și Adam, păstrează relațiile cu proprietățile și dezactivează profilul demonstrativ Vlad Stan după realocarea proprietăților lui către Adam. Nu dublează profilurile sau fotografia la rulări repetate și păstrează ceilalți membri ai echipei. Datele comune se actualizează și în Setări site.

## Deploy cu Docker

1. Generează un secret puternic și configurează `.env`:

```env
PAYLOAD_SECRET=un-secret-lung-si-aleatoriu
NEXT_PUBLIC_SITE_URL=https://domeniul-tau.ro
```

2. Construiește și pornește aplicația:

```bash
docker compose up -d --build
```

3. Opțional, încarcă datele demo în volumul de producție:

```bash
docker compose exec app npm run seed
```

Containerul rulează automat migrațiile înainte să pornească serverul. Baza de date și fișierele încărcate sunt păstrate în volumul `lc_estate_data`, deci supraviețuiesc rebuild-urilor.

Pentru un VPS, aplicația poate sta în spatele Caddy sau Nginx.

## Deploy pe Vercel

CMS-ul necesită o bază de date persistentă externă; `file:./.db` funcționează local sau cu volumul Docker, nu pe Vercel. Adaptorul SQLite este configurat și pentru Turso.

În Vercel → Project → Environment Variables, configurează pentru Production și Preview:

- `PAYLOAD_SECRET`: un secret lung, aleatoriu, nenul, păstrat stabil între deploy-uri;
- `TURSO_DATABASE_URL` și `TURSO_AUTH_TOKEN`: adăugate automat când conectezi baza Turso din Vercel → Storage (au prioritate față de `DATABASE_URL` / `DATABASE_AUTH_TOKEN`);
- `NEXT_PUBLIC_SITE_URL`: `https://sitesebi-mocha.vercel.app` sau domeniul final;
- `BLOB_READ_WRITE_TOKEN`: adăugat automat când conectezi un Blob store (vezi mai jos).

După salvarea variabilelor, rulează un nou deploy. Migrațiile versionate se aplică automat la inițializarea CMS-ului pe Vercel. Prima accesare a `/admin` permite crearea contului de administrator. Baza locală `.db` și fișierul `.env` nu sunt publicate prin Git.

Pentru încărcarea fotografiilor din CMS pe Vercel: Vercel → Storage → Create → Blob, apoi conectează store-ul la proiect. Vercel adaugă automat `BLOB_READ_WRITE_TOKEN`, iar aplicația salvează fișierele în Blob. Fără acest token, fișierele se salvează în directorul local, potrivit pentru dezvoltare sau Docker cu volum persistent.

## Comenzi utile

```bash
npm run dev             # dezvoltare
npm run build           # build de producție
npm run start           # pornește build-ul
npm run lint            # verificare cod
npm run test:e2e        # teste în browser
npm run generate:types  # regenerează tipurile după schimbarea CMS-ului
npm run payload migrate:create # creează o migrare nouă
```

## Înainte de publicare

Confirmă datele de contact, textele, statisticile, fotografiile echipei și modelul politicii de confidențialitate înainte de publicare. Notificările pe e-mail pentru solicitări, cereri de credit și vizionări se activează setând `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER` și `SMTP_PASS` (pentru Gmail: `smtp.gmail.com`, `465`, adresa și o parolă de aplicație). Mesajele merg la e-mailul din Setări site (sau `NOTIFY_EMAIL`), iar cererile de credit și la e-mailul consultantului partener din Setări site → Parteneriat credit. Fără aceste variabile, solicitările sunt salvate în continuare în CMS.

Imaginea hero a fost generată special pentru acest proiect. Fotografiile lui Sebastian Hepes și Adam Mihai sunt furnizate de client. Celelalte fotografii demo ale proprietăților și echipei provin de pe Unsplash și trebuie înlocuite cu materialele reale ale agenției.
# sitesebi
