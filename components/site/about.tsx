import Image from "next/image"
import { Globe, ShieldCheck, Heart } from "lucide-react"

export function About() {
  return (
    <section id="about" className="bg-cream py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="relative">
          <div className="relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden rounded-sm shadow-xl">
            <Image
              src="/images/alison-portrait.jpg"
              alt="Alison Thomas in a quiet, warm setting"
              fill
              sizes="(min-width: 768px) 40vw, 80vw"
              className="object-cover"
            />
          </div>
          <div
            aria-hidden
            className="absolute -z-0 inset-0 translate-x-4 translate-y-4 border border-gold/60 rounded-sm max-w-md mx-auto"
          />
        </div>

        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/60 bg-ivory px-4 py-1.5 text-[11px] tracking-[0.24em] uppercase text-navy/80">
            <Globe className="h-3.5 w-3.5 text-turquoise" />
            International Medium — Isle of Man &amp; Worldwide Online
          </span>

          <h2 className="mt-5 font-serif text-4xl md:text-5xl text-navy text-balance">
            A grounded approach to spirit.
          </h2>

          <div className="mt-6 space-y-5 text-charcoal/85 leading-relaxed text-pretty">
            <p>
              For 17 years I served as a police detective in crime scene
              investigation. That work taught me to look closely, to test what
              I&apos;m told, and to hold the truth above everything else. I
              bring the same discipline into my mediumship today.
            </p>
            <p>
              Based in Onchan on the Isle of Man, I work with clients across the
              world — online and in person. My readings are evidential: I aim
              to share specific, verifiable details from your loved ones so
              that what comes through feels unmistakably them.
            </p>
            <p>
              This work is sacred to me, but it isn&apos;t performance. No
              theatrics, no guesswork, no fishing — just honest connection,
              offered with care.
            </p>
          </div>

          <ul className="mt-8 grid sm:grid-cols-2 gap-4">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold/20 text-gold-dark">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <p className="font-serif text-lg text-navy leading-tight">
                  Evidence First
                </p>
                <p className="text-sm text-charcoal/70">
                  Names, places, memories — the details matter.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold/20 text-gold-dark">
                <Heart className="h-4 w-4" />
              </span>
              <div>
                <p className="font-serif text-lg text-navy leading-tight">
                  Held with Care
                </p>
                <p className="text-sm text-charcoal/70">
                  A safe, steady space — whatever you&apos;re carrying.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
