import React, { useId, useState } from "react"
import type { ChartSeries, ChartReference } from "../types"
import { niceScale, formatCOP } from "../utils"

interface LineChartProps {
  labels: string[]; series: ChartSeries[]
  reference?: ChartReference
  ariaLabel: string
}

export const LineChart: React.FC<LineChartProps> = ({
  labels,
  series,
  reference,
  ariaLabel,
}) => {
  const width = 660
  const height = 220
  const pl = 56
  const pr = 24
  const pt = 16
  const pb = 32
  const chartW = width - pl - pr
  const chartH = height - pt - pb
  const n = labels.length

  const gradId = `grad-${useId().replace(/:/g, "")}`
  const [hover, setHover] = useState<number | null>(null)

  const maxVal = Math.max(
    reference?.value ?? 0,
    ...series.flatMap((s) => s.values),
    0,
  )
  const { top, step, intervals } = niceScale(maxVal)
  const levels = Array.from({ length: intervals + 1 }, (_, i) => i * step)

  const getX = (i: number) =>
    n > 1 ? pl + (i / (n - 1)) * chartW : pl + chartW / 2
  const getY = (v: number) => pt + chartH - (v / top) * chartH
  const colW = n > 1 ? chartW / (n - 1) : chartW

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      setHover((h) => (h === null ? 0 : Math.min(n - 1, h + 1)))
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      setHover((h) => (h === null ? n - 1 : Math.max(0, h - 1)))
    } else if (e.key === "Escape") {
      setHover(null)
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="relative min-w-[520px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`${ariaLabel}. Usa las flechas izquierda y derecha para ver cada valor.`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onBlur={() => setHover(null)}
          onMouseLeave={() => setHover(null)}
          className="w-full h-auto overflow-visible select-none rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/60"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={series[0]?.color}
                stopOpacity="0.22"
              />
              <stop
                offset="100%"
                stopColor={series[0]?.color}
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {/* Guías horizontales */}
          {levels.map((val) => {
            const y = getY(val)
            return (
              <g key={val}>
                <line
                  x1={pl}
                  y1={y}
                  x2={width - pr}
                  y2={y}
                  stroke="var(--chart-grid, #262D3D)"
                  strokeDasharray="3 3"
                />
                <text
                  x={pl - 10}
                  y={y + 3.5}
                  fill="var(--chart-axis, #94A3B8)"
                  fontSize="10.5"
                  fontWeight="500"
                  textAnchor="end"
                  fontFamily="Inter, sans-serif"
                >
                  $ {val.toLocaleString("es-CO")}M
                </text>
              </g>
            )
          })}

          {/* Área bajo la serie principal */}
          {series[0]?.area && n > 1 && (
            <polygon
              fill={`url(#${gradId})`}
              points={`${getX(0)},${getY(0)} ${series[0].values
                .map((v, i) => `${getX(i)},${getY(v)}`)
                .join(" ")} ${getX(n - 1)},${getY(0)}`}
            />
          )}

          {/* Línea de referencia (meta) */}
          {reference && (
            <g>
              <line
                x1={pl}
                y1={getY(reference.value)}
                x2={width - pr}
                y2={getY(reference.value)}
                stroke="var(--chart-ref, #CBD5E1)"
                strokeOpacity="0.65"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              <text
                x={width - pr}
                y={getY(reference.value) - 6}
                fill="var(--chart-ref, #CBD5E1)"
                fontSize="10.5"
                fontWeight="600"
                textAnchor="end"
                fontFamily="Inter, sans-serif"
              >
                {reference.label}
              </text>
            </g>
          )}

          {/* Cursor vertical */}
          {hover !== null && (
            <line
              x1={getX(hover)}
              y1={pt}
              x2={getX(hover)}
              y2={pt + chartH}
              stroke="var(--chart-axis, #94A3B8)"
              strokeOpacity="0.5"
              strokeDasharray="2 3"
            />
          )}

          {/* Líneas: la principal se dibuja al final para quedar encima */}
          {[...series].reverse().map((s) => (
            <polyline
              key={s.name}
              fill="none"
              stroke={s.color}
              strokeWidth={s.strong ? 2.75 : 2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              points={s.values.map((v, i) => `${getX(i)},${getY(v)}`).join(" ")}
            />
          ))}

          {/* Puntos */}
          {labels.map((label, i) => (
            <g key={label}>
              {series.map((s) => (
                <circle
                  key={s.name}
                  cx={getX(i)}
                  cy={getY(s.values[i] ?? 0)}
                  r={hover === i ? 5.5 : s.strong ? 4 : 3.5}
                  fill={s.color}
                  stroke="var(--section-bg, #181B22)"
                  strokeWidth="2"
                />
              ))}
            </g>
          ))}

          {/* Eje X */}
          {labels.map((label, i) => (
            <text
              key={label}
              x={getX(i)}
              y={height - 8}
              fill={
                hover === i
                  ? "var(--chart-label-active, #F8FAFC)"
                  : "var(--chart-label, #CBD5E1)"
              }
              fontSize="11"
              fontWeight="500"
              textAnchor="middle"
              fontFamily="Inter, sans-serif"
            >
              {label}
            </text>
          ))}

          {/* Zonas de hover (una por columna) */}
          {labels.map((label, i) => (
            <rect
              key={label}
              x={getX(i) - colW / 2}
              y={pt}
              width={colW}
              height={chartH}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
          ))}
        </svg>

        {/* Tooltip */}
        {hover !== null && (
          <div
            className="pointer-events-none absolute top-0 z-10 min-w-[150px] rounded-lg border border-[#2D3748] bg-[#0F1117] px-3 py-2 text-[11px] shadow-xl"
            style={{
              left: `${(getX(hover) / width) * 100}%`,
              transform:
                hover === 0
                  ? "translateX(0)"
                  : hover === n - 1
                    ? "translateX(-100%)"
                    : "translateX(-50%)",
            }}
          >
            <p className="font-medium text-[#F8FAFC] mb-1">{labels[hover]}</p>
            {series.map((s) => (
              <p
                key={s.name}
                className="flex items-center justify-between gap-3 text-[#CBD5E1]"
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: s.color }}
                  />
                  {s.name}
                </span>
                <span className="font-medium text-[#F8FAFC] tabular-nums">
                  {formatCOP((s.values[hover] ?? 0) * 1_000_000)}
                </span>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
