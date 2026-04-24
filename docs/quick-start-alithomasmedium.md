# Koppla alithomasmedium@gmail.com — snabbguide

Detta är en koncis version av `BOOKING_SETUP.md` för just er mail.
Räkna med ca 20 min totalt. Allt måste göras från ett fönster där
ni är inloggade som **alithomasmedium@gmail.com**.

## Checklista innan du börjar

- [ ] Logga ut från alla andra Google-konton i din webbläsare, eller
      öppna ett privat/inkognito-fönster och logga bara in som
      alithomasmedium@gmail.com.
- [ ] Klona eller hämta projektet lokalt så du har filerna tillgängliga.

---

## Steg 1 — Skapa Google Cloud-projektet (3 min)

1. Öppna <https://console.cloud.google.com/> — var säker på att det
   står **alithomasmedium@gmail.com** uppe till höger.
2. **Select a project → New Project**. Namn: `alison-booking`. Create.
3. I sökrutan högst upp, skriv **Google Calendar API** → klicka på
   resultatet → tryck **Enable**.

## Steg 2 — OAuth-samtyckesskärm (3 min)

1. Vänstermeny → **APIs & Services → OAuth consent screen**.
2. Välj **External → Create**.
3. Fyll i:
   - App name: `Alison Thomas Booking`
   - User support email: `alithomasmedium@gmail.com`
   - Developer contact: `alithomasmedium@gmail.com`
4. **Save and continue** genom stegen.
5. På **Scopes** → Add or Remove Scopes → bocka för:
   - `.../auth/calendar.events`
   - `.../auth/calendar.freebusy`
6. På **Test users** → Add Users → skriv `alithomasmedium@gmail.com`.
7. **Save and continue** till slutet.

## Steg 3 — Skapa OAuth-klienten (2 min)

1. Vänstermeny → **APIs & Services → Credentials → Create credentials
   → OAuth client ID**.
2. Application type: **Web application**.
3. Name: `Alison Booking — Web`.
4. Under **Authorized redirect URIs**, lägg till:
   - `http://localhost:3100/callback`
   - (och senare när sidan är live: `https://alisonthomasmedium.com/api/auth/google/callback`)
5. **Create** → kopiera **Client ID** och **Client secret**. Spara
   dessa temporärt — ni behöver dem strax.

## Steg 4 — Lägg in credentials lokalt (1 min)

I projektmappen `Alicon/b_KPXO48X3hbM`, kopiera `.env.example` till
`.env.local`:

```bash
cp .env.example .env.local
```

Öppna `.env.local` och klistra in:

```
GOOGLE_CLIENT_ID=<Client ID från steg 3>
GOOGLE_CLIENT_SECRET=<Client secret från steg 3>
GOOGLE_REDIRECT_URI=http://localhost:3100/callback
GOOGLE_REFRESH_TOKEN=
GOOGLE_CALENDAR_ID=primary
```

`GOOGLE_REFRESH_TOKEN` lämnas tom än så länge.

## Steg 5 — Kör OAuth-scriptet en gång (2 min)

```bash
cd Alicon/b_KPXO48X3hbM
pnpm install
export $(grep -v '^#' .env.local | xargs)
node scripts/get-google-refresh-token.mjs
```

Webbläsaren öppnas automatiskt.

- **Välj alithomasmedium@gmail.com** i listan (om flera Google-konton
  dyker upp).
- Du får en "Google hasn't verified this app"-varning — tryck
  **Advanced → Go to Alison Thomas Booking (unsafe)**. Det är normalt
  för appar i Testing-läge.
- Godkänn båda kalenderbehörigheterna.
- Tillbaka i terminalen skrivs en rad ut:

```
GOOGLE_REFRESH_TOKEN=1//0g_mycket_långt_token
```

Klistra in hela raden i `.env.local` (ersätt den tomma).

## Steg 6 — Testa lokalt

```bash
pnpm dev
```

Öppna <http://localhost:3000> i webbläsaren, scrolla till
bokningssektionen, välj en tjänst, och verifiera:

- Lediga tider visas bara där alithomasmedium@gmail.com verkligen är
  ledig enligt Google Calendar.
- Skapa ett test-event i Google Calendar under arbetstiden (t.ex.
  tisdag kl 10:00), uppdatera sidan → den tiden ska försvinna från
  kalendern.
- Gör en testbokning på en ledig tid → kontrollera att eventet skapas
  i Google Calendar med kundens info.

## Steg 7 — Deploy till produktion

I Vercel (eller annan host), lägg samma env-variabler:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_CALENDAR_ID`

(`GOOGLE_REDIRECT_URI` behövs inte i produktion — det används bara av
setup-scriptet lokalt.)

Redeploy. Färdigt.

---

## Vad händer om något går fel?

**"No refresh_token returned" i terminalen**
→ Gå till <https://myaccount.google.com/permissions>, hitta
"Alison Thomas Booking", tryck "Remove Access", och kör scriptet
igen. Google ger bara ut nytt refresh-token vid första auktoriseringen.

**Google-varningen "unverified app" skrämmer**
→ Det är normalt för appar i Testing-läge och syns bara för er (ni
är enda test-användaren). Vill ni bli av med varningen krävs
verifiering — men eftersom appen bara används av ett konto är det
onödigt krångel. Lämna den i Testing.

**Kalendern är tom lokalt**
→ Kolla att `.env.local` har alla fyra värden satta och att
utvecklingsservern startades OM efter att ni fyllde i dem (env läses
bara vid server-start).
