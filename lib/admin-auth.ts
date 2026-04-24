/**
 * Minimal password-based admin auth.
 *
 * One env var, `ADMIN_PASSWORD`, controls access. A signed HMAC cookie
 * keeps Alison logged in for 30 days. No database, no session store —
 * the server just verifies the cookie signature on each request.
 *
 * This is appropriate for a single-admin site. For multi-user systems,
 * swap in NextAuth or similar.
 */

import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

const COOKIE_NAME = "alison_admin"
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 days

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET (or ADMIN_PASSWORD as fallback) must be set."
    )
  }
  return secret
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex")
}

/**
 * Build a signed cookie value. Returns `<issuedAtMs>.<hex-signature>`.
 */
function mintToken(): string {
  const payload = String(Date.now())
  return `${payload}.${sign(payload)}`
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false
  const parts = token.split(".")
  if (parts.length !== 2) return false
  const [issuedAt, providedSig] = parts
  if (!/^\d+$/.test(issuedAt)) return false

  const ageMs = Date.now() - Number(issuedAt)
  if (ageMs < 0 || ageMs > COOKIE_MAX_AGE_SECONDS * 1000) return false

  const expected = sign(issuedAt)
  const a = Buffer.from(expected, "hex")
  const b = Buffer.from(providedSig, "hex")
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

/**
 * Compare a submitted password to ADMIN_PASSWORD in constant time.
 */
export function passwordMatches(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  const a = Buffer.from(expected)
  const b = Buffer.from(candidate)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

/**
 * Check whether the current request carries a valid admin cookie.
 * Use inside server components and API routes.
 */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  return verifyToken(token)
}

/**
 * Set a fresh signed admin cookie.
 */
export async function issueAdminCookie(): Promise<void> {
  const store = await cookies()
  store.set({
    name: COOKIE_NAME,
    value: mintToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  })
}

/**
 * Clear the admin cookie.
 */
export async function clearAdminCookie(): Promise<void> {
  const store = await cookies()
  store.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
}
