import { useState } from "react"
import { SegmentedControl } from "@/components/SegmentedControl"
import { todayISO } from "@/utils/format"
import { COMPARATIVO_OPTIONS, getComparativo, type ComparativoId } from "../comparativos"
import { PANEL } from "../constants"
import type { DashboardData } from "../metrics"
import type { ViewState } from "../types"
import { LineChart } from "./LineChart"
import { PanelBody } from "./PanelBody"

interface ComparativoCardProps {
  data: DashboardData
  /** Fecha elegida: define el mes y la semana que se comparan. */
  anchor: string
  state: Record<ComparativoId, ViewState>
}

/** Una gráfica con dos lecturas: cobros del mes y ventas de la semana. */
export function ComparativoCard({ data, anchor, state }: ComparativoCardProps) {
  const [id, setId] = useState<ComparativoId>("cobrado")
  const { title, subtitle, labels, series } = getComparativo(id, data, anchor, todayISO())

  return (
    <section className={PANEL}>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 mb-3">
        <div>
          <h2 className="text-[14px] font-semibold text-ink" aria-live="polite">
            {title}
          </h2>
          <p className="text-xs text-ink-muted">{subtitle}</p>
        </div>
        <SegmentedControl
          label="Gráfica"
          value={id}
          options={COMPARATIVO_OPTIONS}
          onChange={(val) => setId(val as ComparativoId)}
        />
      </div>
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3 text-xs text-ink-soft">
        {series.map((s) => (
          <li key={s.name} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={`w-4 border-t-2 ${s.dashed ? "border-dashed" : ""}`}
              style={{ borderColor: s.color }}
            />
            <span className="inline-block first-letter:uppercase">{s.name}</span>
          </li>
        ))}
      </ul>
      <PanelBody state={state[id]} skeleton="h-[240px]">
        {/* La clave descarta el punto señalado al cambiar de gráfica. */}
        <LineChart key={id} labels={labels} series={series} ariaLabel={title} />
      </PanelBody>
    </section>
  )
}
