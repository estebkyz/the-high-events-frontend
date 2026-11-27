import { PANEL } from "../constants"
import type { OperacionResumen, ViewState } from "../types"
import { PanelBody } from "./PanelBody"

const SEGMENTS = [
  { key: "ok", label: "Resuelto", color: "bg-[var(--chart-ok)]" },
  { key: "enCurso", label: "En curso", color: "bg-[var(--chart-warn)]" },
  { key: "alerta", label: "Alerta", color: "bg-[var(--chart-alert)]" },
] as const

interface OperacionPanelProps {
  resumen: OperacionResumen[]
  state: ViewState
}

export function OperacionPanel({ resumen, state }: OperacionPanelProps) {
  return (
    <section className={`${PANEL} @container`}>
      <h2 className="text-[14px] font-semibold text-ink">Operación</h2>
      <p className="text-xs text-ink-muted mb-4">Cumplimiento por módulo</p>
      <PanelBody state={state} skeleton="h-[60px]">
        <ul className="grid gap-x-8 gap-y-4 @md:grid-cols-2 @3xl:grid-cols-4">
          {resumen.map((item) => {
            const total = item.ok + item.enCurso + item.alerta
            return (
              <li key={item.categoria} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-ink">{item.categoria}</span>
                  <span className="text-xs text-ink-muted tabular-nums">
                    {item.ok} / {total}
                  </span>
                </div>
                <div
                  aria-hidden="true"
                  className="w-full h-2.5 bg-fill rounded-full overflow-hidden flex gap-0.5"
                >
                  {SEGMENTS.filter(({ key }) => item[key] > 0).map(({ key, color }) => (
                    <div
                      key={key}
                      className={color}
                      style={{ width: `${(item[key] / total) * 100}%` }}
                    />
                  ))}
                </div>
                <ul className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-ink-muted tabular-nums">
                  {SEGMENTS.filter(({ key }) => item[key] > 0).map(
                    ({ key, label, color }) => (
                      <li key={key} className="flex items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className={`size-2 rounded-sm ${color}`}
                        />
                        {label} {item[key]}
                      </li>
                    ),
                  )}
                  {total === 0 && <li>Sin registros</li>}
                </ul>
              </li>
            )
          })}
        </ul>
      </PanelBody>
    </section>
  )
}
