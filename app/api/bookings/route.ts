import { NextResponse } from "next/server"
import { z } from "zod"
import { getService } from "@/lib/services"
import { isSlotBookable } from "@/lib/slots"
import { TIMEZONE } from "@/lib/availability"
import {
  createBookingEvent,
  getBusyIntervals,
  getMeetLink,
  googleStatus,
} from "@/lib/google-calendar"

export const dynamic = "force-dynamic"

const BookingSchema = z.object({
  serviceId: z.string().min(1),
  start: z.string().datetime(),
  end: z.string().datetime(),
  name: z.string().trim().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(40).optional().or(z.literal("")),
  note: z.string().max(2000).optional().or(z.literal("")),
})

/**
 * POST /api/bookings
 *
 * Creates a booking on Alison's Google Calendar after re-verifying that
 * the requested slot is still free. Returns 409 if the slot has been
 * taken since the client loaded it.
 *
 * If Google Calendar isn't configured yet, returns a preview response
 * without actually writing anywhere — useful during setup.
 */
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = BookingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    )
  }
  const { serviceId, start, end, name, email, phone, note } = parsed.data

  const service = getService(serviceId)
  if (!service || service.emailOnly || !service.duration) {
    return NextResponse.json({ error: "Invalid service" }, { status: 400 })
  }

  const startDate = new Date(start)
  const endDate = new Date(end)

  const status = googleStatus()

  if (!status.ready) {
    console.warn(
      `[api/bookings] Google not configured (${status.reason}). ` +
        `Returning preview response — no calendar event was written.`
    )
    // Allow UI testing to continue in development.
    return NextResponse.json({
      ok: true,
      preview: true,
      message:
        "Booking captured in preview mode. Connect Google Calendar to write real events.",
    })
  }

  try {
    const busy = await getBusyIntervals(startDate, endDate)

    if (
      !(await isSlotBookable(
        { start: startDate, end: endDate },
        service.duration,
        busy
      ))
    ) {
      return NextResponse.json(
        { error: "This slot is no longer available." },
        { status: 409 }
      )
    }

    const descriptionLines = [
      `${service.title} — ${service.duration} min — ${service.currency}${service.price}`,
      ``,
      `Client: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      ``,
      note ? `Note from client:\n${note}` : null,
    ].filter(Boolean) as string[]

    const event = await createBookingEvent({
      summary: `${service.title} — ${name}`,
      description: descriptionLines.join("\n"),
      start: startDate,
      end: endDate,
      customerEmail: email,
      customerName: name,
      timeZone: TIMEZONE,
      sendInvite: true,
    })

    return NextResponse.json({
      ok: true,
      eventId: event.id,
      htmlLink: event.htmlLink,
      meetLink: getMeetLink(event),
    })
  } catch (error) {
    console.error("[api/bookings] failed", error)
    return NextResponse.json(
      {
        error: "Could not create booking",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
