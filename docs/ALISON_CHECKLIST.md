# Your site launch — step by step

Hello Alison — this is your personal checklist for getting **alisonthomasmedium.com** live. Total hands-on time is about **1 hour**, split into small steps over 1–2 days. Fazli handles the technical parts; your job is to create a few accounts and do one session with Google.

Read through this whole page first. Then come back to the top and start with Part 1.

---

## What you need before you begin

- **A laptop** (not a phone — a couple of steps don't work on mobile).
- **Your Gmail account:** `alithomasmedium@gmail.com`, and the password for it.
- **Your phone**, for two-factor codes Google will send you.
- **Your Squarespace login**, where `alisonthomasmedium.com` is registered.
- A **notebook** or the Apple Notes app — you'll write down 2 passwords and 2 codes as you go.

If you don't have your Squarespace password to hand, reset it now so you don't lose time later.

---

## Who does what

**You do (in this order):**
1. Create a GitHub account
2. Google Cloud + Calendar session (Fazli will sit with you or guide you on a call — 20 min)
3. Create an Upstash account (3 min)
4. Create a Vercel account (5 min)
5. Change your domain's DNS in Squarespace (5 min of clicking + 15 min waiting)
6. Log in to your new admin page and check everything works

**Fazli does (in between your steps):**
- Uploads the website code to GitHub
- Sets up the server on Vercel
- Connects all the keys and secrets
- Fixes anything that breaks

You will never need to look at code or the terminal.

---

## Part 1 — Create a GitHub account (5 minutes)

GitHub is where the website's code lives. Even though you won't touch the code, the account needs to be in your name so you own it.

1. Open <https://github.com/signup>
2. Email: use `alithomasmedium@gmail.com`
3. Create a password — **write it down in your notebook**
4. Pick a username — something like `alisonthomas` or `alisonthomasmedium` is perfect
5. Verify your email (GitHub will send a code to Gmail — paste it in)
6. Choose the **Free** plan when asked
7. Skip the "what do you want to do" questions — just click "Skip" / "Continue"

When you see a page that says "Welcome to GitHub" with a big green button — you're done.

**Then: send Fazli your GitHub username.** He'll invite you to the code repository, and you'll get an email. Click **Accept invitation** in that email.

---

## Part 2 — Google Cloud + Calendar setup (25–30 minutes) ⚠️ most important step

This step connects your booking calendar to your actual Google Calendar. Every event you add to your calendar (holiday, dentist, lunch) will automatically block that time from being booked. Every booking a client makes will show up as an event in your calendar with a Zoom link.

> **Do this step while Fazli is on a call or video chat with you.** It's not hard, but it's easy to click the wrong button. Having him watching means if you get lost, he can say "click that one, not that one."

The full walkthrough is in the file `BOOKING_SETUP.md` in the project (Fazli can share his screen on the file). Summary of what will happen:

1. You open <https://console.cloud.google.com/> — make sure the top-right corner says `alithomasmedium@gmail.com`. **If it shows a different Google account, log out and back in.** This is the one step where the wrong account causes real problems.
2. You create a new "project" called `alison-booking`
3. You enable something called "Google Calendar API" (one click)
4. You create "OAuth credentials" — basically, permission for the website to read your calendar on your behalf
5. Fazli runs a small script on his computer that opens a browser window → you click **Allow** in that browser window → Google gives Fazli a long string called a "refresh token"
6. Fazli saves the token somewhere safe

Nothing on your calendar changes. Nothing becomes public. The site can just *look* at your calendar availability and *add* new bookings.

**At the end, keep these three things written down somewhere safe:**

- Google Cloud **Client ID** (long string, looks like `123...abc.apps.googleusercontent.com`)
- Google Cloud **Client Secret** (another long string)
- Google **Refresh Token** (starts with `1//`)

You'll need them in Part 4. Treat them like passwords — don't email them in plain text.

---

## Part 3 — Create an Upstash account (3 minutes)

Upstash is a free database. The website uses it to remember your weekly schedule (which you'll edit from the admin page). Without this, the schedule would reset every time the site restarts.

1. Open <https://upstash.com>
2. Click **Sign up** → **Continue with GitHub** → it will ask permission → click **Authorize**
3. Once you're in, click **Create Database**
4. Name: `alison-admin`
5. Type: **Redis**
6. Region: **eu-west-1** (London — closest to the Isle of Man)
7. Click **Create**
8. On the database page, scroll down to the section called **REST API**
9. You'll see two rows: **UPSTASH_REDIS_REST_URL** and **UPSTASH_REDIS_REST_TOKEN** — click the small "copy" icon next to each and paste them into your notebook

That's it. You won't ever need to open Upstash again.

---

## Part 4 — Create a Vercel account and set up the website (10 minutes)

Vercel is the company that runs your live website. It's free for a site your size, forever.

1. Open <https://vercel.com/signup>
2. Click **Continue with GitHub** → authorise it
3. When asked about a plan, choose **Hobby** (free)
4. Once logged in, click **Add New → Project** (top right)
5. Find the repository Fazli invited you to — usually called something like `alisonthomasmedium` — and click **Import**

Now you'll see a setup page. The only thing to change is **Environment Variables**:

6. Click **Environment Variables** to expand that section
7. Add these one at a time — click **Add Another** after each. **Names must be exact** (copy-paste from here):

    | Name | What to paste |
    |---|---|
    | `GOOGLE_CLIENT_ID` | from Part 2 |
    | `GOOGLE_CLIENT_SECRET` | from Part 2 |
    | `GOOGLE_REFRESH_TOKEN` | from Part 2 |
    | `GOOGLE_CALENDAR_ID` | just type the word `primary` |
    | `ADMIN_PASSWORD` | pick a strong password — write it down, this is how you'll log in to /admin |
    | `ADMIN_SESSION_SECRET` | type 30+ random characters (just mash the keyboard) |
    | `UPSTASH_REDIS_REST_URL` | from Part 3 |
    | `UPSTASH_REDIS_REST_TOKEN` | from Part 3 |

8. Click **Deploy** at the bottom

The site will build for about 2 minutes. You'll see a preview URL like `alisonthomasmedium-xyz.vercel.app` — click it.

**At this point your site is LIVE on a temporary address. Click around — the booking calendar should show real times. Try a test booking on yourself to confirm it shows up in your Google Calendar.**

---

## Part 5 — Change your domain's DNS (10 minutes + waiting)

Right now your domain `alisonthomasmedium.com` points somewhere else (probably a Squarespace page). Let's change that to point to your new site on Vercel.

### 5a. In Vercel — get the DNS info

1. In Vercel, open your project → **Settings** (top bar) → **Domains** (left sidebar)
2. In the text box, type `alisonthomasmedium.com` → click **Add**
3. Vercel will show a box saying "Invalid Configuration" and give you the DNS records you need. **Keep this tab open.**
4. Also add `www.alisonthomasmedium.com` the same way (so `www.` works too)

### 5b. In Squarespace — update the DNS

1. Open <https://account.squarespace.com/domains>
2. Log in with your domain's email
3. Click `alisonthomasmedium.com` → **DNS** (in the left menu)
4. You'll see a list of existing records. **Find and delete** the ones that say:
   - Type `A`, Host `@` (there are usually 4 of these, all with Squarespace IPs starting with `198.`)
   - Type `CNAME`, Host `www`
5. Now **add new records**:

    | Type | Host | Value / Points to |
    |---|---|---|
    | `A` | `@` | `76.76.21.21` |
    | `CNAME` | `www` | `cname.vercel-dns.com` |

6. **Keep any MX records as they are** (those are for your email — we don't touch those).
7. Click **Save**.

### 5c. Wait 15 minutes

DNS changes take a few minutes to propagate around the internet. Go make a coffee. Then:

- Open <https://alisonthomasmedium.com> in your browser
- If it shows your new site — 🎉 done
- If it still shows the old Squarespace page — close the tab, wait another 10 min, try again. Sometimes browsers cache the old version — try a different browser or an incognito window.

Within a few more minutes, Vercel will automatically add the little padlock (https) to your address. If you see a warning about a certificate, wait another 10 min and refresh.

---

## Part 6 — First admin login (2 minutes)

Your site is now live. Let's make sure you can manage it.

1. Open <https://alisonthomasmedium.com/admin/login>
2. Type the `ADMIN_PASSWORD` you chose in Part 4
3. You should land on the admin dashboard

From here you can:
- **Edit your weekly schedule** (which hours are bookable on which days)
- **Block specific dates** (holidays, days off)
- See upcoming bookings

Try changing a slot (e.g. block tomorrow from 3–4pm) → save → open `alisonthomasmedium.com/#book` in a different browser → confirm that 3–4pm tomorrow is no longer bookable.

If that works — **you're fully set up**.

---

## What you can and can't change yourself (for now)

**You can change yourself** via `/admin`:
- Weekly booking hours
- Days off / holidays
- See bookings

**You CAN'T change yourself yet** (ask Fazli for now):
- Prices, service descriptions, service durations
- Testimonials
- Hero text, About text
- Contact details, social media links

After launch, Fazli will build an extended admin so you can edit all the text yourself too. Plan is to have that ready during the first weeks of May. Until then, just text/email Fazli with what you want changed — it takes him 5 minutes per change.

---

## If something goes wrong

**"My password isn't working on /admin"** → make sure you're using the `ADMIN_PASSWORD` from Part 4, not your Gmail password. If you forgot it, go to Vercel → Settings → Environment Variables → edit `ADMIN_PASSWORD`, then click Redeploy on the latest deployment.

**"The booking calendar is empty"** → either the Google credentials are wrong, or you haven't set your working hours in `/admin/schedule` yet. Log in and set Mon–Fri 09:00–17:00 to start.

**"A test booking didn't show up in my calendar"** → check `GOOGLE_CALENDAR_ID` in Vercel. It should be `primary` (lowercase, no quotes).

**"My site still shows the old page after changing DNS"** → wait. Up to 48h in rare cases, but usually 15–30 min. Try an incognito window.

**Anything else** → text Fazli a screenshot. Don't panic-click in Vercel or Google Cloud while you wait for his reply — you can make things worse by undoing the wrong thing.

---

## Glossary (in case a word confuses you)

- **Repository / repo:** the folder on GitHub where the site's code lives
- **Deploy:** putting a new version of the site online
- **DNS:** the "phone book" of the internet — maps `alisonthomasmedium.com` to a specific server
- **Environment variables:** settings / secrets the website reads at startup (like API keys)
- **OAuth:** the "Allow this app to access my Google Calendar" permission flow
- **API:** a way for two programs to talk to each other (your site talks to Google Calendar through one)
- **Token:** a long secret string, like a password for machines

---

## Deadline check

Target: site live on `alisonthomasmedium.com` by **Tuesday 29 April**.

Best schedule, working backwards:

- **Thu 24/4 (today):** Part 1 done. Book a 30-min slot with Fazli for Part 2 today or Friday morning.
- **Fri 25/4:** Part 2, 3, 4. Site goes live on `*.vercel.app`.
- **Sat 26/4:** DNS change (Part 5). Weekend for propagation + testing.
- **Sun 27/4:** You test the site as if you were a client. Book yourself an appointment. Log in to admin.
- **Mon 28/4:** Fazli fixes any issues you report.
- **Tue 29/4:** Launch publicly — share the link, post on social media, etc.

If any step slips by more than a day, text Fazli immediately so we can adjust.
