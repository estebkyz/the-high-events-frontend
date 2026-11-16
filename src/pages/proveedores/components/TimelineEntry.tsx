import React from "react"
import { Clock, ClipboardCheck, Wallet } from "lucide-react"
import { StatusBadge } from "../../../components/StatusBadge"
import type { Contratacion } from "../types"

interface TimelineEntryProps {
  entry: Contratacion
}

export const TimelineEntry: React.FC<TimelineEntryProps> = ({ entry }) => {
  const isCompleted = entry.estado === "Completado"
  return (
    <div className="relative pl-6">
      <div
        className="absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 flex items-center justify-center"
        style={{
          borderColor: isCompleted ? "#10B981" : "#F59E0B",
          backgroundColor: isCompleted ? "#10B981" : "#F59E0B",
        }}
      >
        <div className="w-1 h-1 rounded-full bg-[#111318]" />
      </div>
      <div className="absolute left-1.5 top-4 bottom-0 w-px bg-[#2D3748]" />

      <div className="pb-5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-bold text-[#F1F5F9] leading-tight">
            {entry.evento}
          </p>
          <StatusBadge status={entry.estado} />
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-[11px] text-[#64748B] flex items-center gap-1">
            <Clock size={11} />
            {entry.fecha}
          </span>
          <span className="text-[12px] font-bold text-[#10B981]">
            {entry.monto}
          </span>
        </div>
        {(entry.modalidadPago || entry.actaRecepcion) && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {entry.modalidadPago && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25">
                <Wallet size={10} />
                {entry.modalidadPago}
              </span>
            )}
            {entry.actaRecepcion && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#3B82F6]/10 text-[#60A5FA] border border-[#3B82F6]/25">
                <ClipboardCheck size={10} />
                Acta: {entry.actaRecepcion}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

