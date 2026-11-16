export function formatCOP(value: number): string {
  return "$ " + Math.round(value).toLocaleString("es-CO")
}

export function fmtPct(n: number): string {
  return (
    n.toLocaleString("es-CO", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      signDisplay: "exceptZero",
    }) + " %"
  )
}

export const pad = (n: number) => String(n).padStart(2, "0")

export function niceScale(max: number) {
  const raw = max * 1.08 || 1
  const mag = 10 ** Math.floor(Math.log10(raw))
  for (const m of [0.5, 1, 2, 2.5, 5, 10]) {
    const step = m * mag
    const intervals = Math.ceil(raw / step)
    if (intervals <= 5) return { top: intervals * step, step, intervals }
  }
  return { top: raw, step: raw, intervals: 1 }
}
