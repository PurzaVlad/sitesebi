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

Pentru un VPS, aplicația poate sta în spatele Caddy sau Nginx. Pentru Vercel ori alt hosting cu filesystem efemer, recomand mutarea bazei pe PostgreSQL și media pe S3/R2 înainte de lansare.

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

Confirmă datele de contact, textele, statisticile, fotografiile echipei și modelul politicii de confidențialitate înainte de publicare. Adaugă un serviciu de e-mail dacă vrei și notificări pe e-mail; solicitările sunt deja salvate în siguranță în CMS chiar fără acesta.

Imaginea hero a fost generată special pentru acest proiect. Fotografiile demo ale proprietăților și echipei provin de pe Unsplash și trebuie înlocuite cu materialele reale ale agenției.
# sitesebi
