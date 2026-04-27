# Connecting Your Google Calendar to Your New Website

This is the one technical step only you can do, because it requires logging in as **alithomasmedium@gmail.com** and giving the new website permission to read your calendar.

You'll do everything in a browser — no terminal, no command line. It takes about **25 minutes**. By the end you'll send Fazli three small pieces of text and he'll plug them into the website.

---

## Before you start (2 min)

- [ ] You're using a laptop, not a phone (mobile makes Google Cloud Console hard to navigate)
- [ ] Sign in to Gmail as **alithomasmedium@gmail.com** in your browser
- [ ] Have your phone nearby for any two-factor codes
- [ ] Open a notepad (Apple Notes works) — you'll copy three things into it
- [ ] Have **Signal** (or another encrypted messenger) open with Fazli — you'll send him the three things at the end

> **The single most important rule:** stay logged in as `alithomasmedium@gmail.com` the whole time. If at any point you see a different Google account in the top-right corner, log out and back in immediately. Doing this on the wrong account creates a setup that doesn't work and we'd have to start over.

---

## Phase 1 — Create a Google Cloud project (5 min)

1. Open <https://console.cloud.google.com>
2. Top-right corner: confirm the avatar/name shows **alithomasmedium@gmail.com**
3. If a "Welcome" or terms-of-service page appears, accept it
4. Top header (next to the "Google Cloud" logo), click the project name dropdown — it might say "Select a project"
5. In the dialog that opens, click **NEW PROJECT** (top-right)
6. **Project name:** type `alison-booking`
7. **Organization:** leave as "No organization"
8. Click **CREATE**
9. Wait ~30 seconds. A bell-icon notification at top-right will say "Create Project: alison-booking"
10. Open the project picker again and click `alison-booking` to switch to it

**Done when:** the top header shows `alison-booking` as the active project.

---

## Phase 2 — Enable the Google Calendar API (2 min)

11. In the search bar at the very top, type `Calendar API` and press Enter
12. In the results, click **Google Calendar API**
13. Click the blue **ENABLE** button
14. Wait ~30 seconds — the page reloads to "API/Service Details" with green text "API enabled"

**Done when:** you see green "API enabled" text on the page.

---

## Phase 3 — Configure OAuth Consent Screen (5 min)

This is the page Google shows when an app asks for permission. Since you're the only user, it's mostly paperwork.

15. Left sidebar (or hamburger menu ☰ top-left): click **APIs & Services → OAuth consent screen**
16. **User Type:** select **External** → click **CREATE**
17. On the "App information" page, fill in:
    - **App name:** `Alison Thomas Booking`
    - **User support email:** select `alithomasmedium@gmail.com` from the dropdown
    - **Developer contact information:** type `alithomasmedium@gmail.com`
    - Leave everything else blank
18. Click **SAVE AND CONTINUE**
19. On the **Scopes** screen, don't add anything — just click **SAVE AND CONTINUE**
20. On the **Test users** screen:
    - Click **+ ADD USERS**
    - Type `alithomasmedium@gmail.com` and click **ADD**
    - Click **SAVE AND CONTINUE**
21. On the Summary page, click **BACK TO DASHBOARD**

**Done when:** the OAuth Consent Screen dashboard shows:
- Publishing status: **Testing**
- User type: **External**
- Test users list includes **alithomasmedium@gmail.com**

---

## Phase 4 — Create the OAuth Client ID (3 min)

22. Left sidebar: click **APIs & Services → Credentials**
23. Click **+ CREATE CREDENTIALS** at the top → choose **OAuth client ID**
24. **Application type:** select **Web application**
25. **Name:** type `alison-booking-web`
26. Scroll down to **Authorized redirect URIs** → click **+ ADD URI**
27. In the input field, paste exactly this (no extra spaces, no trailing slash):
    ```
    https://developers.google.com/oauthplayground
    ```
28. Click **CREATE**
29. A popup appears with two values: **Client ID** and **Client secret**
30. Copy the **Client ID** — paste into your notes labeled `CLIENT_ID = ...`
31. Copy the **Client secret** — paste into your notes labeled `CLIENT_SECRET = ...`
32. Click **OK** to close the popup

**Done when:** your notes have these two lines:
```
CLIENT_ID = 123456789-xxxxxxxxxxxx.apps.googleusercontent.com
CLIENT_SECRET = GOCSPX-xxxxxxxxxxxxxxxxxxxxxxx
```

---

## Phase 5 — Get the Refresh Token via OAuth Playground (5 min)

