#!/usr/bin/env node
/**
 * Post-deploy smoketest.
 *
 * Kör mot en live-URL (t.ex. din Vercel preview eller alisonthomasmedium.com)
 * och verifierar att alla kritiska endpoints svarar korrekt.
 *
 * Användning:
 *   node scripts/smoketest.mjs https://alisonthomasmedium.com
 *   node scripts/smoketest.mjs https://alisonthomasmedium-xyz.vercel.app
 *
 * Exit code 0 = allt bra. 1 = nånting gick fel.
 */

const url = process.argv[2]
if (!url) {
  console.error("Usage: node scripts/smoketest.mjs <base-url>")
  process.exit(1)
}

const base = url.replace(/\/$/, "")
let failed = 0

function color(code, s) {
  return `\x1b[${code}m${s}\x1b[0m`
}
const pass = (m) => console.log(`${color(32, "✓")} ${m}`)
const fail = (m) => {
  failed++
  console.log(`${color(31, "✗")} ${m}`)
}
const info = (m) => console.log(`${color(90, "·")} ${m}`)

async function check(name, fn) {
  try {
    await fn()
  } catch (err) {
    fail(`${name}: ${err.message}`)
  }
}

// ---------- Checks ----------

async function checkHome() {
  const res = await fetch(base, { redirect: "manual" })
  if (res.status !== 200) throw new Error(`home returned ${res.status}`)
  const html = await res.text()
  if (!html.includes("Alison Thomas")) {
    throw new Error("home HTML missing 'Alison Thomas' string")
  }
  if (!html.includes("Honest, evidential readings")) {
    throw new Error("home HTML missing hero headline")
  }
  pass("home page (/) renders with correct content")
}

async function checkHttps() {
  if (!base.startsWith("https://")) {
    info(`HTTPS check skipped — testing ${base}`)
    return
  }
  const res = await fetch(base, { redirect: "manual" })
  const protocol = new URL(res.url || base).protocol
  if (protocol !== "https:") throw new Error("not served over HTTPS")
  pass("HTTPS is active and cert is valid")
}

async function checkSlots() {
  const res = await fetch(`${base}/api/slots?serviceId=tarot`)
  if (res.status !== 200) {
    throw new Error(`/api/slots returned ${res.status}`)
  }
  const data = await res.json()
  if (!Array.isArray(data.slots)) {
    throw new Error("/api/slots did not return a slots array")
  }
  const connected = data.googleConnected === true
  if (connected) {
    pass(`/api/slots returns ${data.slots.length} slots (Google connected)`)
  } else {
    info(
      `/api/slots returns ${data.slots.length} slots (Google NOT connected — expected before Google setup)`
    )
  }
}

async function checkSlotsInvalidService() {
  const res = await fetch(`${base}/api/slots?serviceId=nonexistent`)
  if (res.status !== 404) {
    throw new Error(`expected 404 for unknown service, got ${res.status}`)
  }
  pass("/api/slots rejects unknown serviceId with 404")
}

async function checkBookingRequiresValidInput() {
  const res = await fetch(`${base}/api/bookings`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ serviceId: "tarot" }), // missing required fields
  })
  if (res.status !== 400) {
    throw new Error(`expected 400 for invalid booking, got ${res.status}`)
  }
  pass("/api/bookings rejects malformed POST with 400")
}

async function checkAdminLoginRequiresPassword() {
  const res = await fetch(`${base}/api/admin/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ password: "definitely-wrong-password-xxxxxxx" }),
  })
  if (res.status !== 401) {
    throw new Error(`wrong password should 401, got ${res.status}`)
  }
  pass("/api/admin/login rejects wrong password with 401")
}

async function checkAdminPageRedirects() {
  const res = await fetch(`${base}/admin`, { redirect: "manual" })
  // Server component does redirect() which returns 307 to /admin/login
  if (res.status !== 307 && res.status !== 302) {
    throw new Error(`expected redirect from /admin, got ${res.status}`)
  }
  const loc = res.headers.get("location") || ""
  if (!loc.includes("/admin/login")) {
    throw new Error(`redirect did not go to /admin/login, went to: ${loc}`)
  }
  pass("/admin redirects unauthenticated users to /admin/login")
}

async function checkAdminApiIsProtected() {
  const res = await fetch(`${base}/api/admin/availability`)
  if (res.status !== 401 && res.status !== 403) {
    throw new Error(
      `/api/admin/availability should 401/403 for anon, got ${res.status}`
    )
  }
  pass("/api/admin/availability blocks unauthenticated requests")
}

async function checkImagesLoad() {
  const res = await fetch(`${base}/images/alison-portrait.jpg`, {
    method: "HEAD",
  })
  if (res.status !== 200) {
    throw new Error(`portrait image returned ${res.status}`)
  }
  pass("portrait image is served")
}

async function checkRobotsNotBlocking() {
  // We don't ship a robots.txt that blocks everything. Just confirm the
  // home page doesn't have <meta name="robots" content="noindex">.
  const res = await fetch(base)
  const html = await res.text()
  if (/robots["']?\s+content=["']noindex/i.test(html)) {
    throw new Error("home page has noindex meta tag")
  }
  pass("home page is indexable (no noindex meta)")
}

// ---------- Run ----------

console.log(`\n${color(1, "Smoketest against")}: ${base}\n`)

await check("home", checkHome)
await check("https", checkHttps)
await check("slots", checkSlots)
await check("slots invalid", checkSlotsInvalidService)
await check("booking validation", checkBookingRequiresValidInput)
await check("admin login wrong pw", checkAdminLoginRequiresPassword)
await check("admin page redirect", checkAdminPageRedirects)
await check("admin API protected", checkAdminApiIsProtected)
await check("portrait image", checkImagesLoad)
await check("indexable", checkRobotsNotBlocking)

console.log()
if (failed > 0) {
  console.log(color(31, `${failed} check(s) failed.`))
  process.exit(1)
}
console.log(color(32, "All checks passed."))
