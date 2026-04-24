# Your site launch — what you'll do

Hello Alison — good news: Fazli will handle nearly all the technical work. You only have **one mandatory step**: a **15-minute video call with Fazli** (best case Friday morning, 25 April) so he can connect the booking calendar to your Google account.

That's the only step Google's security rules make impossible to delegate. Everything else — hosting, database, domain changes, deployment — Fazli does on his own.

Target launch day: **Tuesday 29 April**.

---

## What Fazli does (without you)

- Creates the project on GitHub (the code storage)
- Sets up Upstash (the small database for your weekly schedule)
- Sets up Vercel (the service that runs your live website)
- Changes the DNS so `alisonthomasmedium.com` points to the new site
- Deploys, tests, fixes anything that breaks
- Updates the old Squarespace site to the new one

You won't need to log into any of these services. Fazli may later offer to transfer ownership to you so nothing is tied to him long-term — that's a 10-minute click session for a different day.

---

## What you do

### Part 1 — Book a 15-minute call with Fazli (today)

Message him and choose any slot **Thursday evening or Friday 08:00–11:00 (UK time)**. It has to be a video call — Zoom, FaceTime, Google Meet, anything that lets you share your screen.

Put it in the calendar. Set a 10-minute reminder.

### Part 2 — The Google Cloud session (15 minutes, the only step)

During the call, do this at your laptop (not your phone):

**Before the call — 2 minutes prep:**

1. Make sure you're **signed in to Gmail as `alithomasmedium@gmail.com`** in Safari or Chrome. If another Google account is active, sign out first. This is the single most important thing to get right — the call fails if the wrong account is used.
2. Have your phone ready for any two-factor codes Google sends.

**On the call — Fazli guides you:**

3. You share your screen.
4. You open a page he tells you (`console.cloud.google.com`). You check the top-right corner says `alithomasmedium@gmail.com`.
5. Fazli walks you through clicking through a few Google pages. He'll say "click the blue button", "agree to the terms", "accept the permission prompt". Everything is clicking what he tells you — no typing except your Gmail password once or twice.
6. Near the end, a browser window opens asking "do you want this app to access your Google Calendar?". Click **Allow**.
7. Fazli copies a code from his screen. Done.

Nothing on your calendar changes. Nothing gets published. The site just gets permission to read free/busy times and add new bookings.

**If Fazli gets stuck on a step, don't click randomly — pause and wait for him to say what to do.**

---

## Part 3 — After launch (Sunday 27 April or Monday 28 April)

Fazli will send you two things once the site is live:

- A link to your new admin page: `https://alisonthomasmedium.com/admin/login`
- Your **admin password** (write it down in the notebook or Apple Notes — treat it like your email password)

**Test it yourself — 5 minutes:**

1. Open <https://alisonthomasmedium.com> in a browser you've never used for this before (or an incognito window). Click through the site. Try to book yourself into a slot tomorrow afternoon using a different email than your Gmail. You should receive a confirmation email and see the event in your Google Calendar.

2. Open <https://alisonthomasmedium.com/admin/login>, sign in with your admin password. You'll land on a page that shows your weekly schedule. Change one slot (e.g. mark Wednesday 15:00–17:00 unavailable) → click **Save**. Refresh the public site's booking section in a different tab and check the Wednesday afternoon slots are now blocked.

If either step doesn't work, text Fazli a screenshot — don't panic-click in the admin.

---

## What you can change yourself — now vs later

**Right now, from `/admin`:**

- Which weekly hours are bookable (Mon–Fri, specific time windows)
- Days off and holidays (just create a regular event in your Google Calendar — it blocks automatically)
- See all upcoming bookings

**Not yet — ask Fazli until further notice:**

- Prices, service names, service descriptions
- Testimonials
- The "about me" text or hero wording
- Contact details, social media links

After launch, Fazli will build an extended admin so you can edit all of the above yourself. Plan is to have that ready in the first weeks of May. Until then, text him a sentence like "please change the Rune Reading price from £45 to £50" — it's a 5-minute fix for him.

---

## If something goes wrong

**Can't get into `/admin`** → use the password Fazli sent you. If that doesn't work, he can reset it in under a minute.

**Booking calendar is empty on the live site** → either your working hours aren't set yet (log into admin and set Mon–Fri 09:00–17:00 as a baseline), or Google Calendar isn't connected yet (text Fazli).

**A test booking didn't show up in your Google Calendar** → Fazli can check the logs in under a minute. Don't try to fix it yourself.

**Anything else** → text a screenshot. Fazli will reply within the day.

---

## Glossary (if a word confuses you)

- **Repository / repo:** the folder on GitHub where the site's code lives (you'll never see it)
- **Deploy:** putting a new version of the site online
- **DNS:** the "phone book" of the internet — maps `alisonthomasmedium.com` to a specific server
- **OAuth:** the "Allow this app to access my Google Calendar" permission we set up in Part 2
- **Admin:** your private control panel at `/admin/login`

---

## Timeline

Your existing Squarespace site stays live at `alisonthomasmedium.com` until launch day. The new site is tested on a temporary URL first — that way we have an instant rollback if anything goes wrong.

| Day | What happens |
|---|---|
| Thu 24/4 | Fazli sets up GitHub, Upstash, Vercel. New site goes live on a temporary URL like `alisonthomasmedium-xyz.vercel.app`. Your real domain still shows the old Squarespace site. |
| Fri 25/4 morning | **You + Fazli — 15 min video call** for Google Cloud (Part 2 above). Right after, the booking calendar comes alive on the temporary URL. |
| Sat 26/4 – Sun 27/4 | **You test the new site using the temporary URL** — book yourself an appointment, try the admin page, change your schedule. Nothing you do here is public yet. Fazli fixes anything you flag. |
| Mon 28/4 | Final checks. Fazli pauses the old Acuity booking in Squarespace so future bookings only land on the new site. |
| Tue 29/4 | **Launch day.** Fazli switches DNS so `alisonthomasmedium.com` points to the new site. Within 15–30 min the new site is live on your real domain. Share the URL, post on social media, update business cards. |

**Rollback plan:** if something breaks right after launch, Fazli reverts the DNS in 5 minutes and your old Squarespace site is back. Nothing is deleted — both sites coexist until we're certain the new one is stable.

If you can't do the 15-minute call Friday morning, text Fazli today so he can move the timeline without losing the 29 April target.
