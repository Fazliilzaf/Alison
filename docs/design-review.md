# Designgenomgång — Alison Thomas Medium

**Projekt:** `Alicon/b_KPXO48X3hbM` (Next.js 16 · React 19 · Tailwind v4 · shadcn/ui · statisk export → GitHub Pages)
**Granskare:** Claude
**Datum:** 24 april 2026

---

## 1. Helhetsintryck

Sajten har en mogen, omtänksam grundpalett (ivory · cream · gold · navy · sage) och en typografi-trio (Cormorant Garamond serif, Lato sans, Pinyon Script) som passar varumärket — andlig, jordnära, hederlig. Strukturen är tydlig: hero → trust → about → services → booking → testimonials → footer.

Det som *just nu* drar ner den professionella känslan:

1. **Statiskt under fold.** Hela sidan avslöjas direkt — inga scroll-reveals, ingen rytm. För en sajt som handlar om medvetenhet och närvaro saknas en känsla av att läsaren rör sig genom något.
2. **Redundans i hero.** Statistiken (10+ / 15+ / 17) visas i hero, och `TrustStrip` direkt under upprepar nästan exakt samma siffror. Två sektioner gör samma jobb.
3. **Inkonsekvent vertikal rytm.** `Testimonials` har `py-5 md:py-7` medan resten har `py-10 md:py-14`. Det blir trångt mellan testimonials och footer.
4. **Loggan visas 4 gånger** (nav, hero, booking, footer). Hero har redan en monumental version — när hon dyker upp igen i Booking känns det överarbetat.
5. **Scroll-beteende.** `scroll-behavior: smooth` är på, men det finns ingen scroll-driven känsla. Navigeringen hoppar mellan sektioner istället för att leda läsaren.

Resten av dokumentet ger konkreta förbättringar och ett menyval av scroll-effekter — alla tonade till varumärkets stilla, sakrala karaktär (*aldrig* skrikande Awwwards-effekter, aldrig scroll-jacking).

---

## 2. Designförbättringar (prioriterad lista)

### 2.1 Ta bort dubbleringen mellan Hero och TrustStrip
Hero har en `<dl>` med 3 stats. `TrustStrip` har 4 stats varav 2 är samma. Två alternativ:

- **Alternativ A (rekommenderas):** Ta bort `<dl>`-blocket från `hero.tsx` (rad 89–108). Låt hero handla om *välkomst och citat*, låt `TrustStrip` bära siffrorna ensam.
- **Alternativ B:** Behåll i hero, ta bort `TrustStrip` helt och flytta "Pásale Healers Worldwide" + "Honest Evidential Work" till en mindre prydnadsrad inuti About.

### 2.2 Ge Testimonials samma andning som övriga sektioner
```diff
- <section id="testimonials" className="bg-ivory py-5 md:py-7">
+ <section id="testimonials" className="bg-ivory py-16 md:py-24">
```
Och citatens fontstorlek `13px` är för liten för serif-italic på cream — bumpa till 15–16px:
```diff
- style={{ fontSize: "13px" }}
+ className="mt-3 font-serif italic text-charcoal/90 leading-relaxed text-pretty text-[15px] md:text-base"
```
Öka även gap mellan korten:
```diff
- <div className="mt-8 grid md:grid-cols-2 gap-2">
+ <div className="mt-12 grid md:grid-cols-2 gap-6 lg:gap-8">
```

### 2.3 Lös Services 5-i-3-grid-problemet
Just nu blir det 3 + 2, vilket ser obalanserat ut. Email-läsningen är konceptuellt annorlunda (asynkront, lägre pris, inget tidsbokat). Ge den egen behandling:

```tsx
// Visa de 4 "live"-tjänsterna i en 2x2 (md) eller 4-kolumners grid
<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {services.slice(0, 4).map(...)}
</div>

// Email-läsningen som en bredare "alternativ-kort" under
<article className="mt-6 rounded-sm border border-gold/60 bg-ivory p-8 md:flex md:items-center md:justify-between gap-8">
  <div>
    <span className="text-[11px] tracking-[0.28em] uppercase text-burgundy/80">Asynchronous</span>
    <h3 className="mt-1 font-serif text-2xl text-navy">Email Tarot or Rune Reading</h3>
    <p className="mt-2 text-charcoal/75 max-w-prose">{services[4].description}</p>
  </div>
  <div className="mt-5 md:mt-0 flex items-baseline md:flex-col md:items-end gap-3">
    <span className="font-serif text-3xl text-gold-dark">£29</span>
    <Link href={`mailto:...`} className="...">Request reading</Link>
  </div>
</article>
```

