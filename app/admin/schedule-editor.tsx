"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import type { StoredSchedule } from "@/lib/availability-store"

const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

const SLOT_INTERVALS = [15, 20, 30, 45, 60]

type Props = {
  initialSchedule: StoredSchedule
  backend: "upstash" | "file"
}

export function ScheduleEditor({ initialSchedule, backend }: Props) {
  const [schedule, setSchedule] = useState<StoredSchedule>(initialSchedule)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<
    { kind: "ok" | "error"; text: string } | null
  >(null)

  function updateWindow(
    dayIndex: number,
    windowIndex: number,
    key: "start" | "end",
    value: string
  ) {
    setSchedule((s) => {
      const weekly = s.weekly.map((rule, idx) => {
        if (idx !== dayIndex) return rule
        const windows = rule.windows.map((w, wi) =>
          wi === windowIndex ? { ...w, [key]: value } : w
        )
        return { ...rule, windows }
      })
      return { ...s, weekly }
    })
  }

  function addWindow(dayIndex: number) {
    setSchedule((s) => {
      const weekly = s.weekly.map((rule, idx) => {
        if (idx !== dayIndex) return rule
        const last = rule.windows[rule.windows.length - 1]
        const next = last
          ? { start: last.end, end: "17:00" }
          : { start: "09:00", end: "17:00" }
        return { ...rule, windows: [...rule.windows, next] }
      })
      return { ...s, weekly }
    })
  }

  function removeWindow(dayIndex: number, windowIndex: number) {
    setSchedule((s) => {
      const weekly = s.weekly.map((rule, idx) => {
        if (idx !== dayIndex) return rule
        return {
          ...rule,
          windows: rule.windows.filter((_, wi) => wi !== windowIndex),
        }
      })
      return { ...s, weekly }
    })
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/admin/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekly: schedule.weekly,
          leadTimeHours: schedule.leadTimeHours,
          maxDaysAhead: schedule.maxDaysAhead,
          slotInterval: schedule.slotInterval,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage({
          kind: "error",
          text:
            data.error ||
            "Could not save. Check that start times are before end times.",
        })
        return
      }
      setSchedule(data.schedule)
      setMessage({ kind: "ok", text: "Schedule saved." })
    } catch {
      setMessage({ kind: "error", text: "Network error. Please try again." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="rounded-sm border border-gold/40 bg-cream/50 p-5">
        <p className="text-[11px] tracking-[0.2em] uppercase text-gold-dark">
          Days &amp; hours
        </p>
        <p className="mt-1 text-xs text-charcoal/60">
          Add multiple windows for a day to create breaks without needing
          an event in Google Calendar. Remove all windows to close a day.
        </p>

        <div className="mt-5 grid gap-4">
          {schedule.weekly.map((rule, dayIndex) => (
            <div
              key={rule.dayOfWeek}
              className="grid grid-cols-[100px_1fr_auto] items-start gap-3 border-t border-gold/20 pt-4 first:border-t-0 first:pt-0"
            >
              <p className="font-serif text-lg text-navy pt-1">
                {DAY_LABELS[rule.dayOfWeek]}
              </p>
              <div className="grid gap-2">
                {rule.windows.length === 0 ? (
                  <p className="text-sm text-charcoal/50 italic pt-1">
                    Closed
                  </p>
                ) : (
                  rule.windows.map((w, wi) => (
                    <div
                      key={wi}
                      className="flex items-center gap-2"
                    >
                      <Input
                        type="time"
                        value={w.start}
                        onChange={(e) =>
                          updateWindow(
                            dayIndex,
                            wi,
                            "start",
                            e.target.value
                          )
                        }
                        className="w-28"
                      />
                      <span className="text-charcoal/50">–</span>
                      <Input
                        type="time"
                        value={w.end}
                        onChange={(e) =>
                          updateWindow(dayIndex, wi, "end", e.target.value)
                        }
                        className="w-28"
                      />
                      <button
                        type="button"
                        onClick={() => removeWindow(dayIndex, wi)}
                        className="text-charcoal/50 hover:text-burgundy p-1"
                        aria-label="Remove window"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
              <button
                type="button"
                onClick={() => addWindow(dayIndex)}
                className="inline-flex items-center gap-1.5 text-xs text-navy hover:text-navy-dark underline underline-offset-4 pt-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add window
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <div className="rounded-sm border border-gold/40 bg-cream/50 p-4">
          <Label className="text-xs uppercase tracking-[0.15em] text-gold-dark">
            Lead time (hours)
          </Label>
          <Input
            type="number"
            min={0}
            max={168}
            value={schedule.leadTimeHours}
            onChange={(e) =>
              setSchedule((s) => ({
                ...s,
                leadTimeHours: Number(e.target.value) || 0,
              }))
            }
            className="mt-2"
          />
          <p className="mt-2 text-xs text-charcoal/60">
            Minimum hours from now before a slot is bookable.
          </p>
        </div>
        <div className="rounded-sm border border-gold/40 bg-cream/50 p-4">
          <Label className="text-xs uppercase tracking-[0.15em] text-gold-dark">
            Max days ahead
          </Label>
          <Input
            type="number"
            min={1}
            max={365}
            value={schedule.maxDaysAhead}
            onChange={(e) =>
              setSchedule((s) => ({
                ...s,
                maxDaysAhead: Number(e.target.value) || 1,
              }))
            }
            className="mt-2"
          />
          <p className="mt-2 text-xs text-charcoal/60">
            How far into the future clients can book.
          </p>
        </div>
        <div className="rounded-sm border border-gold/40 bg-cream/50 p-4">
          <Label className="text-xs uppercase tracking-[0.15em] text-gold-dark">
            Slot step (min)
          </Label>
          <select
            value={schedule.slotInterval}
            onChange={(e) =>
              setSchedule((s) => ({
                ...s,
                slotInterval: Number(e.target.value),
              }))
            }
            className="mt-2 h-9 w-full rounded-md border border-gold/40 bg-ivory px-3 text-sm"
          >
            {SLOT_INTERVALS.map((n) => (
              <option key={n} value={n}>
                Every {n} minutes
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-charcoal/60">
            How often a candidate start time appears in the calendar.
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs text-charcoal/50">
          Last updated{" "}
          {new Date(schedule.updatedAt).toLocaleString("en-GB", {
            dateStyle: "medium",
            timeStyle: "short",
          })}{" "}
          · Backend: <span className="font-mono">{backend}</span>
          {backend === "file" ? (
            <span className="text-burgundy/80">
              {" "}
              · In production, set UPSTASH_REDIS_REST_URL and TOKEN for
              persistent storage.
            </span>
          ) : null}
        </p>
        <div className="flex items-center gap-3">
          {message ? (
            <span
              className={
                message.kind === "ok"
                  ? "text-sm text-sage"
                  : "text-sm text-burgundy"
              }
            >
              {message.text}
            </span>
          ) : null}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-navy text-ivory hover:bg-navy-dark rounded-full px-6"
          >
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
