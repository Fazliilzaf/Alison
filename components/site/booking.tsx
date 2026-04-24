"use client"

import Image from "next/image"
import { Calendar, Clock, CreditCard } from "lucide-react"
import { BookingCalendar } from "@/components/site/booking-calendar"
import { useReveal } from "@/hooks/use-reveal"

const steps = [
  {
    icon: Calendar,
    title: "Choose Your Session",
    description:
      "Select the reading that feels right — mediumship, psychic, or a combination.",
  },
  {
    icon: Clock,
    title: "Pick a Time",
    description:
      "Find a slot in my calendar that works for your time zone. All bookings are confirmed instantly.",
  },
  {
    icon: CreditCard,
    title: "Confirm & Pay",
    description:
      "Secure your session with a simple, encrypted payment. A Zoom link arrives by email.",
  },
]

export function Booking() {
  const { ref: headerRef, shown: headerShown } = useReveal<HTMLDivElement>()
  const { ref: stepsRef, shown: stepsShown } = useReveal<HTMLOListElement>()
  const { ref: calRef, shown: calShown } = useReveal<HTMLDivElement>()
  const { ref: footRef, shown: footShown } = useReveal<HTMLParagraphElement>()

  return (
    <section
      id="book"
      className="relative py-16 md:py-24 overflow-hidden"
      style={{ backgroundColor: "#3E4E68" }}
    >
      {/* Diskreta radialer för djup */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 0%, rgba(217,199,142,0.08), transparent 60%), radial-gradient(40% 40% at 100% 100%, rgba(127,184,179,0.06), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8 text-center text-ivory">
        <div ref={headerRef} data-shown={headerShown} className="reveal">
          {/* Mindre, signaturmässig logo (bara träd) — undviker upprepning av hero */}
          <div
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold/40"
            style={{ backgroundColor: "#2D3A4F" }}
          >
            <Image
              src="/images/tree-only.png"
              alt=""
              width={120}
              height={120}
              className="block h-[68%] w-[68%] object-contain"
            />
          </div>
          <span className="mt-6 inline-block text-[11px] tracking-[0.28em] uppercase text-gold/90">
            Book a Session
          </span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl text-gold text-balance">
            A simple, gentle booking flow.
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-ivory/80 leading-relaxed text-pretty">
            Three steps — and you&apos;re held from there. If you&apos;d prefer
            to speak before booking, I welcome a short email first.
          </p>
        </div>

        <ol
          ref={stepsRef}
          data-shown={stepsShown}
          className="reveal-stagger mt-16 grid md:grid-cols-3 gap-12 md:gap-8 text-left md:text-center"
        >
          {steps.map((s, i) => {
            const Icon = s.icon
            return (
              <li key={s.title} className="relative">
                {/* Förbindande linje mellan stegen (endast desktop) */}
                {i < steps.length - 1 && (
                  <div
                    aria-hidden
                    className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] right-[-1rem] h-px bg-gold/25"
                  />
                )}
                <div className="flex md:justify-center">
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-gold/60 bg-navy-dark text-gold transition-transform duration-500 hover:scale-105">
                    <Icon className="h-6 w-6" />
                  </span>
                </div>
                <p className="mt-4 font-script text-gold text-2xl md:text-center">
                  Step {i + 1}
                </p>
                <h3 className="mt-1 font-serif text-2xl text-ivory md:text-center">
                  {s.title}
                </h3>
                <p className="mt-2 text-ivory/75 text-sm leading-relaxed md:text-center md:max-w-[28ch] md:mx-auto">
                  {s.description}
                </p>
              </li>
            )
          })}
        </ol>

        {/* Live booking calendar (FullCalendar). Renderas in efter scroll-reveal. */}
        <div ref={calRef} data-shown={calShown} className="reveal">
          <BookingCalendar />
        </div>

        <p
          ref={footRef}
          data-shown={footShown}
          className="reveal mt-10 text-ivory/70 text-xs tracking-[0.2em] uppercase"
        >
          Prefer email? Write to{" "}
          <a
            href="mailto:hello@alisonthomasmedium.com"
            className="text-gold hover:text-gold-dark underline underline-offset-4"
          >
            hello@alisonthomasmedium.com
          </a>
        </p>
      </div>
    </section>
  )
}