### 2.4 Använd loggan med restriktion
- **Hero:** behåll (det är platsen för stor logotyp).
- **Nav:** behåll lilla `tree-only.png`.
- **Booking:** byt ut `loggo.png` mot bara trädet (`tree-only.png`) i mindre format, eller ta bort helt och låt rubriken bära.
- **Footer:** byt ut `loggo.png` (h-32 w-32) mot wordmark + tree-only sida vid sida, mer som signatur än hero igen.

### 2.5 Stilla ner divider-användningen
Du har gold-streck på minst 7 ställen (nav border, hero divider, trust-strip top och bottom, services top, testimonials divider, footer top, footer bottom). Behåll det som rituella separatorer mellan *huvudkapitel* (Hero/About-gränsen, Booking/Testimonials-gränsen) och plocka bort dekorativa duplikat.

### 2.6 Förstärk script-fonten
Pinyon Script används bara i nav och som "Step 1/2/3" i Booking. Den är charmig men osynlig. Ge den en signaturroll:

- En liten signatur "— Alison" under hero-citatet.
- Avsnittsöverskrifter kunde haft en script-byline ovanför sig: *"a warm welcome"* (script) → "Honest, evidential readings" (serif).
- I footer: "*With care*" som handskriven avslutning.

### 2.7 Tillgänglighet — fixa fokusringar
```css
* {
  @apply border-border outline-ring/50;  /* nuvarande - dödar fokus */
}
```
Detta sätter outline på *allt*, vilket gör tangentbordsnavigering otydlig. Förslag:
```css
*:focus-visible {
  @apply outline-2 outline-offset-2 outline-gold;
}
```
Och respektera reduced-motion (lägg i `globals.css`):
```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .fade-in-up { animation: none; opacity: 1; transform: none; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 2.8 Hero-höjd
`min-h-[560px]` är för lågt på 1440p+ skärmar. Använd `min-h-[clamp(560px,80svh,820px)]` så hero alltid känns *närvarande* på en första skärmbild utan att bli klaustrofobiskt på laptops.

### 2.9 Booking — ersätt loading-prick med riktig estetik
Calendly-platshållaren ser ut som en spinner i en fångsel. Innan riktig embed:
```tsx
<div className="mt-16 mx-auto max-w-3xl rounded-sm border border-gold/40 bg-navy-dark/40 p-12">
  <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center text-left">
    <div className="font-script text-gold text-5xl leading-none">Soon</div>
    <div>
      <p className="text-gold/90 text-xs tracking-[0.28em] uppercase">Booking calendar</p>
      <p className="mt-2 text-ivory/80">
        Until the calendar is live, write to me directly — I read every email personally and reply within a day.
      </p>
      <a href="mailto:hello@alisonthomasmedium.com" className="mt-5 inline-flex items-center justify-center rounded-full bg-gold px-7 py-3 text-sm font-medium text-navy hover:bg-gold-dark transition-colors">
        Write to Alison
      </a>
    </div>
  </div>
</div>
```

---

## 3. Scroll-effekter — kurerat menyval

**Designprincip:** Effekterna ska kännas som *andetag*, inte som tricks. Långsamma easings (700–1100ms), korta avstånd (8–24px), aldrig flera samtidigt. Spirituellt = stilla. Allt ska respektera `prefers-reduced-motion`.

### 3.1 Implementationsstrategi (välj en)

| Strategi | Fördelar | Nackdelar |
|---|---|---|
| **A. CSS scroll-driven animations** (`animation-timeline: view()`) | 0 KB JS, native, perfekt för statisk export | Safari saknar fortfarande stöd (april 2026). Behövs progressive enhancement. |
| **B. Framer Motion / `motion`** (`pnpm add motion`) | Enkel API (`whileInView`), bra cross-browser, perfekt för React 19 | ~50 KB minified |
| **C. Egen `useInView`-hook + CSS-klasser** | ~30 rader kod, ingen ny dep | Lite mer manuellt arbete |

**Min rekommendation:** **C för basreveals + A som progressive enhancement för pinned/parallax** där det skulle ge mest. Du undviker en runtime-dep helt och hållet och behåller den statiska exporten lätt.

### 3.2 `useReveal`-hook (lägg i `hooks/use-reveal.ts`)

```tsx
"use client"
import { useEffect, useRef, useState } from "react"

