import { formatCOP } from "@/utils/format"
import { PANEL } from "../constants"
import type { ModalidadResumen } from "../types"

const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface ModalidadPanelProps {
  modalidades: ModalidadResumen[]
}

export function ModalidadPanel({ modalidades }: ModalidadPanelProps) {
  const total = modalidades.reduce((sum, m) => sum + m.cantidad, 0)
  const share = (cantidad: number) => (total > 0 ? cantidad / total : 0)
  const segments = modalidades.map((modalidad, index) => ({
    ...modalidad,
    length: share(modalidad.cantidad) * CIRCUMFERENCE,
    offset:
      share(modalidades.slice(0, index).reduce((sum, m) => sum + m.cantidad, 0)) *
      CIRCUMFERENCE,
  }))

  return (
    <section className={PANEL}>
      <h2 className="text-[15px] font-semibold text-[#F8FAFC]">Eventos por modalidad</h2>
      <p className="text-[12px] text-[#94A3B8] mb-4">En el período</p>
      <div className="relative w-36 h-36 mx-auto">
        <svg
          viewBox="0 0 140 140"
          role="img"
          aria-label={modalidades.map((m) => `${m.label}: ${m.cantidad}`).join(", ")}
          className="w-full h-full -rotate-90"
        >
          <circle
            cx="70"
            cy="70"
            r={RADIUS}
            fill="none"
            stroke="var(--chart-grid)"
            strokeWidth="16"
          />
          {segments.map((segment) => (
            <circle
              key={segment.label}
              cx="70"
              cy="70"
              r={RADIUS}
              fill="none"
              stroke={segment.color}
              strokeWidth="16"
              strokeDasharray={`${segment.length} ${CIRCUMFERENCE}`}
              strokeDashoffset={-segment.offset}
            />
          ))}
        </svg>
        <p className="absolute inset-0 flex flex-col items-center justify-center text-[22px] font-bold text-[#F8FAFC] leading-none">
          {total}
          <span className="text-[10px] font-normal text-[#94A3B8] mt-1">Eventos</span>
        </p>
      </div>
      <ul className="space-y-2.5 mt-4 pt-3 border-t border-[#262D3D]">
        {modalidades.map((m) => (
          <li key={m.label} className="flex items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-2 text-[#CBD5E1]">
              <span
                aria-hidden="true"
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: m.color }}
              />
              {m.label}
            </span>
            <span className="tabular-nums text-[#94A3B8]">
              <strong className="text-[#F8FAFC]">{m.cantidad}</strong> ·{" "}
              {formatCOP(m.presupuesto)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
