import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section
      id="top"
      className="relative grid min-h-[560px] grid-cols-1 md:grid-cols-2 items-stretch"
    >
      {/* Vänster — solid navy #3E4E68, matchar loggans inbakade bakgrund exakt */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#3E4E68" }}
      >
        <div className="relative z-10 text-center px-8 py-10 md:py-0 max-w-md">
          <div className="flex justify-center fade-in-up">
            {/*
              Loggo.png — laddad direkt av användaren med navy #3E4E68
              bakgrund inbakad i bilden. Ingen blend-mode, ingen ram,
              ingen cream-ruta. Matchar vänsterkolumnens bakgrund exakt.
            */}
            <Image
              src="/images/loggo.png"
              alt="Alison Thomas — Spiritual Medium & Healer"
              width={600}
              height={600}
              priority
              className="block h-[320px] w-[320px] object-contain"
              style={{
                background: "transparent",
                border: 0,
                padding: 0,
                boxShadow: "none",
                borderRadius: 0,
              }}
            />
          </div>

          <div className="mt-8 mx-auto h-px w-16 bg-gold/60 fade-in-up fade-in-up-delay-2" />
          <p className="mt-5 font-serif italic text-cream text-lg fade-in-up fade-in-up-delay-3">
            &ldquo;Truth, evidence, and compassion — in every reading.&rdquo;
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 fade-in-up fade-in-up-delay-3">
            <Link
              href="#book"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-medium text-navy hover:bg-gold-dark transition-colors shadow-sm"
            >
              Book a Reading
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#about"
              className="inline-flex items-center justify-center rounded-full border border-ivory/70 px-7 py-3 text-sm font-medium text-ivory hover:border-gold hover:text-gold transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Höger — ivory med porträtt och intro */}
      <div className="relative flex items-center justify-center bg-ivory px-8 py-10 md:py-0">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto h-56 w-56 md:h-64 md:w-64 overflow-hidden rounded-full ring-4 ring-gold/40 shadow-lg fade-in-up">
            <Image
              src="/images/alison-portrait.jpg"
              alt="Portrait of Alison Thomas"
              width={520}
              height={520}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <p className="mt-8 text-[11px] tracking-[0.3em] uppercase text-sage fade-in-up fade-in-up-delay-1">
            A Warm Welcome
          </p>
          <h2 className="mt-3 font-serif text-navy text-3xl md:text-4xl leading-tight text-balance fade-in-up fade-in-up-delay-1">
            Honest, evidential readings — with heart.
          </h2>
          <p className="mt-5 text-charcoal/80 leading-relaxed text-pretty fade-in-up fade-in-up-delay-2">
            I&apos;m Alison — a working spiritual medium, energy healer and
            former police detective. Every reading is rooted in detail,
            integrity and genuine connection with spirit.
          </p>

          <dl className="mt-8 grid grid-cols-3 gap-4 text-center fade-in-up fade-in-up-delay-3">
            <div>
              <dt className="text-[10px] tracking-[0.2em] uppercase text-charcoal/60">
                Years Practising
              </dt>
              <dd className="mt-1 font-serif text-2xl text-gold-dark">10+</dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-[0.2em] uppercase text-charcoal/60">
                Countries Served
              </dt>
              <dd className="mt-1 font-serif text-2xl text-gold-dark">15+</dd>
            </div>
            <div>
              <dt className="text-[10px] tracking-[0.2em] uppercase text-charcoal/60">
                Policing Years
              </dt>
              <dd className="mt-1 font-serif text-2xl text-gold-dark">17</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