export function useReveal<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (!ref.current || shown) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15, ...options },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [shown, options])

  return { ref, shown }
}
```

Och CSS-utility (lägg till i `globals.css` under `@layer utilities`):

```css
.reveal {
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 900ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal[data-shown="true"] { opacity: 1; transform: none; }

.reveal-stagger > * {
  opacity: 0;
  transform: translateY(14px);
  transition:
    opacity 800ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 800ms cubic-bezier(0.22, 1, 0.36, 1);
}
.reveal-stagger[data-shown="true"] > *:nth-child(1) { transition-delay: 0ms; }
.reveal-stagger[data-shown="true"] > *:nth-child(2) { transition-delay: 80ms; }
.reveal-stagger[data-shown="true"] > *:nth-child(3) { transition-delay: 160ms; }
.reveal-stagger[data-shown="true"] > *:nth-child(4) { transition-delay: 240ms; }
.reveal-stagger[data-shown="true"] > *:nth-child(n) { opacity: 1; transform: none; }
```

Användning:
```tsx
const { ref, shown } = useReveal<HTMLDivElement>()
return <div ref={ref} data-shown={shown} className="reveal-stagger">…</div>
```

### 3.3 Effekt per sektion

#### Site Nav — *redan löst, gör det fräschare*
Nuvarande `bg-ivory/90 backdrop-blur` när `scrollY > 12` är bra. Lägg till:
- **Auto-hide vid scroll ner, visa vid scroll upp** (klassiskt mönster, känns lyxigt). Endast på desktop.
- **Tunn progressindikator** längst ner i headern (1px gold-linje som växer från 0 → 100% genom sidan).

```tsx
// Lägg till i SiteNav, efter eslints i useEffect:
const [hidden, setHidden] = useState(false)
const lastY = useRef(0)
const [progress, setProgress] = useState(0)

useEffect(() => {
  const onScroll = () => {
    const y = window.scrollY
    setScrolled(y > 12)
    setHidden(y > 120 && y > lastY.current)
    lastY.current = y
    const h = document.documentElement.scrollHeight - window.innerHeight
    setProgress(h > 0 ? Math.min(100, (y / h) * 100) : 0)
  }
  onScroll()
  window.addEventListener("scroll", onScroll, { passive: true })
  return () => window.removeEventListener("scroll", onScroll)
}, [])

// Klass på <header>:
className={cn(
  "sticky top-0 inset-x-0 z-50 transition-transform duration-500",
  scrolled ? "bg-ivory/90 backdrop-blur border-b border-gold/30" : "bg-transparent",
  hidden ? "-translate-y-full" : "translate-y-0",
)}

// Lägg sist i headern:
<div className="absolute inset-x-0 bottom-0 h-px bg-gold/20">
  <div className="h-full bg-gold transition-[width] duration-150" style={{ width: `${progress}%` }} />
</div>
```

#### Hero — *redan har fade-in-up vid load. Lägg till en stilla parallax.*
- **Subtil parallax på porträttet:** flytta -3% till +3% av scroll inom hero (max 24px translate).
- **Logo i vänsterspalten andas mjukt:** lägg en `filter: brightness()`-skiftning som följer scroll så att den känns levande utan animation.
- **Citatet glider in** med klassisk `fade-in-up` (redan gjort) — men tappa det när användaren börjar scrolla för att fokus ska gå nedåt.

Konkret parallax (CSS-based med `transform: translate3d` driven av en scroll-listener — billig):
```tsx
// I Hero.tsx, gör komponenten "use client"
"use client"
import { useEffect, useRef } from "react"

export function Hero() {
  const portraitRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 600)
        if (portraitRef.current) {
          portraitRef.current.style.transform = `translate3d(0, ${y * 0.06}px, 0)`
        }
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  // … wrappa porträttet med ref={portraitRef}
}
```

#### TrustStrip — *räkna upp siffrorna när de syns*
Animera från 0 → faktiskt värde. Det här är ett klassiskt grepp som funkar för "trust"-block. Enkel hook:
```tsx
"use client"
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      const start = performance.now()
      const dur = 1400
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / dur)
        const eased = 1 - Math.pow(1 - p, 3)
        setVal(Math.round(to * eased))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
      io.disconnect()
    }, { threshold: 0.6 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [to])
  return <span ref={ref}>{val}{suffix}</span>
}
```
För "1 of 34" och "100%" gör en variant som räknar upp till siffran.

#### About — *två-stegs reveal*
Bilden glider upp först, texten en aning senare.
```tsx
<section id="about" className="bg-cream py-16 md:py-24">
  <div className="… grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
    <RevealItem delayClass="">{/* bild */}</RevealItem>
    <RevealItem delayClass="md:[transition-delay:200ms]">{/* text */}</RevealItem>
  </div>
