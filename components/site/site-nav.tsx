"use client"

import { useEffect, useState } from "react"
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
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-ivory/90 backdrop-blur border-b border-gold/30 shadow-[0_1px_0_0_rgba(217,199,142,0.15)]"
          : "bg-transparent",
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
            className="relative flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full border border-gold shrink-0 overflow-hidden"
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
              className="text-sm tracking-wide text-charcoal/80 hover:text-burgundy transition-colors"
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
    </header>
  )
}
