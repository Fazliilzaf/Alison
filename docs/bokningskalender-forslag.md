# Förslag: Bokningskalender med FullCalendar.js

**Version:** 1.0 (utkast)
**Datum:** 2026-04-24
**Ägare:** Fazli

---

## 1. Sammanfattning

Ett webbaserat bokningssystem där dina kunder själva kan välja tid och boka möten, tjänster eller konsultationer direkt online — utan att behöva ringa eller mejla. Kalendern byggs med **FullCalendar.js v6** på frontend, tillsammans med en lättviktig backend i Next.js och en PostgreSQL-databas.

Systemet byggs från grunden och är därför helt anpassat efter din verksamhet, men återanvänder beprövade open source-komponenter för att hålla utvecklingstid och kostnad nere.

---

## 2. Mål & Målgrupp

**Primärt mål:** Låta kunder boka tid själva, dygnet runt, utan manuell hantering.

**Sekundära mål:**
- Minska antalet mejl och telefonsamtal för enkel tidsbokning.
- Minska risken för dubbelbokningar och missförstånd.
- Ge dig en översikt över kommande bokningar.
- Automatisera bekräftelsemejl och påminnelser.

**Målgrupp:** Externa kunder som vill boka en tjänst hos dig via din hemsida eller direktlänk.

---

## 3. Funktioner

### MVP (första versionen)
Kalendervy med månad, vecka och dag. Visning av lediga tider. Bokningsformulär med namn, e-post, telefon och meddelande. Val av tjänst (olika längd och pris). Automatisk bekräftelse via e-post till både kund och dig. Enkel admin-vy för att se och hantera bokningar. Möjlighet att blockera tider (lunch, semester, sjukdom). Svensk lokalisering.

### Framtida funktioner (fas 2+)
SMS-påminnelser 24 timmar innan bokning. Online-betalning via Stripe eller Klarna. Flera tjänsteleverantörer under samma system. Återkommande bokningar. Kundportal med bokningshistorik. Synkronisering med Google Calendar eller Outlook. Stöd för flera språk.

---

## 4. Teknisk Arkitektur

### Rekommenderad tech stack

**Frontend**
- **FullCalendar.js v6** — kalendervisualisering (MIT-licens, gratis)
- **Next.js 14** (React-ramverk) — modern, snabb, SEO-vänlig
- **Tailwind CSS** — snabb och ren styling

**Backend**
- **Next.js API Routes** — slipper separat serverkod, allt i ett projekt

**Databas**
- **PostgreSQL** via **Supabase** eller **Neon** — gratis startnivå, skalar lätt

**Hosting**
- **Vercel** — gratisnivå räcker långt, byggd för Next.js

**E-post**
- **Resend** — transaktionsmejl, 3 000 mejl/mån gratis

**Framtida: Betalning**
- **Stripe** — standard i Sverige, stödjer Klarna och Swish via integration

### Varför denna stack?
Den är modern, välkänd av svenska utvecklare, har massor av dokumentation och AI-stöd, och kan startas helt gratis. När verksamheten växer går det att skala upp stegvis utan migration.

---

## 5. FullCalendar.js — nyckelfunktioner vi använder

FullCalendar är ett moget open source-bibliotek med brett stöd för bokningsscenarier. De funktioner vi använder:

- **Vy-växling** mellan månad (`dayGridMonth`), vecka (`timeGridWeek`), dag (`timeGridDay`) och listvy (`listWeek`).
- **Lediga tider** hämtas från vårt API och visas som klickbara event.
- **`dateClick`** / **`select`** för att öppna bokningsmodal när kunden klickar på en ledig tid.
- **Affärstider** (`businessHours`) för att tona ner stängda tider.
- **Svensk lokalisering** (`locale: 'sv'`).
- **Drag-and-drop** i admin-vyn för att flytta bokningar snabbt.
- **Responsiv design** — fungerar på mobil och desktop.

---

## 6. Datamodell (förenklad)

Sju grundläggande tabeller räcker för MVP:

**`services`** — tjänsteutbud
`id`, `namn`, `längd_minuter`, `pris`, `beskrivning`, `aktiv`

**`availability_rules`** — öppettider per veckodag
`veckodag`, `start_tid`, `slut_tid`

**`blocked_slots`** — specifika blockerade tider
`start_tid`, `slut_tid`, `orsak`

