"use client"

import { useEffect, useRef, useState } from "react"

/**
 * useReveal — observe an element and flip `shown` to true the first time it
 * intersects the viewport. Respects `prefers-reduced-motion` by short-circuiting
 * to shown=true immediately so reveal animations become a no-op.
 *
 * Pair with the `.reveal` / `.reveal-stagger` utility classes in globals.css:
 *
 *   const { ref, shown } = useReveal<HTMLDivElement>()
 *   <div ref={ref} data-shown={shown} className="reveal">…</div>
 */
export function useReveal<T extends HTMLElement>(
  options?: IntersectionObserverInit,
) {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(false)
  // Frys options till första render så inline-objekt från callers inte triggar
  // oändlig observer-recreation vid varje re-render av föräldern.
  const optsRef = useRef(options)

  useEffect(() => {
    if (!ref.current || shown) return

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (reduceMotion) {
      setShown(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.15,
        ...optsRef.current,
      },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [shown])

  return { ref, shown }
}
