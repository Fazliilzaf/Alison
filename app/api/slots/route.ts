import { NextResponse } from "next/server"
import { getService } from "@/lib/services"
import { generateCandidateSlots, filterOutBusy } from "@/lib/slots"
import {
  getBusyIntervals,
  googleStatus,
  type BusyInterval,
} from "@/lib/google-calendar"

export const dynamic = "force-dynamic"
export const revalidate = 0

/**
 * GET /api/slots?serviceId=<id>
 *
 * Returns the available slots for the given service by combining:
 *   1. The weekly availability config (see lib/availability.ts)
 *   2. Alison's busy intervals fetched from Google Calendar
 *
 * If Google Calendar isn't configured yet, returns unfiltered candidate
 * slots so the UI still works in development.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const serviceId = searchParams.get("serviceId")

  if (!serviceId) {
    return NextResponse.json(
      { error: "Missing serviceId query parameter" },
      { status: 400 }
    )
  }

  const service = getService(serviceId)
  if (!service) {
    return NextResponse.json({ error: "Unknown service" }, { status: 404 })
  }
  if (service.emailOnly || !service.duration) {
    // Email readings have no calendar slots.
    return NextResponse.json({ slots: [], emailOnly: true })
  }

  try {
    const candidates = generateCandidateSlots(service.duration)
    if (candidates.length === 0) {
      return NextResponse.json({ slots: [] })
    }

    const status = googleStatus()
    let busy: BusyInterval[] = []
    let googleConnected = false

    if (status.ready) {
      const timeMin = candidates[0].start
      const timeMax = candidates[candidates.length - 1].end
      busy = await getBusyIntervals(timeMin, timeMax)
      googleConnected = true
    } else {
      console.warn(
        `[api/slots] Google Calendar not configured (${status.reason}). ` +
          `Returning unfiltered availability.`
      )
    }

    const available = filterOutBusy(candidates, busy)

    return NextResponse.json({
      slots: available.map((s) => ({
        start: s.start.toISOString(),
        end: s.end.toISOString(),
      })),
      googleConnected,
    })
  } catch (error) {
    console.error("[api/slots] failed", error)
    return NextResponse.json(
      {
        error: "Could not fetch availability",
        detail:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
