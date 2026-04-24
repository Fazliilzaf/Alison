# Deploy → alisonthomasmedium.com

En ordnad checklista, i rätt följd. Hela flödet tar ~45 min totalt (det mesta är väntetid på Google/Vercel). Klicka dig genom det från toppen.

---

## Status just nu

- ✅ Kod committad lokalt (5 commits på `main`-branchen)
- ✅ Bokningskalender + admin + Google Calendar-integration klar i kod
- ✅ `next.config.mjs` byggd för Vercel (full build default, static export bara om `STATIC_EXPORT=true`)
- ⬜ Repo pushat till GitHub
- ⬜ Google Calendar-credentials skapade
- ⬜ Upstash Redis skapad
- ⬜ Vercel-projekt skapat med env-variabler
- ⬜ DNS pekad mot Vercel
- ⬜ Live på https://alisonthomasmedium.com

---

## Din domän — vad jag ser

```
alisonthomasmedium.com  →  Squarespace-IP:ar (198.49.23.144 m.fl.)
Nameservers             →  ns-cloud-c1..c4.googledomains.com
```

Domänen är registrerad hos **Google Domains (nu Squarespace Domains)** och pekar idag mot en Squarespace-site. När vi är klara byter vi A-posten så den pekar på Vercel istället.

---

## Steg 1 — Pusha till GitHub (5 min, Fazli)

Öppna terminal och kör:

```bash
cd "/Users/fazlikrasniqi/Downloads/Alicon/b_KPXO48X3hbM"
```

Skapa sedan repot på github.com:

1. Gå till <https://github.com/new>
2. **Repository name:** `alisonthomasmedium` (eller valfritt)
3. **Privacy:** Privat rekommenderas (Vercel kan läsa privata repon)
4. Lämna allt annat tomt — **inga README/gitignore/license** (vi har redan)
5. **Create repository**

Kopiera URL:en GitHub visar och kör sedan:

```bash
git remote add origin https://github.com/<ditt-namn>/alisonthomasmedium.git
git push -u origin main
```

Första push kan be om GitHub-lösenord/token — använd **Personal Access Token** om du får HTTPS-prompt (Settings → Developer settings → Tokens). Eller SSH-URL:en om du har SSH-nyckel uppsatt.

---

## Steg 2 — Google Calendar-credentials (20 min, kräver Alison)

> **Viktigt:** Detta steg MÅSTE göras av någon som kan logga in som `alithomasmedium@gmail.com`. OAuth-flödet går inte att delegera.

Öppna `BOOKING_SETUP.md` i repot och följ stegen 1–5. Sammanfattning:

1. **Google Cloud Console** → skapa projekt `alison-booking`
2. Aktivera **Google Calendar API**
3. Konfigurera **OAuth consent screen** (External, publicerad)
4. Skapa **OAuth 2.0 Client ID** (Web application)
   - Redirect URI: `http://localhost:3100/callback`
5. Kör lokalt (i terminalen, samma mapp som repot):
   ```bash
   cp .env.example .env.local
   # klistra in GOOGLE_CLIENT_ID och GOOGLE_CLIENT_SECRET i .env.local
   node scripts/get-google-refresh-token.mjs
   ```
   Skriptet öppnar en browser, Alison loggar in med `alithomasmedium@gmail.com`, accepterar, och du får ett `GOOGLE_REFRESH_TOKEN` i terminalen. Klistra in det i `.env.local`.

Spara värdena — du behöver klistra in dem i Vercel i steg 4.

---

## Steg 3 — Upstash Redis för admin-lagring (3 min)

Admin-panelen behöver en plats att spara schemat. Vercels filsystem är read-only.

1. <https://upstash.com/> → **Sign up with GitHub**
2. **Create Database** → **Name:** `alison-admin` → **Region:** `eu-west-1` (London, närmast IOM) → **Create**
3. På databasens sida, scrolla till **REST API** (inte Redis TCP)
4. Kopiera:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

---

## Steg 4 — Vercel-projektet (5 min)

1. <https://vercel.com/signup> → **Continue with GitHub** → godkänn åtkomst
2. Efter inlogg: **Add New → Project**
3. Välj repot `alisonthomasmedium` → **Import**
4. På import-skärmen:
   - **Framework preset:** Next.js (auto-detekteras)
   - **Root directory:** `./`
   - Öppna **Environment Variables** och klistra in alla nio:
     ```
     GOOGLE_CLIENT_ID       = (från steg 2)
     GOOGLE_CLIENT_SECRET   = (från steg 2)
     GOOGLE_REFRESH_TOKEN   = (från steg 2)
     GOOGLE_CALENDAR_ID     = primary
     ADMIN_PASSWORD         = (välj ett starkt långt lösenord — Alison använder det på /admin/login)
     ADMIN_SESSION_SECRET   = (valfritt, slumpa 32 tecken)
     UPSTASH_REDIS_REST_URL   = (från steg 3)
     UPSTASH_REDIS_REST_TOKEN = (från steg 3)
     ```
