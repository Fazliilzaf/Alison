import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/admin-auth"
import { getSchedule, activeBackend } from "@/lib/availability-store"
import { ScheduleEditor } from "./schedule-editor"

export const dynamic = "force-dynamic"

export default async function AdminHomePage() {
  const authed = await isAuthenticated()
  if (!authed) redirect("/admin/login")

  const schedule = await getSchedule()
  const backend = activeBackend()

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] tracking-[0.28em] uppercase text-gold-dark">
            Admin
          </p>
          <h1 className="mt-3 font-serif text-3xl text-navy">
            Weekly schedule
          </h1>
          <p className="mt-2 text-sm text-charcoal/70 max-w-xl">
            Set the hours you&apos;re normally available. Any event on your
            Google Calendar during these hours still blocks the slot —
            this is just the outer window within which bookings can happen.
          </p>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="text-xs text-charcoal/60 hover:text-navy underline underline-offset-4"
          >
            Sign out
          </button>
        </form>
      </div>

      <div className="mt-8">
        <ScheduleEditor initialSchedule={schedule} backend={backend} />
      </div>
    </div>
  )
}
