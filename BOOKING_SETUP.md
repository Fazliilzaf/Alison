# Booking calendar — setup guide

This guide connects the website's booking calendar to Alison's Google
Calendar. Once set up, any event on her calendar (holiday, personal
appointment, lunch meeting) automatically blocks that time for new
bookings. When someone books a session, it appears as a new event on
her calendar with the client's details in the description.

The whole process is a one-time setup that takes about 20 minutes.

## What you'll end up with

- A **Google Cloud project** with the Calendar API enabled.
- An **OAuth 2.0 client** that the website uses to authenticate.
- A **refresh token** saved in your `.env.local` — this lets the
  server sign in on Alison's behalf indefinitely (tokens don't expire
  unless she manually revokes access).
- Weekly working hours configured in `lib/availability.ts`.

## 1. Create the Google Cloud project

1. Open <https://console.cloud.google.com/> and sign in as Alison
   (or whoever will own the calendar that bookings are written to).
2. Click the project picker at the top → **New project**. Call it
   something like `alison-booking`. Accept the defaults.
3. In the search bar, type **Google Calendar API** and open it. Click
   **Enable**.

## 2. Configure the OAuth consent screen

1. From the side menu, go to **APIs & Services → OAuth consent screen**.
2. Choose **External**. Click **Create**.
3. Fill in:
   - App name: `Alison Thomas Booking`
   - User support email: `hello@alisonthomasmedium.com`
   - Developer contact: same
4. Click **Save and continue** through the remaining steps.
   - On **Scopes**, add `.../auth/calendar.events` and
     `.../auth/calendar.freebusy`. (These let the app create events
     and check free/busy — nothing more.)
5. On **Test users**, add Alison's Google address. While the app is
   in "Testing" status, only listed users can sign in — that's fine
   because she's the only person who needs to.

## 3. Create the OAuth client

1. From the side menu, **APIs & Services → Credentials → Create
   credentials → OAuth client ID**.
2. Application type: **Web application**.
3. Name: `Alison Thomas Booking — Web`.
4. Authorized redirect URIs — add **both**:
   - `http://localhost:3100/callback` (for the one-time setup script)
   - `https://alisonthomasmedium.com/api/auth/google/callback`
     (only needed if you later add an in-app re-auth flow — harmless
     to register now)
5. Click **Create**. Copy the **Client ID** and **Client secret**.

## 4. Put the credentials in `.env.local`

Copy `.env.example` to `.env.local` in the project root and paste the
values:

```
GOOGLE_CLIENT_ID=<paste the client ID>
GOOGLE_CLIENT_SECRET=<paste the client secret>
GOOGLE_REDIRECT_URI=http://localhost:3100/callback
GOOGLE_REFRESH_TOKEN=        # left blank for now — step 5 fills it in
GOOGLE_CALENDAR_ID=primary
```

Leave `GOOGLE_REFRESH_TOKEN` blank for the moment.

## 5. Run the one-time auth script

```bash
GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... node scripts/get-google-refresh-token.mjs
```

(Or, since `.env.local` already has them, load them first:
`export $(grep -v '^#' .env.local | xargs) && node scripts/get-google-refresh-token.mjs`.)

A browser tab opens. Sign in as Alison and approve the scopes. The
script prints the refresh token to your terminal:

```
GOOGLE_REFRESH_TOKEN=1//0gxxxxxxxxxxxxxxxxxxxxxxx
```

Paste that line into `.env.local`.

## 6. (Optional) Use a dedicated calendar

By default the integration writes to Alison's primary calendar. If she
prefers a separate calendar for bookings:

1. In Google Calendar, create a new calendar called "Bookings".
2. Open its **Settings** → scroll to **Integrate calendar** → copy the
   **Calendar ID** (looks like `abc...@group.calendar.google.com`).
3. Set `GOOGLE_CALENDAR_ID=<that ID>` in `.env.local`.

Make sure the account that authorized the app (step 5) has edit
permission on that calendar.

## 7. Set the weekly working hours

Edit `lib/availability.ts` to match Alison's normal working pattern.
Each day has one or more `windows` — two windows create a lunch break
with no need for a Google Calendar event.

```ts
{
  dayOfWeek: 1, // Monday
  windows: [
    { start: "09:00", end: "13:00" },
    { start: "14:00", end: "17:00" },
  ],
}
```

A day with `windows: []` is closed entirely. Sundays and Saturdays are
closed by default.

There are also three global knobs at the bottom of the file:

- `leadTimeHours` — minimum hours between "now" and the earliest
  bookable slot (default 24).
- `maxDaysAhead` — how far into the future slots show (default 60).
- `slotInterval` — minutes between candidate slot starts (default 30).

## 8. Deploy

1. Commit all changes **except** `.env.local`. (It's already in
   `.gitignore`.)
2. In Vercel (or your host), add the same four env vars:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REFRESH_TOKEN`
   - `GOOGLE_CALENDAR_ID`
   (`GOOGLE_REDIRECT_URI` is only used by the local setup script — not
   needed in production.)
3. Redeploy.

The calendar is now live. Any event Alison creates in her Google
Calendar during working hours blocks that slot from new bookings. New
bookings arrive as events with the client's name in the title and
contact details in the description — with a Google Meet / Zoom link
she can add before the session.

## Day-to-day usage for Alison

- **To block a morning**, afternoon, or whole day: just create a
  regular event in Google Calendar during that time. Anything called
  "Busy", "Holiday", "Personal", whatever — as long as it's marked
  busy (the default), it will block the slot.
- **To change working hours permanently** (e.g. "stop working
  Fridays"): ask the developer to adjust `lib/availability.ts`.
- **To view upcoming bookings**: just open Google Calendar — each
  booking appears there with the client's email, phone and note.
- **To cancel a booking**: delete the event in Google Calendar and
  email the client. (If you want automatic cancellation emails, we
  can add that in a later iteration.)

## Troubleshooting

**The calendar says "No available times in this range."**
- Check that `GOOGLE_REFRESH_TOKEN` is set.
- Check the server logs — if Google Calendar isn't reachable, the
  slot endpoint falls back to unfiltered candidates; if even that is
  empty, the weekly availability config is the most likely cause.

**"invalid_grant" errors after months of working.**
- Refresh tokens can be revoked if:
  - The Google account password was changed.
  - Access was manually revoked at
    <https://myaccount.google.com/permissions>.
  - The OAuth consent screen moved from Testing to Production without
    re-authorizing (shouldn't happen — set to Production early).
- Fix: re-run the setup script (section 5) and paste the new token.

**Timezone looks wrong in the calendar.**
- The app uses `Europe/London` (Isle of Man time). Edit `TIMEZONE` in
  `lib/availability.ts` if she moves.
