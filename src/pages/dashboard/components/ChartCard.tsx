import { PANEL } from "../constants"
import type { ChartSeries } from "../types"
import { LineChart } from "./LineChart"

interface ChartCardProps {
  title: string
  subtitle: string
  labels: string[]
  series: ChartSeries[]
}

export function ChartCard({ title, subtitle, labels, series }: ChartCardProps) {
  return (
    <section className={PANEL}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-[15px] font-semibold text-[#F8FAFC]">{title}</h2>
          <p className="text-[12px] text-[#94A3B8]">{subtitle}</p>
        </div>
        <ul className="flex flex-wrap items-center gap-4 text-[12px] text-[#CBD5E1]">
          {series.map((s) => (
            <li key={s.name} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: s.color }}
              />
              {s.name}
            </li>
          ))}
        </ul>
      </div>
      <LineChart labels={labels} series={series} ariaLabel={`${title}. ${subtitle}`} />
    </section>
  )
}
