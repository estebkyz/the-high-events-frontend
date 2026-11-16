import React from "react"
import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import { ArrowDownCircle, Package } from "lucide-react"
import type { PrestamoItem } from "../types"

interface PrestamoDetailDrawerProps {
  isOpen: boolean; onClose: () => void
  prestamo: PrestamoItem | null
  onOpenReturn: (prestamo: PrestamoItem) => void
}

export function PrestamoDetailDrawer({
  isOpen,
  onClose,
  prestamo,
  onOpenReturn,
}: PrestamoDetailDrawerProps) {
  if (!prestamo) return null

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="detail"
      title={`Préstamo ${prestamo.codigo}`}
      subtitle="Detalle completo del préstamo"
    >
      <div className="space-y-4 text-xs">
        {/* Header info */}
        <div className="p-3.5 bg-[#181B22] rounded-xl border border-[#262D3D] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-bold text-[#F1F5F9]">
              {prestamo.codigo}
            </span>
            <StatusBadge status={prestamo.estado} />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#7C3AED]/30 text-[#A78BFA] flex items-center justify-center font-bold text-sm shrink-0">
              {prestamo.responsable.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-[#F1F5F9] text-[13px]">
                {prestamo.responsable}
              </p>
              <p className="text-[#64748B] text-[11px]">
                Responsable del préstamo
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#262D3D]">
            <div>
              <span className="text-[#64748B] block mb-0.5">Evento</span>
              <span className="font-semibold text-[#F1F5F9]">
                {prestamo.evento}
              </span>
            </div>
            <div>
              <span className="text-[#64748B] block mb-0.5">Fecha Salida</span>
              <span className="font-semibold text-[#F1F5F9]">
                {prestamo.fechaSalida}
              </span>
            </div>
            <div>
              <span className="text-[#64748B] block mb-0.5">
                Devolución Esperada
              </span>
              <span className="font-semibold text-[#F1F5F9]">
                {prestamo.fechaDevolucion}
              </span>
            </div>
          </div>
        </div>

        {/* Equipment list */}
        <div>
          <h4 className="font-semibold text-[#F1F5F9] mb-3 text-[13px]">
            Equipos en Préstamo ({prestamo.equipos.length})
          </h4>
          <div className="space-y-2">
            {prestamo.equipos.map((eq) => (
              <div
                key={eq.id}
                className="flex items-center gap-3 p-2.5 bg-[#181B22] rounded-lg border border-[#262D3D]"
              >
                <div className="w-7 h-7 rounded bg-[#242830] border border-[#262D3D] flex items-center justify-center shrink-0">
                  <Package size={13} className="text-[#64748B]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#F1F5F9] text-[12px] leading-tight truncate">
                    {eq.nombre}
                  </p>
                  <p className="text-[10px] text-[#64748B]">{eq.serie}</p>
                </div>
                <StatusBadge
                  status={eq.condicionSalida}
                  className="text-[10px] px-2 shrink-0"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Registrar devolución */}
        {(prestamo.estado === "Activo" || prestamo.estado === "Con Retraso") && (
          <button
            onClick={() => onOpenReturn(prestamo)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold bg-[#10B981] text-white hover:bg-[#059669] transition-colors cursor-pointer"
          >
            <ArrowDownCircle size={16} />
            Registrar Devolución
          </button>
        )}
      </div>
    </Drawer>
  )
}
