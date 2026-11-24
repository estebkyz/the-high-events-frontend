import { useId, useState, type KeyboardEvent } from "react"
import { formatCOP } from "@/utils/format"
import { niceScale } from "../metrics"
import type { ChartSeries } from "../types"

interface LineChartProps {
  labels: string[]
  series: ChartSeries[]
  ariaLabel: string
}

const WIDTH = 660
const HEIGHT = 220
const PAD = { left: 56, right: 24, top: 16, bottom: 32 }
const CHART_W = WIDTH - PAD.left - PAD.right
const CHART_H = HEIGHT - PAD.top - PAD.bottom

/** Eje compacto: `$ 12,5 M`. */
function formatAxis(value: number): string {
  return `$ ${(value / 1_000_000).toLocaleString("es-CO", { maximumFractionDigits: 1 })} M`
}

export function LineChart({ labels, series, ariaLabel }: LineChartProps) {
  const gradientId = useId()
  const [hover, setHover] = useState<number | null>(null)
  const count = labels.length

  const { top, step, intervals } = niceScale(
    Math.max(0, ...series.flatMap((s) => s.values)),
  )
  const levels = Array.from({ length: intervals + 1 }, (_, i) => i * step)
  const stepX = count > 1 ? CHART_W / (count - 1) : CHART_W
  const getX = (i: number) => PAD.left + (count > 1 ? i * stepX : CHART_W / 2)
  const getY = (value: number) => PAD.top + CHART_H - (value / top) * CHART_H
  const toPoints = (values: number[]) =>
    values.map((value, i) => `${getX(i)},${getY(value)}`).join(" ")

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") setHover(null)
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
    e.preventDefault()
    const delta = e.key === "ArrowRight" ? 1 : -1
    setHover((current) => {
      if (current === null) return delta > 0 ? 0 : count - 1
      return Math.min(count - 1, Math.max(0, current + delta))
    })
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="relative min-w-[520px]">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={`${ariaLabel}. Usa las flechas izquierda y derecha para ver cada valor.`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onBlur={() => setHover(null)}
          onMouseLeave={() => setHover(null)}
          className="w-full h-auto overflow-visible select-none rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/60"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={series[0]?.color} stopOpacity="0.22" />
              <stop offset="100%" stopColor={series[0]?.color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {levels.map((level) => (
            <g key={level}>
              <line
                x1={PAD.left}
                y1={getY(level)}
                x2={WIDTH - PAD.right}
                y2={getY(level)}
                stroke="var(--chart-grid)"
                strokeDasharray="3 3"
              />
              <text
                x={PAD.left - 10}
                y={getY(level) + 3.5}
                fill="var(--chart-axis)"
                fontSize="10.5"
                fontWeight="500"
                textAnchor="end"
              >
                {formatAxis(level)}
              </text>
            </g>
          ))}

          {series[0]?.area && count > 1 && (
            <polygon
              fill={`url(#${gradientId})`}
              points={`${getX(0)},${getY(0)} ${toPoints(series[0].values)} ${getX(count - 1)},${getY(0)}`}
            />
          )}

          {hover !== null && (
            <line
              x1={getX(hover)}
              y1={PAD.top}
              x2={getX(hover)}
              y2={PAD.top + CHART_H}
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
                strokeWidth={s.strong ? 2.75 : 2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                points={toPoints(s.values)}
              />
              {s.values.map((value, i) => (
                <circle
                  key={labels[i]}
                  cx={getX(i)}
                  cy={getY(value)}
                  r={hover === i ? 5.5 : 3.5}
                  fill={s.color}
                  stroke="var(--section-bg)"
                  strokeWidth="2"
                />
              ))}
            </g>
          ))}

          {labels.map((label, i) => (
            <g key={label}>
              <text
                x={getX(i)}
                y={HEIGHT - 8}
                fill={hover === i ? "var(--chart-label-active)" : "var(--chart-label)"}
                fontSize="11"
                fontWeight="500"
                textAnchor="middle"
              >
                {label}
              </text>
              <rect
                x={getX(i) - stepX / 2}
                y={PAD.top}
                width={stepX}
                height={CHART_H}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
              />
            </g>
          ))}
        </svg>

        {hover !== null && (
          <div
            role="status"
            className="pointer-events-none absolute top-0 z-10 min-w-[150px] rounded-lg border border-[#2D3748] bg-[#0F1117] px-3 py-2 text-[11px] shadow-xl"
            style={{
              left: `${(getX(hover) / WIDTH) * 100}%`,
              transform: `translateX(${hover === 0 ? "0" : hover === count - 1 ? "-100%" : "-50%"})`,
            }}
          >
            <p className="font-medium text-[#F8FAFC] mb-1">{labels[hover]}</p>
            {series.map((s) => (
              <p key={s.name} className="flex justify-between gap-3 text-[#CBD5E1]">
                {s.name}
                <span className="font-medium text-[#F8FAFC] tabular-nums">
                  {formatCOP(s.values[hover])}
                </span>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
