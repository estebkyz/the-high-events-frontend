import React from "react"
import type { ChartSeries, ChartReference } from "../types"

interface ChartLegendProps {
  series: ChartSeries[]
  reference?: ChartReference
}

export const ChartLegend: React.FC<ChartLegendProps> = ({
  series,
  reference,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#CBD5E1]">
      {series.map((s) => (
        <span key={s.name} className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: s.color }}
          />
          {s.name}
        </span>
      ))}
      {reference && (
        <span className="flex items-center gap-1.5">
          <span className="w-4 border-t-2 border-dashed border-[#CBD5E1]/70" />
          {reference.label}
        </span>
      )}
    </div>
  )
}
