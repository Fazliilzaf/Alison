"use client"

import { Star, Quote } from "lucide-react"
import { useReveal } from "@/hooks/use-reveal"

const testimonials = [
  {
    quote:
      "Alison brought through details only my mother would have known — her perfume, a song we used to sing, even the silly name she called our dog. I cried, but I left feeling held.",
    name: "Sarah",
    location: "Manchester, UK",
  },
  {
    quote:
      "I came in skeptical. I left changed. There was no fishing, no vague statements. She told me things about my grandfather that I hadn\u2019t told anyone.",
    name: "James",
    location: "Dublin, Ireland",
  },
  {
    quote:
      "Her background as a detective shows. She\u2019s careful, kind, and grounded. This is the most honest reading I\u2019ve ever had.",
    name: "Meredith",
    location: "Vancouver, Canada",
  },
  {
    quote:
      "I booked an online session from Australia and felt like she was sitting in the room with me. Warm, professional, and deeply gifted.",
    name: "Elena",
    location: "Melbourne, Australia",
  },
]

const marqueeNames = [
  "Sarah · Manchester",
  "James · Dublin",
  "Meredith · Vancouver",
  "Elena · Melbourne",
  "Hanna · Stockholm",
  "Patrick · Cork",
  "Aisha · London",
  "Linnea · Oslo",
]

export function Testimonials() {
  const { ref: headerRef, shown: headerShown } = useReveal<HTMLDivElement>()
  const { ref: gridRef, shown: gridShown } = useReveal<HTMLDivElement>()

  // Dubblera listan så marquee-loopen ser sömlös ut
  const marqueeItems = [...marqueeNames, ...marqueeNames]

  return (
    <section id="testimonials" className="bg-ivory py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div
          ref={headerRef}
          data-shown={headerShown}
          className="reveal text-center max-w-2xl mx-auto"
        >
          <span className="text-[11px] tracking-[0.28em] uppercase text-burgundy">
            Kind Words
          </span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl text-navy text-balance">
            From those I&apos;ve sat with.
          </h2>
          <div className="mt-5 mx-auto h-px w-16 bg-gold" />
        </div>

        {/* Stilla horisontell rörelse av namn — bekräftelse på vilka som suttit med Alison */}
        <div
          aria-hidden
          className="mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
        >
          <div className="marquee-track gap-12 whitespace-nowrap text-[11px] tracking-[0.32em] uppercase text-charcoal/40">
            {marqueeItems.map((n, i) => (
              <span key={i} className="inline-flex items-center gap-12">
                <span>{n}</span>
                <span className="text-gold/70">✦</span>
              </span>
            ))}
          </div>
        </div>

        <div
          ref={gridRef}
          data-shown={gridShown}
          className="mt-12 grid md:grid-cols-2 gap-6 lg:gap-8 reveal-stagger"
        >
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="relative rounded-sm border border-gold/40 bg-cream p-6 md:p-7 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <Quote
                aria-hidden
                className="absolute -top-2.5 left-5 h-5 w-5 text-gold bg-ivory px-0.5"
              />
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="h-3.5 w-3.5 fill-current"
                    aria-hidden
                  />
                ))}
                <span className="sr-only">5 out of 5 stars</span>
              </div>

              <blockquote className="mt-4 font-serif italic text-charcoal/90 leading-relaxed text-pretty text-[15px] md:text-base">
                {`\u201C${t.quote}\u201D`}
              </blockquote>

              <figcaption className="mt-5 flex items-center gap-3">
                <span aria-hidden className="h-px w-8 bg-gold" />
                <div>
                  <p className="font-serif text-navy text-base leading-none">
                    {t.name}
                  </p>
                  <p className="mt-1 text-[10px] tracking-[0.2em] uppercase text-charcoal/60">
                    {t.location}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
