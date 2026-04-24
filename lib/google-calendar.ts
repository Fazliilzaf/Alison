/**
 * Google Calendar integration.
 *
 * This module wraps the googleapis client so the rest of the codebase can
 * stay agnostic of how busy/free data is fetched and how bookings are
 * written back.
 *
 * It reads credentials from environment variables — see BOOKING_SETUP.md
 * for how to obtain them.
 */

import { google } from "googleapis"
import type { calendar_v3 } from "googleapis"

export type BusyInterval = { start: Date; end: Date }

export type GoogleStatus =
  | { ready: true }
  | { ready: false; reason: string }

/**
 * Check whether Google Calendar is configured. The rest of the app uses
 * this to decide whether to fall back to "open availability" (useful in
 * dev before setup is complete).
 */
export function googleStatus(): GoogleStatus {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return { ready: false, reason: "GOOGLE_CLIENT_ID not set" }
  }
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    return { ready: false, reason: "GOOGLE_CLIENT_SECRET not set" }
  }
  if (!process.env.GOOGLE_REFRESH_TOKEN) {
    return { ready: false, reason: "GOOGLE_REFRESH_TOKEN not set" }
  }
  return { ready: true }
}

function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Google OAuth credentials missing. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_REFRESH_TOKEN."
    )
  }

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret, redirectUri)
  oauth2.setCredentials({ refresh_token: refreshToken })
  return oauth2
}

function calendarId(): string {
  return process.env.GOOGLE_CALENDAR_ID || "primary"
}

/**
 * Fetch busy intervals from Alison's calendar between timeMin and timeMax.
 * Uses the freebusy endpoint which is cheap and doesn't require reading
 * event details.
 */
export async function getBusyIntervals(
  timeMin: Date,
  timeMax: Date
): Promise<BusyInterval[]> {
  const auth = getOAuth2Client()
  const calendar = google.calendar({ version: "v3", auth })

  const id = calendarId()
  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      items: [{ id }],
    },
  })

  const busy = res.data.calendars?.[id]?.busy ?? []
  return busy
    .filter((b): b is { start: string; end: string } => !!b.start && !!b.end)
    .map((b) => ({ start: new Date(b.start), end: new Date(b.end) }))
}

/**
 * Create a booking event on Alison's calendar and (optionally) send an
 * invite to the customer.
 */
export async function createBookingEvent(params: {
  summary: string
  description: string
  start: Date
  end: Date
  customerEmail: string
  customerName: string
  timeZone: string
  sendInvite?: boolean
}): Promise<calendar_v3.Schema$Event> {
  const auth = getOAuth2Client()
  const calendar = google.calendar({ version: "v3", auth })

  const res = await calendar.events.insert({
    calendarId: calendarId(),
    sendUpdates: params.sendInvite ? "all" : "none",
    requestBody: {
      summary: params.summary,
      description: params.description,
      start: {
        dateTime: params.start.toISOString(),
        timeZone: params.timeZone,
      },
      end: {
        dateTime: params.end.toISOString(),
        timeZone: params.timeZone,
      },
      attendees: params.sendInvite
        ? [
            {
              email: params.customerEmail,
              displayName: params.customerName,
            },
          ]
        : undefined,
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 30 },
        ],
      },
    },
  })

  return res.data
}
