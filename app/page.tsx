import { SiteNav } from "@/components/site/site-nav"
import { Hero } from "@/components/site/hero"
import { TrustStrip } from "@/components/site/trust-strip"
import { About } from "@/components/site/about"
import { Services } from "@/components/site/services"
import { Booking } from "@/components/site/booking"
import { Testimonials } from "@/components/site/testimonials"
import { SiteFooter } from "@/components/site/site-footer"

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <SiteNav />
      <Hero />
      <TrustStrip />
      <About />
      <Services />
      <Booking />
      <Testimonials />
      <SiteFooter />
    </main>
  )
}