5. **Deploy**. Bygget tar ~2 min.

Efter deploy får du en URL som `alisonthomasmedium-xyz.vercel.app`. Öppna den och kolla att sajten renderar — inkl. att bokningskalendern hämtar slots (den pekar mot Google nu och kan vara tom de första minuterna).

---

## Steg 5 — Koppla egen domän (10 min + DNS-propagation)

### 5a. Lägg till domänen i Vercel

1. Vercel → projektet → **Settings → Domains**
2. **Add** → `alisonthomasmedium.com` → **Add**
3. Vercel visar de DNS-poster du behöver. Spara dem öppna.

### 5b. Uppdatera DNS hos Google Domains / Squarespace Domains

1. Logga in på <https://domains.squarespace.com/> (eller <https://domains.google.com/> om kvar där)
2. Välj `alisonthomasmedium.com` → **DNS**
3. **Ta bort** Squarespace-default A-posterna (de fyra 198.x-adresserna)
4. **Lägg till** Vercels A-post:
   - **Type:** A  **Name:** `@`  **Value:** `76.76.21.21`
5. **Lägg till** för www-subdomänen:
   - **Type:** CNAME  **Name:** `www`  **Value:** `cname.vercel-dns.com`
6. Spara

Vänta 5–15 min på propagation. Vercel verifierar automatiskt och utfärdar Let's Encrypt-cert. Du ser ✅ i Vercel → Domains när det är klart.

### 5c. Om mejl används på domänen (t.ex. hello@alisonthomasmedium.com)

Behåll alla MX-poster som pekar mot er e-postleverantör. Byt BARA A/CNAME för webben.

---

## Steg 6 — Uppdatera Google OAuth med produktionsdomänen (2 min)

När domänen är live:

1. Google Cloud Console → **APIs & Services → Credentials**
2. Öppna OAuth-klienten från steg 2
3. Under **Authorized redirect URIs**, lägg till:
   - `https://alisonthomasmedium.com`
   - `https://alisonthomasmedium.com/api/auth/google/callback`
4. **Save**

OAuth fungerar redan eftersom refresh-token är domänoberoende — detta är bara förberedelse för framtida inställningar.

---

## Steg 7 — Verifiera att allt funkar

Öppna `https://alisonthomasmedium.com` och testa:

- [ ] Hemsidan renderar som i previewen
- [ ] Bokningssektionen visar lediga tider (testa att klicka en)
- [ ] Fyll i bokningsformuläret → skickas utan fel (demo-bokning hamnar i Google Calendar)
- [ ] `https://alisonthomasmedium.com/admin/login` → logga in med `ADMIN_PASSWORD`
- [ ] Ändra ett veckoschema → spara → ladda om → ändringen kvar
- [ ] Skapa ett Google Calendar-event under en arbetstid → uppdatera bokningssidan → den tiden ska vara blockad

---

## Felsökning

| Symptom | Lösning |
|---|---|
| Vercel build failar på `pnpm install` | I projektinställningar, **Install Command:** `pnpm install --no-frozen-lockfile` |
| Bokningskalendern visar inga slots | Kolla Vercel → Functions logs för `/api/slots`. Ofta saknas Google-env-var. |
| `/admin/login` ger 500 | Saknas `ADMIN_PASSWORD` eller Upstash-env. Kolla Functions logs. |
| Domänen visar Squarespace-sidan fortfarande | DNS ej propagerad än. Vänta 15 min. Testa med `dig @8.8.8.8 alisonthomasmedium.com` att A-posten är 76.76.21.21. |
| HTTPS-fel | Vercel utfärdar cert automatiskt efter DNS-verifiering. Om det tar >30 min, kolla att DNS-posterna stämmer exakt. |

---

## Vad jag kan göra åt dig just nu

- ✅ Repot är klart och pushbart (5 commits)
- ✅ `next.config.mjs` är Vercel-ready
- ✅ GitHub Actions för gamla static export ligger kvar (oskadlig — aktiveras bara om du pushar med rätt secret)

**Det som kräver dig/Alison:**
- GitHub-repo-skapning (terminalkommandon redo i steg 1)
- Google Cloud-setup (steg 2, kräver Alisons inlogg)
- Upstash/Vercel-kontoskapning (steg 3 + 4)
- DNS-ändring hos Squarespace (steg 5b)

Allt ovan görs i webb-UIs med klick — det finns ingen CLI-genväg jag kan köra åt dig.
