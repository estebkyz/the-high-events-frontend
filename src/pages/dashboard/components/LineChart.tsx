import { useId, useState, type KeyboardEvent } from "react"
import { DetailEmptyNote } from "@/components/detail"
import { useElementWidth } from "@/hooks/useElementWidth"
import { formatCOP } from "@/utils/format"
import { BASELINE, CHART_HEIGHT, PAD, formatAxis, getScale, toPoints } from "../chart"
import type { ChartSeries } from "../types"
import { ChartTooltip } from "./ChartTooltip"

interface LineChartProps {
  labels: string[]
  series: ChartSeries[]
  ariaLabel: string
}

export function LineChart({ labels, series, ariaLabel }: LineChartProps) {
  const gradientId = useId()
  const { ref, width } = useElementWidth<HTMLDivElement>(660)
  const [hover, setHover] = useState<number | null>(null)
  const last = labels.length - 1
  const scale = getScale(width, labels.length, series)
  const main = series[0]
  const area = main?.area ? toPoints(main.values) : []

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") setHover(null)
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
    e.preventDefault()
    const delta = e.key === "ArrowRight" ? 1 : -1
    setHover((current) => {
      if (current === null) return delta > 0 ? 0 : last
      return Math.min(last, Math.max(0, current + delta))
    })
  }

  const rows =
    hover === null
      ? []
      : series.map((s) => ({
          name: s.name,
          value: s.values[hover] === null ? "Sin datos" : formatCOP(s.values[hover]),
        }))
  const spoken =
    hover === null
      ? ""
      : `${labels[hover]}. ${rows.map((r) => `${r.name}: ${r.value}`).join(". ")}`

  return (
    <div ref={ref} className="relative w-full min-w-0">
      {/* Siempre montada: así el lector anuncia cada cambio. */}
      <p role="status" className="sr-only">
        {spoken}
      </p>
      {scale.isEmpty ? (
        <DetailEmptyNote text="Sin movimientos en el período." />
      ) : (
        <div
          role="group"
          aria-roledescription="gráfica"
          aria-label={`${ariaLabel}. Usa las flechas izquierda y derecha para ver cada valor.`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onBlur={() => setHover(null)}
          onMouseLeave={() => setHover(null)}
          className="rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <svg
            width={width}
            height={CHART_HEIGHT}
            viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
            aria-hidden="true"
            className="block max-w-full select-none"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={main?.color} stopOpacity="0.22" />
                <stop offset="100%" stopColor={main?.color} stopOpacity="0" />
              </linearGradient>
            </defs>

            {scale.levels.map((level) => (
              <g key={level}>
                <line
                  x1={PAD.left}
                  y1={scale.y(level)}
                  x2={width - PAD.right}
                  y2={scale.y(level)}
                  stroke="var(--chart-grid)"
                  strokeDasharray="3 3"
                />
                <text
                  x={PAD.left - 10}
                  y={scale.y(level) + 4}
                  fill="var(--chart-axis)"
                  fontSize="12"
                  fontWeight="500"
                  textAnchor="end"
                >
                  {formatAxis(level)}
                </text>
              </g>
            ))}

            {area.length > 1 && (
              <polygon
                fill={`url(#${gradientId})`}
                points={`${scale.x(area[0].index)},${BASELINE} ${scale.path(area)} ${scale.x(area[area.length - 1].index)},${BASELINE}`}
              />
            )}

            {hover !== null && (
              <line
                x1={scale.x(hover)}
                y1={PAD.top}
                x2={scale.x(hover)}
                y2={BASELINE}
                stroke="var(--chart-axis)"
                strokeOpacity="0.5"
                strokeDasharray="2 3"
              />
            )}

            {/* La serie principal se dibuja al final para quedar encima. */}
            {[...series].reverse().map((s) => (
              <g key={s.name}>
                <polyline
                  fill="none"
                  stroke={s.color}
                  strokeWidth={s.strong ? 2.75 : 2}
                  strokeDasharray={s.dashed ? "5 5" : undefined}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={scale.path(toPoints(s.values))}
                />
                {toPoints(s.values).map((p) => (
                  <circle
                    key={labels[p.index]}
                    cx={scale.x(p.index)}
                    cy={scale.y(p.value)}
                    r={hover === p.index ? 5.5 : 3.5}
                    fill={s.color}
                    stroke="var(--surface)"
                    strokeWidth="2"
                  />
                ))}
              </g>
            ))}

            {labels.map((label, i) => (
              <g key={label}>
                {i % scale.labelEvery === 0 && (
                  <text
                    x={scale.x(i)}
                    y={CHART_HEIGHT - 8}
                    fill={
                      hover === i ? "var(--chart-label-active)" : "var(--chart-label)"
                    }
                    fontSize="12"
                    fontWeight="500"
                    textAnchor="middle"
                  >
                    {label}
                  </text>
                )}
                <rect
                  x={scale.x(i) - scale.stepX / 2}
                  y={PAD.top}
                  width={scale.stepX}
                  height={BASELINE - PAD.top}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                />
              </g>
            ))}
          </svg>
          {hover !== null && (
            <ChartTooltip
              title={labels[hover]}
              rows={rows}
              x={scale.x(hover)}
              chartWidth={width}
            />
          )}
        </div>
      )}
    </div>
  )
}
