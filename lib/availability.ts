/**
 * Alison's availability configuration.
 *
 * This is the single source of truth for WHEN Alison is normally working.
 * Actual busy/free state comes from her Google Calendar — so to block a
 * specific day or time, she just creates an event in her Google Calendar
 * (any event — "Holiday", "Personal", "Lunch meeting", etc.) and it will
 * automatically be removed from the public booking calendar.
 *
 * To change the weekly working hours permanently, edit the `weeklyAvailability`
 * array below and redeploy.
 */

/**
 * Time zone for all calendar operations. Isle of Man uses UK time.
 */
export const TIMEZONE = "Europe/London"

/**
 * Weekly working windows. 0 = Sunday, 1 = Monday, ..., 6 = Saturday.
 * Windows are local-time "HH:MM" strings.
 *
 * Add or remove windows freely — a day with no windows is not bookable.
 * Multiple windows create natural breaks (e.g. lunch) without needing an
 * event in Google Calendar.
 */
export type WeeklyRule = {
  dayOfWeek: number
  windows: Array<{ start: string; end: string }>
}

export const weeklyAvailability: WeeklyRule[] = [
  // Sunday — closed
  { dayOfWeek: 0, windows: [] },
  // Monday
  {
    dayOfWeek: 1,
    windows: [
      { start: "09:00", end: "13:00" },
      { start: "14:00", end: "17:00" },
    ],
  },
  // Tuesday
  {
    dayOfWeek: 2,
    windows: [
      { start: "09:00", end: "13:00" },
      { start: "14:00", end: "17:00" },
    ],
  },
  // Wednesday
  {
    dayOfWeek: 3,
    windows: [
      { start: "09:00", end: "13:00" },
      { start: "14:00", end: "17:00" },
    ],
  },
  // Thursday
  {
    dayOfWeek: 4,
    windows: [
      { start: "09:00", end: "13:00" },
      { start: "14:00", end: "17:00" },
    ],
  },
  // Friday
  {
    dayOfWeek: 5,
    windows: [
      { start: "09:00", end: "13:00" },
      { start: "14:00", end: "17:00" },
    ],
  },
  // Saturday — closed
  { dayOfWeek: 6, windows: [] },
]

/**
 * Global booking rules.
 */
export const bookingWindow = {
  /** Minimum hours between "now" and the earliest bookable slot. */
  leadTimeHours: 24,
  /** How far into the future slots can be booked. */
  maxDaysAhead: 60,
  /** Step size (in minutes) when generating candidate slot starts. */
  slotInterval: 30,
  /** Minutes of buffer to leave between back-to-back sessions. */
  bufferMinutes: 0,
}
