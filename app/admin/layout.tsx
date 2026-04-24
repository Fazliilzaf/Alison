import type { ReactNode } from "react"

export const metadata = {
  title: "Admin — Alison Thomas Booking",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-ivory text-charcoal">
      <div className="mx-auto max-w-3xl px-6 py-12">{children}</div>
    </main>
  )
}
