import Image from "next/image"
import Link from "next/link"
import { Mail, MapPin, Instagram, Facebook } from "lucide-react"

// TODO: fyll i riktiga profil-URL:er när de finns. Tomma strängar = ikonen döljs.
const SOCIAL_LINKS = {
  instagram: "",
  facebook: "",
}

export function SiteFooter() {
  return (
    <footer className="text-ivory" style={{ backgroundColor: "#3E4E68" }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <Image
              src="/images/loggo.png"
              alt="Alison Thomas — Spiritual Medium & Healer"
              width={400}
              height={400}
              className="block h-32 w-32 object-contain"
              style={{
                background: "transparent",
                border: 0,
                padding: 0,
                boxShadow: "none",
                borderRadius: 0,
              }}
            />
            <p className="mt-4 text-ivory/70 text-sm leading-relaxed max-w-xs">
              Evidential mediumship and healing, offered with honesty from the
              Isle of Man to the world.
            </p>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.28em] uppercase text-gold/90">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { href: "#about", label: "About" },
                { href: "#readings", label: "Readings" },
                { href: "#book", label: "Book a Session" },
                { href: "#testimonials", label: "Testimonials" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-turquoise hover:text-gold transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.28em] uppercase text-gold/90">
              Contact
            </p>
            <ul className="mt-4 space-y-3 text-sm text-ivory/80">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-gold shrink-0" />
                <span>Onchan, Isle of Man</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-gold shrink-0" />
                <a
                  href="mailto:hello@alisonthomasmedium.com"
                  className="hover:text-gold transition-colors"
                >
                  hello@alisonthomasmedium.com
                </a>
              </li>
            </ul>
            {(SOCIAL_LINKS.instagram || SOCIAL_LINKS.facebook) && (
              <div className="mt-5 flex gap-3">
                {SOCIAL_LINKS.instagram && (
                  <a
                    href={SOCIAL_LINKS.instagram}
                    aria-label="Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/50 text-gold hover:bg-gold hover:text-navy transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {SOCIAL_LINKS.facebook && (
                  <a
                    href={SOCIAL_LINKS.facebook}
                    aria-label="Facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/50 text-gold hover:bg-gold hover:text-navy transition-colors"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ivory/60">
          <p>
            © {new Date().getFullYear()} Alison Thomas Medium. All rights
            reserved.
          </p>
          <p className="font-serif italic">
            Truth &middot; Evidence &middot; Compassion
          </p>
        </div>
      </div>
    </footer>
  )
}
