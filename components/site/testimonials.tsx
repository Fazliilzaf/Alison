import { Star, Quote } from "lucide-react"

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

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-ivory py-5 md:py-7">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] tracking-[0.28em] uppercase text-burgundy">
            Kind Words
          </span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl text-navy text-balance">
            From those I&apos;ve sat with.
          </h2>
          <div className="mt-5 mx-auto h-px w-16 bg-gold" />
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-2">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="relative rounded-sm border border-gold/40 bg-cream p-4 shadow-sm"
            >
              <Quote
                aria-hidden
                className="absolute -top-2.5 left-4 h-5 w-5 text-gold bg-ivory px-0.5"
              />
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="h-3 w-3 fill-current"
                    aria-hidden
                  />
                ))}
                <span className="sr-only">5 out of 5 stars</span>
              </div>

              <blockquote
                className="mt-3 font-serif italic text-charcoal/90 leading-relaxed text-pretty"
                style={{ fontSize: "13px" }}
              >
                {`\u201C${t.quote}\u201D`}
              </blockquote>

              <figcaption className="mt-3 flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-px w-6 bg-gold"
                />
                <div>
                  <p className="font-serif text-navy text-sm leading-none">
                    {t.name}
                  </p>
                  <p className="mt-0.5 text-[10px] tracking-[0.18em] uppercase text-charcoal/60">
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
