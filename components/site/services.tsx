import Link from "next/link"

const services = [
  {
    title: "Shamanic Power Retrieval",
    duration: "1–1.5 hrs",
    price: "£77",
    delivery: "In person or online",
    description:
      "Shamanic Power Retrieval is a deeply sacred healing practice that gently restores the parts of ourselves we may have lost through trauma, fear, or life's many challenges.",
    emailSubject: "Booking Request — Shamanic Power Retrieval",
  },
  {
    title: "Pásale Healing",
    duration: "1–1.5 hrs",
    price: "£77",
    delivery: "In person or online",
    description:
      "Pásale is a sacred shamanic healing practice, gifted to me through the teachings of an Apache Warrior Shaman.",
    emailSubject: "Booking Request — Pásale Healing",
  },
  {
    title: "Psychic Tarot Card Reading",
    duration: "45 min",
    price: "£45",
    delivery: "In person or online",
    description:
      "I offer deeply intuitive, shamanic-led psychic readings that connect you with guidance, clarity, and insight.",
    emailSubject: "Booking Request — Psychic Tarot Card Reading",
  },
  {
    title: "Rune Reading",
    duration: "45 min",
    price: "£45",
    delivery: "In person or online",
    description:
      "I offer rune readings rooted in the ancient Elder Futhark, drawing on Norse wisdom to illuminate your path.",
    emailSubject: "Booking Request — Rune Reading",
  },
  {
    title: "Email Tarot or Rune Reading",
    duration: null,
    price: "£29",
    delivery: "Delivered within 24–48 hours",
    description:
      "I offer intuitive distance readings via email — perfect if you prefer a written response you can revisit anytime.",
    emailSubject: "Booking Request — Email Tarot or Rune Reading",
  },
]

export function Services() {
  return (
    <section id="readings" className="relative bg-sage py-10 md:py-14">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gold/40"
      />
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

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <article
              key={s.title}
              className="group relative flex flex-col rounded-sm border border-gold bg-sand p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-ivory/80 text-sm">
          Payment is taken securely at the time of booking. Sessions are
          delivered via Zoom for online readings.
        </p>
      </div>
    </section>
  )
}