This is the magic step where Google gives the website a long-lived "key" to read your calendar.

33. Open <https://developers.google.com/oauthplayground> in a **new tab**
34. Top-right of that page, click the **gear icon** ⚙ (Settings)
35. In the settings panel, check the box **"Use your own OAuth credentials"**
36. Paste your **Client ID** (from your notes) into "OAuth Client ID"
37. Paste your **Client Secret** into "OAuth Client secret"
38. Click **Close**
39. On the left side, "Step 1 — Select & authorize APIs":
    - In the filter box, type `calendar`
    - Expand **Calendar API v3**
    - **Check both** of these scopes:
      - `https://www.googleapis.com/auth/calendar`
      - `https://www.googleapis.com/auth/calendar.events`
    - Click the blue **Authorize APIs** button
40. A new window or tab opens with Google's "Sign in" prompt:
    - Choose **alithomasmedium@gmail.com**
    - You'll likely see a warning **"Google hasn't verified this app"**. This is normal because we haven't submitted the app for Google's review (we don't need to since you're the only user). Click **Advanced**, then click the small link **"Go to Alison Thomas Booking (unsafe)"** — it's safe; it's your own project.
    - Click **Continue**
    - The next screen shows the calendar permissions — click **Allow**
41. You're back on the Playground. Now "Step 2 — Exchange authorization code for tokens":
    - Click the blue **Exchange authorization code for tokens** button
42. The right-side "Response" panel updates with several lines. Find the line labeled **`refresh_token`** — it's a long string starting with `1//`
43. Copy that entire `refresh_token` value (the part inside the quotes, after `"refresh_token":`)
44. Paste into your notes labeled `REFRESH_TOKEN = ...`

**Done when:** your notes have all three values:
```
CLIENT_ID = 123456789-xxxxxxxxxxxx.apps.googleusercontent.com
CLIENT_SECRET = GOCSPX-xxxxxxxxxxxxxxxxxxxxxxx
REFRESH_TOKEN = 1//0gxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Phase 6 — Send the values to Fazli securely (2 min)

These three values together let anyone read and write to your calendar — treat them like passwords.

**Send via (best to worst):**
- Signal message — end-to-end encrypted, recommended
- 1Password / Bitwarden shared note
- iMessage (if you're both on Apple devices)

**Don't use:**
- Plain email
- SMS
- Public Slack/Discord

**Message template** to copy-paste to Fazli:
```
Google Calendar credentials for the new website:

CLIENT_ID = paste-here
CLIENT_SECRET = paste-here
REFRESH_TOKEN = paste-here
GOOGLE_CALENDAR_ID = primary
```

After Fazli has them, **delete them from your notes** — they're now safely in Vercel's encrypted storage.

---

## What this just did

You created an OAuth client owned by your Google account, then handed the website a "refresh token" that lets it read your calendar's busy/free times and add new bookings as events. The token works indefinitely unless you revoke it from <https://myaccount.google.com/permissions>.

Nothing on your existing calendar is changed by this setup. The first time the website actually reads your calendar will be when Fazli pastes the values into Vercel and someone visits the booking page.

---

## If something goes wrong

| Problem | Fix |
|---|---|
| **"Access blocked: this app's request is invalid"** | The redirect URI in step 27 doesn't match. Go back to **APIs & Services → Credentials** → click your `alison-booking-web` client → check that "Authorized redirect URIs" contains exactly `https://developers.google.com/oauthplayground` with no trailing slash, no spaces. |
| **"This app isn't verified" blocks you** in step 40 | Click **Advanced** → click the link **"Go to Alison Thomas Booking (unsafe)"**. It says "unsafe" but it's your own app — Google just hasn't reviewed it (and doesn't need to, because you're the only user). |
| **`refresh_token` doesn't appear in the response** in step 42 | You've authorized this app before. Open <https://myaccount.google.com/permissions>, find "Alison Thomas Booking", click **Remove access**, then re-do steps 39–43. Refresh tokens are only issued the first time. |
| **You're not sure if you're on the right account** | Look at the top-right avatar everywhere. It must say `alithomasmedium@gmail.com`. If not, sign out of all Google accounts and sign in only as her. |
| **Stuck somewhere else** | Take a screenshot at the screen where you're stuck and send it to Fazli. He can talk you through it in 2 minutes. |

---

## Time-check

If you've reached the end of Phase 6, you're done. Total time should be around 20–25 minutes the first time. Send Fazli the message and you're free.
