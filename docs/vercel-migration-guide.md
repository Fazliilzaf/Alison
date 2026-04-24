# Flytta Alicon från GitHub Pages till Vercel

Bokningssystemets API-routes (`/api/slots`, `/api/bookings`, admin) kräver
en Node.js-server. GitHub Pages serverar bara statiska filer, så hela
bokningsflödet och admin-sidan fungerar inte där.

Vercel är gratis upp till god marginal för en site som denna, deploar
direkt från samma GitHub-repo, och stödjer Next.js med API-routes,
bilder, fonts och allt annat — utan konfiguration.

Hela migreringen tar ca 10 min.

## Steg 1 — Skapa Vercel-kontot (2 min)

1. Öppna <https://vercel.com/signup> och logga in med **GitHub** (använd
   samma konto som äger Alicon-repot — det gör import trivialt).
2. När du är inloggad, tryck **Add New → Project**.
3. Välj Alicon-repot från listan → **Import**.
4. På import-skärmen:
   - **Framework preset:** Next.js (detekteras automatiskt)
   - **Root directory:** låt stå som `./` (eller välj undermappen om
     repot innehåller fler projekt)
   - Tryck **Environment Variables** och klistra in följande (samma
     som i er `.env.local`):
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `GOOGLE_REFRESH_TOKEN`
     - `GOOGLE_CALENDAR_ID` (t.ex. `primary`)
     - `ADMIN_PASSWORD` (välj ett starkt)
     - `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` — se steg 2
5. Tryck **Deploy**.

Första builden tar ~2 min. Ni får en URL som `alicon-abc.vercel.app` —
klicka dit och verifiera att sidan renderar.

## Steg 2 — Skapa Upstash Redis för admin-lagring (2 min)

Admin-panelen behöver en plats att spara schemaändringar. Vercels
serverless-filer är read-only, så vi använder Upstash Redis
(gratis, ingen kreditkort, REST-API).

1. Öppna <https://upstash.com/> → **Sign up** med GitHub.
2. **Create Database** → välj region **eu-west-1** (närmast UK) →
   **Create**.
3. På databasens sida, scrolla till **REST API** → kopiera:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
4. Tillbaka i Vercel → projektet → **Settings → Environment Variables**
   → lägg till båda → **Save**.
5. **Deployments** → senaste → **Redeploy** så de nya variablerna
   plockas upp.

## Steg 3 — Uppdatera Google OAuth-redirect för produktionsdomänen

När ni skaffar en egen domän (t.ex. `alisonthomasmedium.com`):

1. I Google Cloud Console → **APIs & Services → Credentials** → öppna
   OAuth-klienten ni skapade tidigare.
2. Under **Authorized redirect URIs**, lägg till båda:
   - `https://alisonthomasmedium.com`
   - `https://alisonthomasmedium.com/api/auth/google/callback` (används
     om ni senare adderar in-app re-auth)
3. **Save**.

OAuth-flödet är redan avklarat (ni har refresh-token) så inget mer
behöver göras där — refresh-token är domänoberoende.

## Steg 4 — Koppla er egen domän (2 min)

1. I Vercel → projektet → **Settings → Domains** → **Add**.
2. Skriv `alisonthomasmedium.com` → **Add**.
3. Vercel visar DNS-poster att lägga till hos er domänleverantör
   (`A 76.76.21.21` eller `CNAME cname.vercel-dns.com`).
4. Lägg in dem hos registraren. Inom ~15 min är domänen aktiv, med
   automatisk HTTPS-certifikat.

## Steg 5 — Stäng av GitHub Pages (1 min)

När allt fungerar på Vercel:

1. GitHub → repot → **Settings → Pages** → **Source: None** → Save.
2. (Valfritt) Ta bort `.github/workflows/deploy.yml` i repot för att
   spara lite Actions-minuter.

## Steg 6 — Verifiera att allt funkar

På produktions-URL:en:

- [ ] Besök hemsidan — allt ser ut som tidigare.
- [ ] Scrolla till bokningssektionen — lediga tider ska hämtas.
- [ ] Gå till `/admin/login`, logga in, ändra ett veckoschema,
      spara. Kolla att ändringen syns när du laddar om.
- [ ] Skapa ett Google Calendar-event under en arbetstid → den tiden
      ska försvinna från bokningen när du uppdaterar den publika sidan.
- [ ] Gör en riktig testbokning → kolla Google Calendar att det
      dyker upp där med en Meet-länk i eventet.

## Under tiden — om ni ändå vill behålla GitHub Pages parallellt

`next.config.mjs` är uppdaterad så den stödjer båda lägen:

- Default (Vercel): full build med API-routes och admin.
- Med `STATIC_EXPORT=true`: gammal statisk build för GitHub Pages
  (utan bokningssystem).

Men eftersom hela poängen med bokningssystemet är att det fungerar
i produktion, är rekommendationen att flytta helt till Vercel.

## Kostnadsuppskattning

Denna setup är gratis upp till:

- **Vercel Hobby:** 100 GB bandbredd/mån, 1000 kört serverless-
  funktioner/min. En soloverksamhet kommer inte i närheten.
- **Upstash Redis Free:** 10 000 commands/dag. Admin-panelen använder
  kanske 10/vecka. Bokningssystemet läser schemat 1 gång per
  API-anrop (cachelagras).
- **Google Calendar API:** 1 miljon queries/dag gratis.

Om trafiken växer mycket räcker Vercels Pro-plan (20 USD/mån) med bred
marginal.
