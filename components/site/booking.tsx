import Image from "next/image"
import { Calendar, Clock, CreditCard } from "lucide-react"

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
  return (
    <section
      id="book"
      className="relative py-10 md:py-14 overflow-hidden"
      style={{ backgroundColor: "#3E4E68" }}
    >
      <div className="relative mx-auto max-w-5xl px-5 sm:px-8 text-center text-ivory">
        <Image
          src="/images/loggo.png"
          alt="Alison Thomas — Spiritual Medium & Healer"
          width={400}
          height={400}
          className="mx-auto block h-40 w-40 object-contain"
          style={{
            background: "transparent",
            border: 0,
            padding: 0,
            boxShadow: "none",
            borderRadius: 0,
          }}
        />
        <span className="mt-4 inline-block text-[11px] tracking-[0.28em] uppercase text-gold/90">
          Book a Session
        </span>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl text-gold text-balance">
          A simple, gentle booking flow.
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-ivory/80 leading-relaxed text-pretty">
          Three steps — and you&apos;re held from there. If you&apos;d prefer
          to speak before booking, I welcome a short email first.
        </p>

        <ol className="mt-14 grid md:grid-cols-3 gap-10 md:gap-6 text-left md:text-center">
          {steps.map((s, i) => {
            const Icon = s.icon
            return (
              <li key={s.title} className="relative">
                <div className="flex md:justify-center">
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-gold/60 bg-navy-dark text-gold">
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

        {/* Calendly placeholder */}
        <div className="mt-16 mx-auto max-w-3xl rounded-sm border border-gold/40 bg-navy-dark/60 p-10 md:p-14 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gold/50">
            <span className="h-2.5 w-2.5 rounded-full bg-gold animate-pulse" />
          </div>
          <p className="mt-4 text-gold/90 text-sm tracking-[0.24em] uppercase">
            Booking Calendar
          </p>
          <p className="mt-2 text-ivory/70 text-sm">
            Booking calendar loading… Calendly will be embedded here.
          </p>
          <a
            href="mailto:hello@alisonthomasmedium.com"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-gold px-7 py-3 text-sm font-medium text-navy hover:bg-gold-dark transition-colors"
          >
            Request a Session by Email
          </a>
        </div>
      </div>
    </section>
  )
}
