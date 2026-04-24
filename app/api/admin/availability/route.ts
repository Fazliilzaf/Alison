import { NextResponse } from "next/server"
import { z } from "zod"
import { isAuthenticated } from "@/lib/admin-auth"
import { getSchedule, saveSchedule, activeBackend } from "@/lib/availability-store"

export const dynamic = "force-dynamic"

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/

const WindowSchema = z
  .object({
    start: z.string().regex(HHMM, "Must be HH:MM"),
    end: z.string().regex(HHMM, "Must be HH:MM"),
  })
  .refine((w) => w.start < w.end, "End must be after start")

const RuleSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  windows: z.array(WindowSchema).max(4),
})

const SaveSchema = z.object({
  weekly: z.array(RuleSchema).length(7),
  leadTimeHours: z.number().int().min(0).max(168),
  maxDaysAhead: z.number().int().min(1).max(365),
  slotInterval: z
    .number()
    .int()
    .refine(
      (n) => [15, 20, 30, 45, 60].includes(n),
      "slotInterval must be 15, 20, 30, 45 or 60"
    ),
})

async function requireAuth() {
  const ok = await isAuthenticated()
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return null
}

export async function GET() {
  const unauth = await requireAuth()
  if (unauth) return unauth
  const schedule = await getSchedule()
  return NextResponse.json({
    schedule,
    backend: activeBackend(),
  })
}

export async function PUT(request: Request) {
  const unauth = await requireAuth()
  if (unauth) return unauth

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = SaveSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const saved = await saveSchedule(parsed.data)
  return NextResponse.json({ ok: true, schedule: saved })
}
