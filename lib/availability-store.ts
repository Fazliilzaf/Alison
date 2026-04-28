/**
 * Persistent store for Alison's weekly availability.
 *
 * The admin UI writes here; the /api/slots endpoint reads from here.
 *
 * Two backends are supported, picked automatically:
 *
 *   • Upstash Redis (production, Vercel, any serverless host)
 *     Triggered when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set.
 *
 *   • Local JSON file at ./data/availability.json (development, self-hosted)
 *     Used when Upstash env vars aren't set. Safe to gitignore.
 *
 * If neither backend has a stored value yet, the store seeds itself from
 * the defaults in lib/availability.ts, so the site works out of the box.
 */

import fs from "node:fs/promises"
import path from "node:path"
import {
  weeklyAvailability as defaultAvailability,
  bookingWindow as defaultBookingWindow,
  type WeeklyRule,
} from "./availability"

export type StoredSchedule = {
  weekly: WeeklyRule[]
  leadTimeHours: number
  maxDaysAhead: number
  slotInterval: number
  updatedAt: string
}

const REDIS_KEY = "alison:availability:v1"
const LOCAL_FILE = path.join(process.cwd(), "data", "availability.json")

function defaultSchedule(): StoredSchedule {
  return {
    weekly: defaultAvailability,
    leadTimeHours: defaultBookingWindow.leadTimeHours,
    maxDaysAhead: defaultBookingWindow.maxDaysAhead,
    slotInterval: defaultBookingWindow.slotInterval,
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Resolve Upstash credentials from either:
 *   - UPSTASH_REDIS_REST_URL/TOKEN (set when you provision Upstash directly)
 *   - KV_REST_API_URL/TOKEN (set when you provision via Vercel Marketplace)
 *
 * Both come from the same Upstash backend; only the env-var prefix differs
 * depending on how the database was created.
 */
function getUpstashCreds(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  return { url, token }
}

function hasUpstash(): boolean {
  return getUpstashCreds() !== null
}

/* --------------------------- Upstash backend --------------------------- */

async function getRedis() {
  const { Redis } = await import("@upstash/redis")
  const creds = getUpstashCreds()
  if (!creds) throw new Error("Upstash credentials not configured")
  return new Redis({ url: creds.url, token: creds.token })
}

async function readFromUpstash(): Promise<StoredSchedule | null> {
  const redis = await getRedis()
  const value = (await redis.get(REDIS_KEY)) as StoredSchedule | null
  return value ?? null
}

async function writeToUpstash(schedule: StoredSchedule): Promise<void> {
  const redis = await getRedis()
  await redis.set(REDIS_KEY, schedule)
}

/* ------------------------- Local file backend ------------------------- */

async function readFromFile(): Promise<StoredSchedule | null> {
  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf8")
    return JSON.parse(raw) as StoredSchedule
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null
    throw err
  }
}

async function writeToFile(schedule: StoredSchedule): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true })
  await fs.writeFile(LOCAL_FILE, JSON.stringify(schedule, null, 2), "utf8")
}

/* ---------------------------- Public API ----------------------------- */

/**
 * Read the current schedule. Returns the default if nothing has been
 * saved yet (so the site always has a sensible baseline).
 */
export async function getSchedule(): Promise<StoredSchedule> {
  try {
    if (hasUpstash()) {
      const stored = await readFromUpstash()
      if (stored) return stored
    } else {
      const stored = await readFromFile()
      if (stored) return stored
    }
  } catch (err) {
    console.error("[availability-store] read failed, returning default:", err)
  }
  return defaultSchedule()
}

/**
 * Save a new schedule. Persists to the active backend.
 */
export async function saveSchedule(
  schedule: Omit<StoredSchedule, "updatedAt">
): Promise<StoredSchedule> {
  const full: StoredSchedule = { ...schedule, updatedAt: new Date().toISOString() }
  if (hasUpstash()) {
    await writeToUpstash(full)
  } else {
    await writeToFile(full)
  }
  return full
}

/**
 * Indicates which backend is active, for display in the admin UI.
 */
export function activeBackend(): "upstash" | "file" {
  return hasUpstash() ? "upstash" : "file"
}
