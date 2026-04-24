"use client"

import Image from "next/image"
import { Globe, ShieldCheck, Heart } from "lucide-react"
import { useReveal } from "@/hooks/use-reveal"

export function About() {
  const { ref: imageRef, shown: imageShown } = useReveal<HTMLDivElement>()
  const { ref: textRef, shown: textShown } = useReveal<HTMLDivElement>()

  return (
    <section id="about" className="bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div ref={imageRef} className="group relative reveal" data-shown={imageShown}>
          <div className="relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden rounded-sm shadow-xl">
            <Image
              src="/images/alison-portrait.jpg"
              alt="Alison Thomas in a quiet, warm setting"
              fill
              sizes="(min-width: 768px) 40vw, 80vw"
              className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.03]"
            />
          </div>
          {/* Dekorativ gold-border som glider in i sin offset när bilden syns */}
          <div
            aria-hidden
            className={
              "pointer-events-none absolute -z-0 inset-0 border border-gold/60 rounded-sm max-w-md mx-auto transition-transform duration-[1400ms] ease-out " +
              (imageShown
                ? "translate-x-4 translate-y-4"
                : "translate-x-0 translate-y-0")
            }
          />
        </div>

        <div
          ref={textRef}
          data-shown={textShown}
          className="reveal reveal-late"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/60 bg-ivory px-4 py-1.5 text-[11px] tracking-[0.24em] uppercase text-navy/80">
            <Globe className="h-3.5 w-3.5 text-turquoise" />
            International Medium — Isle of Man &amp; Worldwide Online
          </span>

          <h2 className="mt-5 font-serif text-4xl md:text-5xl text-navy text-balance">
            A grounded approach to spirit.
          </h2>

          <div className="mt-6 space-y-5 text-charcoal/85 leading-relaxed text-pretty">
            <p>
              Welcome and thank you for visiting. My path is rooted in the
              sacred work of spiritual and psychic connection, offering
              guidance, clarity, and healing from a place of deep compassion
              and truth. Whether you&apos;re seeking to reconnect with loved
              ones who have passed, or you&apos;re looking to awaken your own
              inner wisdom and healing power, this space is for you.
            </p>
            <p>
              I am a natural medium, born with psychic awareness; however, my
              spiritual gifts truly awakened over a decade ago following a
              profound near-death experience with sepsis that changed my life
              forever. Prior to that, I served as a Police Officer for 17
              years, specialising in crime scene investigation. That foundation
              gave me a deep respect for truth, evidence, and integrity —
              values I now carry into my work as an evidential medium.
              Providing clear, validating messages from loved ones in spirit
              is not only my passion, but my purpose.
            </p>
            <p>
              As an international medium, I have the privilege of connecting
              with people around the world, offering one-to-one readings and
              group demonstrations through online platforms. With a blend of
              psychic insight and shamanic healing practices, I hold space for
              transformation — helping you navigate life&apos;s mysteries,
              restore balance, and walk your spiritual path with greater
              purpose and peace.
            </p>
            <p>
              It is my honour to support you in remembering your own light and
              reclaiming your connection to the seen and unseen world.
              Together, we journey toward healing, love, and empowerment.
            </p>
            <p className="font-serif italic text-navy/80">Ali x</p>
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
