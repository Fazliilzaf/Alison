const stats = [
  { value: "10+", label: "Years of Practice" },
  { value: "17", label: "Years Police Background" },
  { value: "1 of 34", label: "Pásale Healers Worldwide" },
  { value: "100%", label: "Honest Evidential Work" },
]

export function TrustStrip() {
  return (
    <section className="bg-ivory border-y border-gold/30">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-5 md:py-7">
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 text-center">
          {stats.map((s) => (
            <li key={s.label} className="flex flex-col items-center gap-2">
              <span className="font-serif text-3xl md:text-4xl text-gold-dark">
                {s.value}
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
