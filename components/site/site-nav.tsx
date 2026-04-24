"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { href: "#about", label: "About" },
  { href: "#readings", label: "Readings" },
  { href: "#testimonials", label: "Testimonials" },
]

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 12)

      // Auto-hide när vi scrollar ner förbi ett tröskelvärde, visa när vi går upp
      const goingDown = y > lastY.current
      setHidden(y > 160 && goingDown)
      lastY.current = y

      // Sidans scroll-progress (0–100) — ritas som en tunn gold-linje längst ner i headern
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(100, (y / max) * 100) : 0)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // När mobilmenyn är öppen ska headern aldrig döljas
  const shouldHide = hidden && !open

  return (
    <header
      className={cn(
        // transition-all för att få mjuka övergångar på alla properties som ändras
        // (bg, backdrop, border, shadow, transform). Tailwind v4 avskärmar standard-transitions.
        "sticky top-0 inset-x-0 z-50 transition-all duration-500 ease-out",
        scrolled
          ? "bg-ivory/90 backdrop-blur border-b border-gold/30 shadow-[0_1px_0_0_rgba(217,199,142,0.15)]"
          : "bg-transparent",
        shouldHide ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 flex items-center justify-between h-16 md:h-20">
        <Link
          href="#top"
          className="flex items-center gap-3 group"
          aria-label="Alison Thomas — Home"
        >
          <span
            aria-hidden
            className="relative flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full border border-gold shrink-0 overflow-hidden transition-transform duration-300 group-hover:scale-[1.04]"
            style={{ backgroundColor: "#3E4E68" }}
          >
            <Image
              src="/images/tree-only.png"
              alt=""
              width={160}
              height={160}
              className="block h-[80%] w-[80%] object-contain"
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-script text-gold-dark text-2xl md:text-[28px] -mb-0.5">
              Alison Thomas
            </span>
            <span className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-navy/70">
              Spiritual Medium
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative text-sm tracking-wide text-charcoal/80 transition-colors hover:text-burgundy after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-burgundy after:transition-[width] after:duration-300 hover:after:w-full"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="#book"
            className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-navy hover:bg-gold-dark transition-colors shadow-sm"
          >
            Book a Session
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 text-navy"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gold/30 bg-ivory">
          <nav className="px-5 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-base text-charcoal/85 hover:text-burgundy"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="#book"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-gold px-5 py-3 text-sm font-medium text-navy"
            >
              Book a Session
            </Link>
          </nav>
        </div>
      )}

      {/* Scroll-progress — tunn gold-linje längst ner i headern */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-gold/15"
      >
        <div
          className="h-full bg-gold transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  )
}
