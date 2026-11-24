import { StatusBadge } from "@/components/StatusBadge"
import type { Contratacion } from "../types"

export function ContratacionRow({ contratacion }: { contratacion: Contratacion }) {
  const details = [
    contratacion.fecha,
    contratacion.modalidadPago,
    contratacion.actaRecepcion && `Acta ${contratacion.actaRecepcion}`,
  ].filter(Boolean)

  return (
    <div className="py-2.5 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-[#F1F5F9]">{contratacion.evento}</p>
        <p className="text-[11px] text-[#94A3B8] mt-0.5">{details.join(" · ")}</p>
      </div>
      <div className="flex items-center gap-2.5 shrink-0">
        <span className="text-xs font-semibold text-[#10B981] tabular-nums">
          {contratacion.monto}
        </span>
        <StatusBadge status={contratacion.estado} />
      </div>
    </div>
  )
}
