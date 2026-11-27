import { formatCOP } from "@/utils/format"
import { PANEL } from "../constants"
import type { ModalidadResumen, ViewState } from "../types"
import { PanelBody } from "./PanelBody"

interface ModalidadPanelProps {
  modalidades: ModalidadResumen[]
  state: ViewState
}

export function ModalidadPanel({ modalidades, state }: ModalidadPanelProps) {
  const total = modalidades.reduce((sum, m) => sum + m.cantidad, 0)
  const percent = (cantidad: number) =>
    total > 0 ? Math.round((cantidad / total) * 100) : 0

  return (
    <section className={PANEL}>
      <h2 className="text-[14px] font-semibold text-ink">Eventos por modalidad</h2>
      <p className="text-xs text-ink-muted mb-4 tabular-nums">
        {state === "ready"
          ? `${total} ${total === 1 ? "evento" : "eventos"} en el período`
          : "En el período"}
      </p>
      <PanelBody state={state} skeleton="h-[120px]">
        <div
          aria-hidden="true"
          className="w-full h-3 bg-fill rounded-full overflow-hidden flex gap-0.5"
        >
          {modalidades
            .filter((m) => m.cantidad > 0)
            .map((m) => (
              <div
                key={m.label}
                style={{
                  width: `${(m.cantidad / total) * 100}%`,
                  backgroundColor: m.color,
                }}
              />
            ))}
        </div>
        <ul className="space-y-3 mt-4">
          {modalidades.map((m) => (
            <li
              key={m.label}
              className="flex flex-wrap items-center justify-between gap-x-2 text-xs"
            >
              <span className="flex items-center gap-2 text-ink-soft">
                <span
                  aria-hidden="true"
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: m.color }}
                />
                {m.label}
              </span>
              <span className="tabular-nums text-ink-muted">
                <strong className="text-ink">{m.cantidad}</strong> ({percent(m.cantidad)}
                %) · {formatCOP(m.presupuesto)}
              </span>
            </li>
          ))}
        </ul>
      </PanelBody>
    </section>
  )
}