**`bookings`** — kundbokningar
`id`, `service_id`, `kund_namn`, `kund_email`, `kund_telefon`, `start_tid`, `slut_tid`, `status`, `meddelande`, `skapad_datum`

**`users`** — admin-inloggning
`id`, `email`, `lösenord_hash`, `roll`

---

## 7. Användarflöden

**Kundens bokningsflöde:**
1. Kund besöker din hemsida och trycker på "Boka tid".
2. Kalendern visar tillgängliga tider de kommande veckorna.
3. Kund väljer tjänst, ser uppdaterade tillgängliga tider baserat på tjänstens längd.
4. Kund klickar på en ledig tid → bokningsformulär öppnas.
5. Kund fyller i sina uppgifter och bekräftar.
6. Bekräftelsemejl skickas till kund och dig.
7. Kund får länk för att avboka om det behövs.

**Administratörsflöde:**
1. Du loggar in på en skyddad admin-sida.
2. Översikt över dagens och veckans bokningar.
3. Möjlighet att blockera tider, avboka, flytta bokningar.
4. Hantera tjänsteutbud och öppettider.

---

## 8. Utvecklingsplan & Tidsestimat

**Fas 1 — MVP (ca 40–60 timmar):**
Projektuppsättning, databas, hosting. FullCalendar-integration med lediga tider från API. Bokningsformulär med validering. Bekräftelsemejl via Resend. Enkel admin-vy med inloggning. Testning och deploy till vercel.app-domän.

**Fas 2 — Polish (ca 20–30 timmar):**
SMS-påminnelser (Twilio eller 46elks). Stöd för flera tjänster med olika längder. Bättre admin-UI med filter och sökning. Avbokningslänk för kund. Egen domän.

**Fas 3 — Utökat (ca 40+ timmar, vid behov):**
Online-betalning vid bokning. Kalendersynk med Google/Outlook. Flerspråksstöd. Statistik och rapporter. Flera tjänsteleverantörer.

---

## 9. Kostnadsestimat

**Engångskostnad (utveckling):**
Om du bygger själv med AI-hjälp: några veckors deltidsarbete. Om du anlitar utvecklare: räkna med 40–60 h × utvecklarens timkostnad för MVP.

**Löpande driftkostnader per månad:**
- Vercel hosting: 0 kr (gratis tier räcker länge)
- Supabase databas: 0 kr (gratis tier) eller ca 249 kr vid större volym
- Resend e-post: 0 kr upp till 3 000 mejl/månad
- 46elks SMS (framtida): ca 35 öre per SMS
- Domän (.se): ca 100 kr/år

**Total driftskostnad:** 0–300 kr/mån i starten, skalar upp efter behov.

---

## 10. Risker & Antaganden

**Antaganden denna version bygger på:**
- Enanvändartjänst (du själv eller liten verksamhet).
- Bokningsvolym under 1 000 per månad initialt.
- Svenska som huvudspråk.
- Kunder får länk eller besöker din hemsida för att boka — ingen mobilapp.

**Identifierade risker:**
- **Dubbelbokning** om backend-logik inte hanterar race conditions korrekt → löses med databas-locking.
- **GDPR** — personuppgifter kräver tydlig integritetspolicy, radering på begäran och loggning.
- **E-postleverans** kan misslyckas utan korrekt SPF/DKIM-konfiguration för din domän.
- **Spam-bokningar** — bör skyddas med CAPTCHA eller rate limiting.

---

## 11. Nästa steg

1. Granska detta förslag och ge feedback på funktioner du vill lägga till eller ta bort.
2. Bestäm om du bygger själv (med AI-stöd) eller anlitar utvecklare.
3. Registrera konton: Vercel, Supabase, Resend (allt gratis).
4. Jag kan skapa ett startprojekt baserat på den bifogade prototypen.
5. Iterativ utveckling av MVP (2–3 veckor vid deltid).

---

## Bilaga: Prototyp

En fungerande prototyp med FullCalendar.js är bifogad som `fullcalendar-prototyp.html`. Öppna den i en webbläsare för att klicka runt och få en känsla för hur bokningsvyn kan se ut. Prototypen använder exempeldata men demonstrerar kärnfunktionerna: kalendervy, klickbara lediga tider och bokningsmodal.
