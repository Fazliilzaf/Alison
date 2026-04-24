"use client"

import { type FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? "Incorrect password")
        return
      }
      router.replace("/admin")
      router.refresh()
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <p className="text-[11px] tracking-[0.28em] uppercase text-gold-dark">
        Admin
      </p>
      <h1 className="mt-3 font-serif text-3xl text-navy">Sign in</h1>
      <p className="mt-2 text-sm text-charcoal/70">
        Enter the admin password to manage your weekly schedule.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="password" className="text-charcoal">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error ? <p className="text-sm text-burgundy">{error}</p> : null}
        <Button
          type="submit"
          disabled={submitting || password.length === 0}
          className="bg-navy text-ivory hover:bg-navy-dark rounded-full"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  )
}
