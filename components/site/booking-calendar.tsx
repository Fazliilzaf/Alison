"use client"

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import FullCalendar from "@fullcalendar/react"
import type { EventClickArg, EventInput } from "@fullcalendar/core"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import interactionPlugin from "@fullcalendar/interaction"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { services, type Service } from "@/lib/services"

type ApiSlot = { start: string; end: string }

export function BookingCalendar() {
  const [selected, setSelected] = useState<Service>(services[0])
  const [modalOpen, setModalOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [pendingSlot, setPendingSlot] = useState<{
    start: Date
    end: Date
  } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [slots, setSlots] = useState<ApiSlot[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", phone: "", note: "" })
  const calendarRef = useRef<FullCalendar>(null)

  const fetchSlots = useCallback(
    async (serviceId: string) => {
      if (!services.find((s) => s.id === serviceId)?.duration) {
        setSlots([])
        return
      }
      setLoading(true)
      setLoadError(null)
      try {
        const res = await fetch(`/api/slots?serviceId=${serviceId}`, {
          cache: "no-store",
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        setSlots(json.slots ?? [])
      } catch (err) {
        console.error(err)
        setLoadError(
          "Could not load availability. Please try again in a moment."
        )
        setSlots([])
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    if (!selected.emailOnly) {
      fetchSlots(selected.id)
    }
  }, [selected, fetchSlots])

  const events = useMemo<EventInput[]>(() => {
    if (selected.emailOnly) return []
    return slots.map((s) => ({
      start: s.start,
      end: s.end,
      display: "background",
      classNames: ["slot-available"],
    }))
  }, [slots, selected])

  function handleEventClick(arg: EventClickArg) {
    arg.jsEvent.preventDefault()
    if (arg.event.start && arg.event.end) {
      setPendingSlot({ start: arg.event.start, end: arg.event.end })
      setModalOpen(true)
    }
  }

  function handleDateClick(info: { date: Date }) {
    if (!selected.duration) return
    // Find the nearest available slot at or after the clicked time.
    const match = slots.find((s) => {
      const start = new Date(s.start)
      return start.getTime() === info.date.getTime()
    })
    if (!match) return
    setPendingSlot({ start: new Date(match.start), end: new Date(match.end) })
    setModalOpen(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!pendingSlot) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selected.id,
          start: pendingSlot.start.toISOString(),
          end: pendingSlot.end.toISOString(),
          name: form.name,
          email: form.email,
          phone: form.phone,
          note: form.note,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setSubmitError(
          (data && data.error) ||
            "Sorry — we couldn't confirm your booking. Please try again."
        )
        return
      }
      setModalOpen(false)
      setSuccessOpen(true)
      setForm({ name: "", email: "", phone: "", note: "" })
      fetchSlots(selected.id) // refresh to hide the just-booked slot
    } catch (err) {
      console.error(err)
      setSubmitError(
        "Network error. Please check your connection and try again."
      )
    } finally {
      setSubmitting(false)
    }
  }

  const formattedSlot = pendingSlot
    ? `${new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(pendingSlot.start)} · ${new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(pendingSlot.start)}–${new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(pendingSlot.end)}`
    : ""

  return (
    <div className="mx-auto mt-14 max-w-4xl text-left">
      <div aria-hidden className="h-px w-16 mx-auto bg-gold/40" />

      {/* Service selector */}
      <div className="mt-10">
        <p className="text-center text-[11px] tracking-[0.24em] uppercase text-gold/80">
          Step 1 — Choose a session
        </p>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((s) => {
            const isActive = selected.id === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelected(s)}
                className={cn(
                  "group flex flex-col items-start rounded-sm border px-4 py-3 text-left transition-all",
                  isActive
                    ? "border-gold bg-navy/60 shadow-inner"
                    : "border-gold/30 bg-navy/20 hover:border-gold/70 hover:bg-navy/40"
                )}
                aria-pressed={isActive}
              >
                <span
                  className={cn(
                    "font-serif text-base leading-tight",
                    isActive ? "text-gold" : "text-ivory"
                  )}
                >
                  {s.title}
                </span>
                <span className="mt-1 text-[11px] uppercase tracking-[0.18em] text-ivory/60">
                  {s.duration ? `${s.duration} min` : s.delivery} · {s.currency}
                  {s.price}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Calendar or email CTA */}
      <div className="mt-10">
        {selected.emailOnly ? (
          <div className="text-center py-10">
            <p className="font-serif text-2xl text-ivory">
              No time slot needed.
            </p>
            <p className="mx-auto mt-3 max-w-md text-ivory/70 text-sm leading-relaxed">
              Email readings are delivered within 24–48 hours. Write to me with
              your question — I&apos;ll confirm receipt and return your reading
              in writing.
            </p>
            <a
              href={`mailto:hello@alisonthomasmedium.com?subject=${encodeURIComponent(
                "Booking Request — Email Tarot or Rune Reading"
              )}`}
              className="mt-8 inline-flex items-center justify-center rounded-full border border-gold/60 bg-transparent px-7 py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold hover:text-navy"
            >
              Request by email — £29
            </a>
          </div>
        ) : (
          <div className="booking-calendar-surface">
            {loadError ? (
              <p className="text-center text-burgundy/90 text-sm py-6">
                {loadError}
              </p>
            ) : null}
            {loading && slots.length === 0 ? (
              <p className="text-center text-ivory/60 text-sm py-6">
                Loading available times…
              </p>
            ) : null}
            <FullCalendar
              ref={calendarRef}
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                listPlugin,
                interactionPlugin,
              ]}
              initialView="timeGridWeek"
              firstDay={1}
              locale="en-gb"
              timeZone="local"
              allDaySlot={false}
              nowIndicator
              slotMinTime="09:00:00"
              slotMaxTime="17:00:00"
              slotDuration="00:30:00"
              slotLabelInterval="01:00"
              height="auto"
              expandRows
              dayHeaderFormat={{ weekday: "short", day: "numeric" }}
              businessHours={{
                daysOfWeek: [1, 2, 3, 4, 5],
                startTime: "09:00",
                endTime: "17:00",
              }}
              headerToolbar={{
                left: "prev,next",
                center: "title",
                right: "today",
              }}
              footerToolbar={{
                center: "timeGridWeek,dayGridMonth,listWeek",
              }}
              buttonText={{
                today: "Today",
                month: "Month",
                week: "Week",
                day: "Day",
                list: "List",
              }}
              events={events}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }}
              slotLabelFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }}
              selectable={false}
              noEventsText="No available times in this range — try another week."
            />
          </div>
        )}
      </div>

      {/* Booking modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md bg-ivory border border-gold/40">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-navy">
              Confirm your booking
            </DialogTitle>
            <DialogDescription className="text-charcoal/70">
              <span className="font-medium text-navy">{selected.title}</span>
              <span className="block mt-1 text-charcoal/80">
                {formattedSlot} · {selected.currency}
                {selected.price}
              </span>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-2 grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="name" className="text-charcoal">
                Full name
              </Label>
              <Input
                id="name"
                required
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email" className="text-charcoal">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="phone" className="text-charcoal">
                Phone <span className="text-charcoal/50">(optional)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="note" className="text-charcoal">
                Anything you&apos;d like to share?{" "}
                <span className="text-charcoal/50">(optional)</span>
              </Label>
              <Textarea
                id="note"
                rows={3}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>
            {submitError ? (
              <p className="text-sm text-burgundy">{submitError}</p>
            ) : null}
            <div className="mt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setModalOpen(false)}
                className="text-charcoal/70 hover:text-navy"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-navy text-ivory hover:bg-navy-dark rounded-full px-6"
              >
                {submitting
                  ? "Booking…"
                  : `Confirm — ${selected.currency}${selected.price}`}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success modal */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-md bg-ivory border border-gold/40 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage/20 text-sage">
            <Check className="h-6 w-6" />
          </div>
          <DialogHeader>
            <DialogTitle className="mt-4 font-serif text-2xl text-navy text-center">
              You&apos;re booked in.
            </DialogTitle>
            <DialogDescription className="text-charcoal/70 text-center">
              A confirmation email is on its way with your Zoom link and any
              preparation notes. Reply to it if you need to change the time.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setSuccessOpen(false)}
            className="mt-4 mx-auto bg-navy text-ivory hover:bg-navy-dark rounded-full px-6"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>

      {/* Discreet, brand-matched calendar styling */}
      <style jsx global>{`
        .booking-calendar-surface {
          --fc-border-color: rgba(217, 199, 142, 0.22);
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: transparent;
          --fc-today-bg-color: rgba(217, 199, 142, 0.06);
          --fc-button-bg-color: transparent;
          --fc-button-border-color: transparent;
          --fc-button-hover-bg-color: transparent;
          --fc-button-hover-border-color: transparent;
          --fc-button-active-bg-color: transparent;
          --fc-button-active-border-color: transparent;
          --fc-button-text-color: rgba(255, 253, 248, 0.75);
          --fc-event-bg-color: rgba(217, 199, 142, 0.18);
          --fc-event-border-color: rgba(217, 199, 142, 0.5);
          --fc-event-text-color: #fffdf8;
          --fc-now-indicator-color: rgba(168, 106, 114, 0.7);
          --fc-list-event-hover-bg-color: rgba(217, 199, 142, 0.08);
          font-family: var(--font-lato), sans-serif;
          color: rgba(255, 253, 248, 0.85);
        }
        .booking-calendar-surface .fc-theme-standard td,
        .booking-calendar-surface .fc-theme-standard th,
        .booking-calendar-surface .fc-theme-standard .fc-scrollgrid {
          border-color: rgba(217, 199, 142, 0.15);
        }
        .booking-calendar-surface .fc-scrollgrid { border: none; }
        .booking-calendar-surface .fc-scrollgrid-section > * {
          border-left: none; border-right: none;
        }
        .booking-calendar-surface .fc-toolbar-title {
          font-family: var(--font-cormorant), 'Cormorant Garamond', serif;
          font-weight: 400;
          font-size: 1.5rem;
          color: #fffdf8;
          letter-spacing: 0;
        }
        .booking-calendar-surface .fc-button {
          background: transparent !important;
          border: 1px solid rgba(217, 199, 142, 0.25) !important;
          color: rgba(255, 253, 248, 0.75) !important;
          text-transform: capitalize;
          font-size: 0.78rem;
          letter-spacing: 0.06em;
          border-radius: 999px;
          padding: 0.35rem 0.85rem;
          box-shadow: none !important;
          font-weight: 400;
        }
        .booking-calendar-surface .fc-button:hover {
          background: rgba(217, 199, 142, 0.08) !important;
          border-color: rgba(217, 199, 142, 0.55) !important;
          color: #d9c78e !important;
        }
        .booking-calendar-surface .fc-button-primary:not(:disabled).fc-button-active,
        .booking-calendar-surface .fc-button-primary:not(:disabled):active {
          background: rgba(217, 199, 142, 0.15) !important;
          border-color: rgba(217, 199, 142, 0.6) !important;
          color: #d9c78e !important;
        }
        .booking-calendar-surface .fc-button-primary:focus,
        .booking-calendar-surface .fc-button:focus-visible {
          box-shadow: 0 0 0 2px rgba(217, 199, 142, 0.25) !important;
          outline: none;
        }
        .booking-calendar-surface .fc-toolbar { margin-bottom: 1rem; }
        .booking-calendar-surface .fc-toolbar.fc-footer-toolbar {
          margin-top: 1rem; justify-content: center;
        }
        .booking-calendar-surface .fc-col-header-cell-cushion,
        .booking-calendar-surface .fc-list-day-cushion,
        .booking-calendar-surface .fc-list-day-text,
        .booking-calendar-surface .fc-list-day-side-text {
          color: rgba(217, 199, 142, 0.85);
          text-decoration: none;
          font-weight: 400;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 0.6rem 0.4rem;
        }
        .booking-calendar-surface .fc-list-day-cushion {
          background: transparent !important;
        }
        .booking-calendar-surface .fc-timegrid-slot-label,
        .booking-calendar-surface .fc-timegrid-axis-cushion {
          color: rgba(255, 253, 248, 0.4);
          font-size: 0.7rem;
          font-weight: 300;
        }
        .booking-calendar-surface .fc-event.slot-available {
          background: rgba(217, 199, 142, 0.12) !important;
          border: none !important;
          box-shadow: inset 0 0 0 1px rgba(217, 199, 142, 0.35);
          cursor: pointer;
          transition: background 0.15s, box-shadow 0.15s;
        }
        .booking-calendar-surface .fc-event.slot-available:hover {
          background: rgba(217, 199, 142, 0.22) !important;
          box-shadow: inset 0 0 0 1px rgba(217, 199, 142, 0.7);
        }
        .booking-calendar-surface .fc-daygrid-day.fc-day-today,
        .booking-calendar-surface .fc-timegrid-col.fc-day-today {
          background: rgba(217, 199, 142, 0.05);
        }
        .booking-calendar-surface .fc-daygrid-day-number {
          color: rgba(255, 253, 248, 0.65);
          font-size: 0.78rem;
          padding: 0.4rem 0.5rem;
        }
        .booking-calendar-surface .fc-list { border: none; }
        .booking-calendar-surface .fc-list-event { background: transparent !important; }
        .booking-calendar-surface .fc-list-event td {
          border-color: rgba(217, 199, 142, 0.15);
          color: rgba(255, 253, 248, 0.8);
        }
        .booking-calendar-surface .fc-list-event-dot {
          border-color: rgba(217, 199, 142, 0.7);
        }
        .booking-calendar-surface .fc-list-empty {
          background: transparent;
          color: rgba(255, 253, 248, 0.55);
          font-style: italic;
        }
        .booking-calendar-surface .fc-bg-event .fc-event-title { display: none; }
      `}</style>
    </div>
  )
}
