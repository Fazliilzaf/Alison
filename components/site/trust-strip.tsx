"use client"

import { useEffect, useRef, useState } from "react"

type Stat = {
  /** Numeriskt målvärde (animeras 0 → value) */
  value: number
  /** Tecken som ska visas före siffran (t.ex. "1 of ") */
  prefix?: string
  /** Tecken som ska visas efter siffran (t.ex. "+", "%") */
  suffix?: string
  label: string
}

const stats: Stat[] = [
  { value: 10, suffix: "+", label: "Years of Practice" },
  { value: 17, label: "Years Police Background" },
  { value: 34, prefix: "1 of ", label: "Pásale Healers Worldwide" },
  { value: 15, suffix: "+", label: "Countries Served" },
]

function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1600,
}: {
  to: number
  prefix?: string
  suffix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [val, setVal] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    if (reduceMotion) {
      setVal(to)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        const start = performance.now()
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / duration)
          // ease-out-cubic — startar snabbt, landar mjukt
          const eased = 1 - Math.pow(1 - p, 3)
          setVal(Math.round(to * eased))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        io.disconnect()
      },
      { threshold: 0.55 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [to, duration])

  return (
    <span ref={ref}>
      {prefix}
      {val}
      {suffix}
    </span>
  )
}

export function TrustStrip() {
  return (
    <section className="bg-ivory border-y border-gold/30">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8 md:py-10">
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 text-center">
          {stats.map((s) => (
            <li
              key={s.label}
              className="group flex flex-col items-center gap-2"
            >
              <span className="font-serif text-3xl md:text-4xl text-gold-dark tabular-nums">
                <CountUp
                  to={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                />
              </span>
              <span className="text-[11px] md:text-xs tracking-[0.22em] uppercase text-navy/70 text-balance max-w-[16ch]">
                {s.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
