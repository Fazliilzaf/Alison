"use client"

import Link from "next/link"
import { useRef } from "react"
import { Mail } from "lucide-react"
import { useReveal } from "@/hooks/use-reveal"

const services = [
  {
    title: "Shamanic Power Retrieval",
    duration: "1–1.5 hrs",
    price: "£77",
    delivery: "In person or online",
    description:
      "Shamanic Power Retrieval is a deeply sacred healing practice that gently restores the parts of ourselves we may have lost through trauma, fear, or life's many challenges. Over time, we can feel disconnected from our inner strength, purpose, or sense of wholeness — as though something vital is missing. Through this ancient healing work, I lovingly call back your innate power and spiritual vitality, helping you feel more grounded, alive, and aligned with who you truly are. It's a beautiful way to reconnect with your soul's essence and awaken the strength that has always lived within you.",
    emailSubject: "Booking Request — Shamanic Power Retrieval",
  },
  {
    title: "Pásale Healing",
    duration: "1–1.5 hrs",
    price: "£77",
    delivery: "In person or online",
    description:
      "Pásale is a sacred shamanic healing practice, gifted to me through the teachings of an Apache Warrior Shaman, a 4th generation Curandero and Sundancer. I am honoured to be one of just 34 healers worldwide trained in this deeply transformative modality. Pásale is a healing journey for those carrying trauma — whether recent or long-held — yet unlike traditional talk therapy, you don't need to speak about the event itself. Instead, I gently guide you through the energetic layers of your experience, allowing your own body to safely release what it has held onto. This is a space of deep honouring, where true healing begins from within, and the spirit is gently restored to peace.",
    emailSubject: "Booking Request — Pásale Healing",
  },
  {
    title: "Psychic Tarot Card Reading",
    duration: "45 min",
    price: "£45",
    delivery: "In person or online",
    description:
      "I offer deeply intuitive, shamanic-led psychic readings, where I gently connect into your energy and the unseen layers around you to bring clarity, truth, and guidance. Working with the Rider Waite Smith tarot and a range of carefully chosen spreads, I allow each reading to unfold organically, answering your questions while also revealing what your soul is ready to see. These sessions are not just about insight — they are a space for transformation, where patterns can be understood, energy can shift, and you can reconnect with your own inner knowing in a way that feels empowering and real.",
    emailSubject: "Booking Request — Psychic Tarot Card Reading",
  },
  {
    title: "Rune Reading",
    duration: "45 min",
    price: "£45",
    delivery: "In person or online",
    description:
      "I offer rune readings rooted in the ancient Elder Futhark, drawing through the deep, northern currents of shamanic and Norse tradition. These sacred symbols carry the voice of the old ways — steady, wise, and deeply connected to the rhythms of nature, fate, and becoming. As I work intuitively with the runes and a range of spreads, they reveal what lies beneath the surface of your questions, bringing insight into cycles, challenges, and the path ahead. This is grounding, soul-level guidance — supporting you to stand in your strength, honour your journey, and move forward with clarity and purpose.",
    emailSubject: "Booking Request — Rune Reading",
  },
]

const emailReading = {
  title: "Email Tarot or Rune Readings",
  price: "£29",
  delivery: "Delivered within 24–48 hours",
  description:
    "I offer intuitive distance readings via email using either the Rider Waite Smith tarot or the Elder Futhark runes. You simply send your question, and I will draw up to three cards or runes to bring through clear, grounded guidance and insight. Your reading is recorded as a private video, where I walk you through the messages and energies that come forward. All readings are delivered within 24–48 hours, offering you time and space to receive meaningful, personal guidance you can return to whenever you need.",
  emailSubject: "Booking Request — Email Tarot or Rune Readings",
}

/** Subtil 3D-tilt på hover (max 4°). Inaktiv på touch + reduced-motion. */
function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLElement>(null)

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (window.matchMedia("(hover: none)").matches) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg) translateY(-3px)`
  }

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = ""
  }

  return (
    <article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={
        "transition-transform duration-300 ease-out [transform-style:preserve-3d] " +
        className
      }
    >
      {children}
    </article>
  )
}

export function Services() {
  const { ref: gridRef, shown: gridShown } = useReveal<HTMLDivElement>()
  const { ref: emailRef, shown: emailShown } = useReveal<HTMLElement>()

  return (
    <section id="readings" className="relative bg-sage py-16 md:py-24">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gold/40" />
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] tracking-[0.28em] uppercase text-ivory/90">
            Readings &amp; Sessions
          </span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl text-ivory text-balance">
            Ways we can work together.
          </h2>
          <p className="mt-4 text-ivory/85 leading-relaxed text-pretty">
            Every session is held in confidence and tailored to you. Choose the
            path that calls to you — or write to me if you&apos;re not sure.
          </p>
        </div>

        {/* 4 live-tjänster i 2x2 (sm) eller 4-kol (lg), staggered reveal */}
        <div
          ref={gridRef}
          data-shown={gridShown}
          className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal-stagger"
        >
          {services.map((s) => (
            <TiltCard
              key={s.title}
              className="group relative flex flex-col rounded-sm border border-gold bg-sand p-6 shadow-md hover:shadow-xl"
            >
              <div
                aria-hidden
                className="absolute top-0 left-6 right-6 h-px bg-gold/70"
              />

              <h3 className="font-serif text-xl text-navy text-balance">
                {s.title}
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-charcoal/70">
                {s.duration && <span>{s.duration}</span>}
                <span>{s.delivery}</span>
              </div>

              <p className="mt-3 text-charcoal/80 leading-relaxed text-sm flex-1">
                {s.description}
              </p>

              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-serif text-2xl text-gold-dark">
                  {s.price}
                </span>
              </div>

              <div className="mt-4">
                <Link
                  href={`mailto:hello@alisonthomasmedium.com?subject=${encodeURIComponent(s.emailSubject)}`}
                  className="inline-flex w-full items-center justify-center rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-navy-dark"
                >
                  Book Now
                </Link>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Email-läsningen — distinkt asynkron upplevelse, eget brett kort */}
        <article
          ref={emailRef}
          data-shown={emailShown}
          className="reveal mt-6 rounded-sm border border-gold/70 bg-ivory/95 p-6 md:p-8 md:flex md:items-center md:justify-between md:gap-10 shadow-md"
        >
          <div className="md:flex md:items-start md:gap-5">
            <span className="hidden md:inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold-dark">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <span className="text-[11px] tracking-[0.28em] uppercase text-burgundy/80">
                Asynchronous · By Email
              </span>
              <h3 className="mt-1 font-serif text-2xl md:text-3xl text-navy text-balance">
                {emailReading.title}
              </h3>
              <p className="mt-2 text-charcoal/75 max-w-prose leading-relaxed">
                {emailReading.description}
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 flex items-center md:flex-col md:items-end gap-4 md:gap-3 shrink-0">
            <span className="font-serif text-3xl text-gold-dark">
              {emailReading.price}
            </span>
            <Link
              href={`mailto:hello@alisonthomasmedium.com?subject=${encodeURIComponent(emailReading.emailSubject)}`}
              className="inline-flex items-center justify-center rounded-full bg-navy px-6 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-navy-dark"
            >
              Request Reading
            </Link>
          </div>
        </article>

        <p className="mt-10 text-center text-ivory/80 text-sm">
          Payment is taken securely at the time of booking. Sessions are
          delivered via Zoom for online readings.
        </p>
      </div>
    </section>
  )
}
