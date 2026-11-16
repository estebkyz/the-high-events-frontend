import React from "react"
import type { ChartSeries, ChartReference } from "../types"
import { ChartLegend } from "./ChartLegend"
import { LineChart } from "./LineChart"

interface ChartCardProps {
  title: string; subtitle: string
  labels: string[]
  series: ChartSeries[]
  reference?: ChartReference
  ariaLabel: string
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  labels,
  series,
  reference,
  ariaLabel,
}) => {
  return (
    <div className="bg-[#181B22] border border-[#262D3D] rounded-2xl p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-[15px] font-semibold text-[#F8FAFC]">{title}</h2>
          <p className="text-[12px] text-[#94A3B8]">{subtitle}</p>
        </div>
        <ChartLegend series={series} reference={reference} />
      </div>
      <LineChart
        labels={labels}
        series={series}
        reference={reference}
        ariaLabel={ariaLabel}
      />
    </div>
  )
}
