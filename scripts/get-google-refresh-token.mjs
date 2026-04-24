/**
 * One-time OAuth script to obtain a Google Calendar refresh token.
 *
 * Run once by Alison (or whoever owns the calendar that bookings should
 * be written to). The resulting refresh token is pasted into .env.local
 * as GOOGLE_REFRESH_TOKEN — after that the app can authenticate on its
 * own indefinitely (refresh tokens don't expire unless revoked).
 *
 * Usage:
 *   1. Ensure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set in env
 *      (e.g. `export GOOGLE_CLIENT_ID=...`).
 *   2. Register `http://localhost:3100/callback` as an authorized redirect
 *      URI in your Google Cloud OAuth client.
 *   3. `node scripts/get-google-refresh-token.mjs`
 *   4. A browser tab opens — sign in as Alison and approve.
 *   5. The refresh token is printed to the terminal. Paste into .env.local.
 */

import http from "node:http"
import { URL } from "node:url"
import { exec } from "node:child_process"
import { google } from "googleapis"

const PORT = 3100
const REDIRECT = `http://localhost:${PORT}/callback`

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET before running this script."
  )
  console.error("Example:")
  console.error(
    "  GOOGLE_CLIENT_ID=xxx GOOGLE_CLIENT_SECRET=yyy node scripts/get-google-refresh-token.mjs"
  )
  process.exit(1)
}

const oauth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT)

const authUrl = oauth2.generateAuthUrl({
  access_type: "offline",
  prompt: "consent", // force refresh_token on every run
  scope: [
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/calendar.freebusy",
  ],
})

console.log("\nOpening your browser to authorize access to Google Calendar...")
console.log("If it doesn't open automatically, visit:\n")
console.log("  " + authUrl + "\n")

function openBrowser(url) {
  const cmd =
    process.platform === "darwin"
      ? `open "${url}"`
      : process.platform === "win32"
        ? `start "" "${url}"`
        : `xdg-open "${url}"`
  exec(cmd, () => {}) // ignore errors — the URL is also printed above
}

const server = http.createServer(async (req, res) => {
  try {
    const parsed = new URL(req.url, `http://localhost:${PORT}`)
    if (parsed.pathname !== "/callback") {
      res.writeHead(404).end("Not found")
      return
    }
    const code = parsed.searchParams.get("code")
    const errorParam = parsed.searchParams.get("error")

    if (errorParam) {
      res.writeHead(400, { "Content-Type": "text/html" })
      res.end(`<h1>Authorization denied</h1><p>${errorParam}</p>`)
      console.error("Authorization error:", errorParam)
      server.close()
      process.exit(1)
    }

    if (!code) {
      res.writeHead(400).end("Missing authorization code")
      return
    }

    const { tokens } = await oauth2.getToken(code)
    const refreshToken = tokens.refresh_token

    res.writeHead(200, { "Content-Type": "text/html" })
    res.end(
      `<!doctype html><meta charset="utf-8"><title>Authorized</title>` +
        `<style>body{font-family:system-ui;padding:40px;max-width:640px;margin:auto;color:#2a2a2a}</style>` +
        `<h1>You're all set.</h1>` +
        `<p>Return to your terminal — your refresh token has been printed there.</p>` +
        `<p>You can close this tab.</p>`
    )

    console.log("\n-----------------------------------------------------")
    if (!refreshToken) {
      console.error(
        "No refresh_token returned. Revoke the app's access at " +
          "https://myaccount.google.com/permissions and try again."
      )
      server.close()
      process.exit(1)
    }

    console.log("Refresh token acquired. Add this to your .env.local:\n")
    console.log(`GOOGLE_REFRESH_TOKEN=${refreshToken}`)
    console.log("\n-----------------------------------------------------")
    server.close()
    process.exit(0)
  } catch (e) {
    console.error("Token exchange failed:", e)
    res.writeHead(500).end("Token exchange failed — see terminal.")
    server.close()
    process.exit(1)
  }
})

server.listen(PORT, () => {
  openBrowser(authUrl)
  console.log(
    `Listening on http://localhost:${PORT} for the OAuth callback...`
  )
})
