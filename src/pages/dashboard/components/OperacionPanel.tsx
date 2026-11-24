import { PANEL } from "../constants"
import type { OperacionResumen } from "../types"

const SEGMENTS = [
  { key: "ok", label: "Resuelto", color: "bg-[#10B981]" },
  { key: "enCurso", label: "En curso", color: "bg-[#F59E0B]" },
  { key: "alerta", label: "Alerta", color: "bg-[#EF4444]" },
] as const

interface OperacionPanelProps {
  resumen: OperacionResumen[]
}

export function OperacionPanel({ resumen }: OperacionPanelProps) {
  return (
    <section className={PANEL}>
      <h2 className="text-[15px] font-semibold text-[#F8FAFC]">Operación</h2>
      <p className="text-[12px] text-[#94A3B8] mb-4">Cumplimiento por módulo</p>
      <ul className="space-y-4">
        {resumen.map((item) => {
          const total = item.ok + item.enCurso + item.alerta
          return (
            <li key={item.categoria} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#F1F5F9]">{item.categoria}</span>
                <span className="text-[11px] text-[#94A3B8] tabular-nums">
                  {item.ok} / {total}
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#111318] rounded-full overflow-hidden flex">
                {SEGMENTS.map(({ key, label, color }) => (
                  <div
                    key={key}
                    title={`${label}: ${item[key]}`}
                    className={color}
                    style={{ width: total > 0 ? `${(item[key] / total) * 100}%` : 0 }}
                  />
                ))}
              </div>
            </li>
          )
        })}
      </ul>
      <ul className="flex flex-wrap gap-4 pt-3 mt-4 border-t border-[#262D3D] text-[11px] text-[#94A3B8]">
        {SEGMENTS.map(({ key, label, color }) => (
          <li key={key} className="flex items-center gap-1.5">
            <span aria-hidden="true" className={`w-2.5 h-2.5 rounded-sm ${color}`} />
            {label}
          </li>
        ))}
      </ul>
    </section>
  )
}
