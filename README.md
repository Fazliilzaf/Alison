# Alison Thomas — Spiritual Medium Website

Statisk marknadsföringssajt byggd med **Next.js 16**, **React 19**, **Tailwind CSS v4** och **shadcn/ui**. Deployas automatiskt till **GitHub Pages** via GitHub Actions.

---

## Lokal utveckling

```bash
pnpm install
pnpm dev
```

Öppna sedan [http://localhost:3000](http://localhost:3000).

### Bygg och förhandsgranska statisk export

```bash
pnpm build
# Starta en enkel filserver i ./out för att testa den statiska bygget:
npx serve out
```

---

## Deploy till GitHub Pages

Deploy är helautomatisk — varje push till `main` bygger och publicerar sidan. Så här sätter du upp det en första gång:

### 1. Skapa ett GitHub-repo

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<ditt-användarnamn>/<repo-namn>.git
git push -u origin main
```

### 2. Aktivera GitHub Pages

1. Gå till **Settings → Pages** i ditt repo.
2. Under **Build and deployment → Source**, välj **GitHub Actions**.
3. Gå till fliken **Actions** och vänta — workflow-filen `.github/workflows/deploy.yml` kör sig själv vid första push.

Efter första lyckade körningen ligger sajten på:

- Projektsite: `https://<ditt-användarnamn>.github.io/<repo-namn>/`
- Användarsite (om repo:t heter `<ditt-användarnamn>.github.io`): `https://<ditt-användarnamn>.github.io/`

> `BASE_PATH` (URL-prefixet) sätts automatiskt av `actions/configure-pages`. Du behöver inte göra något extra.

### 3. Egen domän (valfritt)

När du har en domän (t.ex. `alisonthomasmedium.com`):

1. Skapa en fil `public/CNAME` som innehåller din domän på första raden:
   ```
   alisonthomasmedium.com
   ```
2. Lägg till en DNS-post hos din registrator:
   - **Apex-domän (`alisonthomasmedium.com`)**: fyra A-poster mot GitHubs IP-adresser:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **www-subdomän (`www.alisonthomasmedium.com`)**: en CNAME mot `<användarnamn>.github.io.`
3. I **Settings → Pages**, fyll i Custom domain och kryssa i **Enforce HTTPS** (kan ta några minuter innan Let's Encrypt-certet är utfärdat).

---

## Projektstruktur

```
app/
  layout.tsx        # Rootlayout + Google Fonts + SEO-metadata
  page.tsx          # Landningssidans komposition
  globals.css       # Tailwind v4 + varumärkespalett
components/
  site/             # Sektioner: Hero, About, Services, Booking, Testimonials, Footer
  ui/               # shadcn/ui-komponenter
public/images/      # Logo + porträtt
scripts/            # sharp-hjälpskript för bildbehandling (körs manuellt)
.github/workflows/  # GitHub Actions deploy-workflow
```

---

## Saker att fylla i innan lansering

- `SOCIAL_LINKS` i `components/site/site-footer.tsx` — lägg in Instagram/Facebook-URL:er när profiler finns.
- `booking.tsx` har en Calendly-platshållare — byt ut mot riktig inbäddning när kontot är uppsatt.
- Verifiera e-post `hello@alisonthomasmedium.com` är konfigurerad.

---

## Byta hostingstrategi senare

Är kodbasen fortfarande Next.js, inte låst till GitHub Pages. Vill du senare flytta till t.ex. en VPS med Node — ta bara bort `output: "export"` från `next.config.mjs` och kör `pnpm build && pnpm start`.
