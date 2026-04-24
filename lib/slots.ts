/**
 * Slot generation and filtering.
 *
 * Given a service duration and Alison's weekly availability config, produce
 * a list of candidate slots. Given busy intervals from Google Calendar,
 * filter them down to only the truly available ones.
 */

import { weeklyAvailability, bookingWindow } from "./availability"
import type { BusyInterval } from "./google-calendar"

export type Slot = { start: Date; end: Date }

function parseHHMM(s: string): { h: number; m: number } {
  const [h, m] = s.split(":").map(Number)
  return { h, m }
}

function overlaps(a: Slot, b: { start: Date; end: Date }): boolean {
  return a.start < b.end && b.start < a.end
}

/**
 * Generate all candidate slots for a given service duration across the
 * booking window, respecting the weekly availability config and lead time.
 *
 * All dates are returned in the server's local time — the calling code
 * is responsible for serializing them as ISO strings with the appropriate
 * time zone.
 */
export function generateCandidateSlots(durationMinutes: number): Slot[] {
  const slots: Slot[] = []
  const now = new Date()
  const earliestStart = new Date(
    now.getTime() + bookingWindow.leadTimeHours * 3600 * 1000
  )

  const cursor = new Date(now)
  cursor.setHours(0, 0, 0, 0)

  for (let i = 0; i <= bookingWindow.maxDaysAhead; i++) {
    const day = new Date(cursor)
    day.setDate(cursor.getDate() + i)
    const dow = day.getDay()
    const rule = weeklyAvailability.find((r) => r.dayOfWeek === dow)
    if (!rule || rule.windows.length === 0) continue

    for (const window of rule.windows) {
      const { h: sh, m: sm } = parseHHMM(window.start)
      const { h: eh, m: em } = parseHHMM(window.end)
      const windowStart = new Date(day)
      windowStart.setHours(sh, sm, 0, 0)
      const windowEnd = new Date(day)
      windowEnd.setHours(eh, em, 0, 0)

      let slotStart = new Date(windowStart)
      while (true) {
        const slotEnd = new Date(
          slotStart.getTime() + durationMinutes * 60 * 1000
        )
        if (slotEnd > windowEnd) break
        if (slotStart >= earliestStart) {
          slots.push({ start: new Date(slotStart), end: new Date(slotEnd) })
        }
        slotStart = new Date(
          slotStart.getTime() + bookingWindow.slotInterval * 60 * 1000
        )
      }
    }
  }

  return slots
}

/**
 * Remove slots that overlap with any busy interval (applying optional
 * buffer on both sides).
 */
export function filterOutBusy(
  slots: Slot[],
  busy: BusyInterval[],
  bufferMinutes = bookingWindow.bufferMinutes
): Slot[] {
  if (busy.length === 0) return slots
  const buffered = busy.map((b) => ({
    start: new Date(b.start.getTime() - bufferMinutes * 60 * 1000),
    end: new Date(b.end.getTime() + bufferMinutes * 60 * 1000),
  }))
  return slots.filter((slot) => !buffered.some((b) => overlaps(slot, b)))
}

/**
 * Check whether a specific slot matches a valid candidate AND isn't busy.
 * Used server-side before creating a booking to prevent race conditions.
 */
export function isSlotBookable(
  candidate: Slot,
  durationMinutes: number,
  busy: BusyInterval[]
): boolean {
  const expectedMs = durationMinutes * 60 * 1000
  if (candidate.end.getTime() - candidate.start.getTime() !== expectedMs) {
    return false
  }
  const all = generateCandidateSlots(durationMinutes)
  const matches = all.some(
    (s) =>
      s.start.getTime() === candidate.start.getTime() &&
      s.end.getTime() === candidate.end.getTime()
  )
  if (!matches) return false
  return filterOutBusy([candidate], busy).length === 1
}