</section>
```
Den dekorativa `border border-gold/60` som ligger förskjuten kunde få *animera in offsetten* från (0,0) till (translate-x-4, translate-y-4) när sektionen kommer in — väldigt subtilt skapande av "tyngd".

#### Services — *staggered cards*
Det viktigaste enkla greppet. Använd `reveal-stagger`:
```tsx
<div ref={gridRef} data-shown={shown} className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal-stagger">
  {services.slice(0,4).map(card => …)}
</div>
```
Korten reser sig sekventiellt med 80ms delay, känns mjukt och kontrollerat.

**Bonus — koppla card-tilt till mouse:** lägg en lätt 3D-tilt på hovrade kort (max 4°). Här blir det ett trevligt mikroögonblick. Gör en `<TiltCard>`-wrapper:
```tsx
"use client"
function TiltCard({ children, ...rest }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(800px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-2px)`
  }
  const onLeave = () => { if (ref.current) ref.current.style.transform = "" }
  return <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="transition-transform duration-300" {...rest}>{children}</div>
}
```

#### Booking — *pinned, multi-step storytelling*
Den här sektionen är PERFEKT för en mer djärv effekt eftersom den faktiskt är en process. Tre steg → tre scroll-stationer. Två nivåer:

**Nivå 1 (mjuk):** Steg 1, 2, 3 fade-in:as och cirkelikonerna fylls med gold-bakgrund när de blir aktiva. Linjer dras mellan ikonerna allt eftersom man scrollar.

**Nivå 2 (modern):** Sektionen blir `position: sticky` i 2.5 viewport-höjder. Steg-listan står still, högerkolumnen byter innehåll allt eftersom scroll går — exakt som hur Apple och Stripe gör produktstorytelling. Detta kräver en aning mer arbete men ger den största "wow" utan att vara billig.

Markup-skiss för nivå 2:
```tsx
<section id="book" className="relative bg-navy">
  <div className="sticky top-0 h-screen flex items-center">
    <div className="grid md:grid-cols-2 max-w-6xl mx-auto px-8 gap-16">
      <div>
        {/* steps som highlight:as när scroll-progress passerar 0/0.33/0.66 */}
      </div>
      <div>
        {/* visuellt skiftande del — t.ex. ikon som morfar, ord som skiftar */}
      </div>
    </div>
  </div>
  <div className="h-[150svh]" /> {/* "scroll-room" som driver progressionen */}
</section>
```

Driv progressionen med en `useScrollProgress`-hook:
```tsx
function useScrollProgress(ref: RefObject<HTMLElement>) {
  const [p, setP] = useState(0)
  useEffect(() => {
    if (!ref.current) return
    const onScroll = () => {
      const r = ref.current!.getBoundingClientRect()
      const total = r.height - window.innerHeight
      const passed = Math.min(Math.max(-r.top, 0), total)
      setP(total > 0 ? passed / total : 0)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [ref])
  return p
}
```

#### Testimonials — *testimonials-marquee eller staggered cards*
Två tillvägagångssätt:

**Alt 1 — Stagger (enkelt):** Använd `reveal-stagger` så de fyra korten reser sig en efter en när sektionen kommer in.

**Alt 2 — Marquee (djärvare):** Skapa en horisontell "kvinnornas namn"-marquee högst upp i sektionen ("Sarah · James · Meredith · Elena · Sarah · James …") som rör sig långsamt åt vänster — som en stilla bekräftelse på vilka som har suttit med Alison. Subtilt och vackert.

```css
.marquee {
  animation: marquee 60s linear infinite;
}
@keyframes marquee {
  to { transform: translateX(-50%); }
}
```

#### Footer — *sista andetaget*
Lägg `reveal` med `transition-duration: 1400ms` och en lite längre delay — den ska kännas som en fadning ut, inte ännu en pop-in.

### 3.4 Globala scroll-grepp

- **Custom scrollbar:** smal, gold-tonad. `::-webkit-scrollbar { width: 8px } ::-webkit-scrollbar-thumb { background: var(--gold-dark); border-radius: 4px }`. Sätter direkt en premiumkänsla.
- **Lenis (smooth scroll):** `pnpm add lenis`. Ger en mjuk, kontrollerad scroll som tar bort ryckigheten på trackpad/mus. Detta passar din genre särskilt bra. ~5 KB. Aktivera bara om `prefers-reduced-motion: no-preference`.

```tsx
// app/layout.tsx — lägg en SmoothScroll-wrapper
"use client"
import { useEffect } from "react"
import Lenis from "lenis"

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 3) })
    let raf = 0
    const tick = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); lenis.destroy() }
  }, [])
  return null
}
```

**OBS:** Om du adderar Lenis, ta bort `scroll-behavior: smooth` från CSS — de krockar.

- **Anchor-scrolloffset:** `html { scroll-padding-top: 5rem }` så att `#about`-länkar inte hamnar bakom den sticky headern.

---

## 4. Prioriterad åtgärdslista (vad jag skulle göra först)

| # | Insats | Effort | Impact |
|---|---|---|---|
| 1 | Fixa Testimonials-padding + fontstorlek (2.2) | XS | Hög |
| 2 | Ta bort Hero-stats-dubblett (2.1) | XS | Hög |
| 3 | Lägg till `useReveal` + `.reveal`/`.reveal-stagger` CSS (3.2) | S | Hög |
| 4 | Applicera reveal på About, Services, Testimonials, Footer (3.3) | S | Hög |
| 5 | Auto-hide nav + scroll-progress-linje (3.3) | S | Medel |
| 6 | CountUp i TrustStrip (3.3) | S | Medel |
| 7 | Reducera logo-användning (2.4), tonera divider-linjer (2.5) | XS | Medel |
| 8 | Fixa fokusring + reduced-motion (2.7) | XS | Hög (a11y) |
| 9 | Hero parallax på porträtt (3.3) | S | Medel |
| 10 | Services 4+1 layout för email-läsning (2.3) | M | Medel |
| 11 | Lenis smooth scroll + custom scrollbar (3.4) | S | Hög (perceived quality) |
| 12 | Booking pinned multi-step (3.3, nivå 2) | L | Hög (men valfri) |

**Snabb vinst-pakcet (0,5 dagar):** #1, #2, #3, #4, #5, #8, #11. Det skulle redan flytta sajten från "snyggt v0-bygge" till "polerad professionell sajt".

**Premium-paket (ytterligare 0,5–1 dag):** #6, #9, #10, #12.

---

## 5. Kvalitetskriterier att hålla i medan du bygger

- **Aldrig** flera saker som rör sig samtidigt på skärmen — det ska kännas som *närvaro*, inte aktivitet.
- **Easings:** alltid `cubic-bezier(0.22, 1, 0.36, 1)` (känns naturligt och lyxigt) eller `cubic-bezier(0.16, 1, 0.3, 1)` (lite snabbare attack).
- **Distans:** translate maximalt 24px. Större känns billigt.
- **Tid:** 700–1100ms för reveals, 150–250ms för hover-feedback.
- **Aldrig auto-spelande ljud, popups eller scroll-jacking.**
- **Testa alltid med `prefers-reduced-motion: reduce`** påslagen — ska bli en helt statisk men fortfarande vacker sajt.

---

*Jag har läst igenom hero.tsx, about.tsx, services.tsx, booking.tsx, testimonials.tsx, site-nav.tsx, site-footer.tsx, trust-strip.tsx, layout.tsx, page.tsx, globals.css och next.config.mjs för att skriva detta. Säg till om du vill att jag implementerar någon av punkterna direkt — t.ex. snabbvinst-paketet — så öppnar jag PR-redo edits i `Alicon/b_KPXO48X3hbM`.*
