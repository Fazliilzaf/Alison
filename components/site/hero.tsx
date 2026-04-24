"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  const portraitRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    if (reduceMotion) return

    let raf = 0
    const onScroll = () => {
      // Aktivera parallax först när användaren faktiskt har börjat scrolla.
      // Annars skriver vår inline-transform över fade-in-up-animationens translate.
      if (window.scrollY <= 0) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 720)
        if (portraitRef.current) {
          portraitRef.current.style.transform = `translate3d(0, ${y * 0.06}px, 0)`
        }
        if (logoRef.current) {
          logoRef.current.style.transform = `translate3d(0, ${y * -0.035}px, 0)`
        }
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <section
      id="top"
      className="relative grid grid-cols-1 md:grid-cols-2 items-stretch min-h-[clamp(560px,80svh,820px)]"
    >
      {/* Vänster — solid navy #3E4E68, matchar loggans inbakade bakgrund exakt */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#3E4E68" }}
      >
        <div className="relative z-10 text-center px-8 py-10 md:py-0 max-w-md">
          <div ref={logoRef} className="flex justify-center fade-in-up will-change-transform">
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
          <p className="mt-3 font-script text-gold text-2xl fade-in-up fade-in-up-delay-3">
            — Alison
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
      <div className="relative flex items-center justify-center bg-ivory px-8 py-10 md:py-0 overflow-hidden">
        <div className="w-full max-w-md text-center">
          <div
            ref={portraitRef}
            className="mx-auto h-56 w-56 md:h-64 md:w-64 overflow-hidden rounded-full ring-4 ring-gold/40 shadow-lg fade-in-up will-change-transform"
          >
            <Image
              src="/images/alison-portrait.jpg"
              alt="Portrait of Alison Thomas"
              width={520}
              height={520}
              className="h-full w-full object-cover object-[center_22%]"
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

          {/* Statistik flyttad till TrustStrip — låter heron andas och bära välkomsten */}
        </div>
      </div>
    </section>
  )
}
