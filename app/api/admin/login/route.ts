import { NextResponse } from "next/server"
import { z } from "zod"
import { issueAdminCookie, passwordMatches } from "@/lib/admin-auth"

export const dynamic = "force-dynamic"

const schema = z.object({
  password: z.string().min(1).max(200),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  if (!passwordMatches(parsed.data.password)) {
    // Small fixed delay to blunt brute-force attempts.
    await new Promise((r) => setTimeout(r, 400))
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 })
  }

  await issueAdminCookie()
  return NextResponse.json({ ok: true })
}
