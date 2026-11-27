interface ChartTooltipProps {
  title: string
  rows: { name: string; value: string }[]
  /** Posición del dato, en píxeles. */
  x: number
  chartWidth: number
}

const WIDTH = 220

/** Globo del valor señalado; se mantiene siempre dentro de la gráfica. */
export function ChartTooltip({ title, rows, x, chartWidth }: ChartTooltipProps) {
  const left = Math.max(0, Math.min(x - WIDTH / 2, chartWidth - WIDTH))
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 z-10 rounded-xl bg-surface px-3 py-2 text-xs shadow-popover"
      style={{ left, width: WIDTH }}
    >
      <p className="font-medium text-ink mb-1">{title}</p>
      {rows.map((row) => (
        <p key={row.name} className="flex justify-between gap-3 text-ink-soft">
          <span className="inline-block first-letter:uppercase">{row.name}</span>
          <span className="font-medium text-ink tabular-nums">{row.value}</span>
        </p>
      ))}
    </div>
  )
}
