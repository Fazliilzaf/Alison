/**
 * Slot generation and filtering.
 *
 * Reads the currently active weekly schedule from availability-store
 * (admin UI can override the defaults in lib/availability.ts) and
 * combines it with Google Calendar busy data to produce the public
 * list of available slots.
 */

import { getSchedule } from "./availability-store"
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
 * booking window, respecting the weekly schedule and lead time.
 */
export async function generateCandidateSlots(
  durationMinutes: number
): Promise<Slot[]> {
  const schedule = await getSchedule()
  const slots: Slot[] = []
  const now = new Date()
  const earliestStart = new Date(
    now.getTime() + schedule.leadTimeHours * 3600 * 1000
  )

  const cursor = new Date(now)
  cursor.setHours(0, 0, 0, 0)

  for (let i = 0; i <= schedule.maxDaysAhead; i++) {
    const day = new Date(cursor)
    day.setDate(cursor.getDate() + i)
    const dow = day.getDay()
    const rule = schedule.weekly.find((r) => r.dayOfWeek === dow)
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
          slotStart.getTime() + schedule.slotInterval * 60 * 1000
        )
      }
    }
  }

  return slots
}

/**
 * Remove slots that overlap with any busy interval.
 */
export function filterOutBusy(
  slots: Slot[],
  busy: BusyInterval[]
): Slot[] {
  if (busy.length === 0) return slots
  return slots.filter((slot) => !busy.some((b) => overlaps(slot, b)))
}

/**
 * Server-side re-check before writing a booking: validates that the
 * requested slot matches a current candidate AND isn't now busy.
 */
export async function isSlotBookable(
  candidate: Slot,
  durationMinutes: number,
  busy: BusyInterval[]
): Promise<boolean> {
  const expectedMs = durationMinutes * 60 * 1000
  if (candidate.end.getTime() - candidate.start.getTime() !== expectedMs) {
    return false
  }
  const all = await generateCandidateSlots(durationMinutes)
  const matches = all.some(
    (s) =>
      s.start.getTime() === candidate.start.getTime() &&
      s.end.getTime() === candidate.end.getTime()
  )
  if (!matches) return false
  return filterOutBusy([candidate], busy).length === 1
}
