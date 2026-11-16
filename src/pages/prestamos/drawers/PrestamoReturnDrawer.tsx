import React from "react"
import { Drawer } from "../../../components/Drawer"
import { CustomSelect } from "../../../components/CustomSelect"
import { ArrowDownCircle, Package } from "lucide-react"
import type { PrestamoItem } from "../types"

interface PrestamoReturnDrawerProps {
  isOpen: boolean; onClose: () => void
  prestamo: PrestamoItem | null
  returnConditions: Record<string, string>
  onConditionChange: (equipoId: string, value: string) => void
  returnDate: string
  onReturnDateChange: (date: string) => void
  returnObs: string
  onReturnObsChange: (obs: string) => void
  onConfirm: () => void
  onBackToView: () => void
}

const CONDICION_SELECT_OPTIONS = [
  { value: "Bueno", label: "Bueno" },
  { value: "Daño Leve", label: "Daño Leve" },
  { value: "Daño Mayor", label: "Daño Mayor" },
]

export function PrestamoReturnDrawer({
  isOpen,
  onClose,
  prestamo,
  returnConditions,
  onConditionChange,
  returnDate,
  onReturnDateChange,
  returnObs,
  onReturnObsChange,
  onConfirm,
  onBackToView,
}: PrestamoReturnDrawerProps) {
  if (!prestamo) return null

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      size="modal"
      title="Registrar Devolución"
      subtitle={prestamo.codigo}
    >
      <div className="space-y-5 text-xs">
        <div>
          <h4 className="font-semibold text-[#F1F5F9] text-[13px] mb-1">
            Condición al Retorno
          </h4>
          <p className="text-[#64748B] text-[11px]">
            Indica el estado de cada equipo al momento de la devolución.
          </p>
        </div>

        {prestamo.equipos.map((eq) => (
          <div
            key={eq.id}
            className="p-3 bg-[#181B22] rounded-lg border border-[#262D3D] space-y-2"
          >
            <div className="flex items-center gap-2">
              <Package size={13} className="text-[#64748B] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#F1F5F9] text-[12px] truncate">
                  {eq.nombre}
                </p>
                <p className="text-[10px] text-[#64748B]">{eq.serie}</p>
              </div>
            </div>
            <CustomSelect
              value={returnConditions[eq.id] ?? "Bueno"}
              onChange={(val) => onConditionChange(eq.id, val)}
              options={CONDICION_SELECT_OPTIONS}
            />
          </div>
        ))}

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider">
            Fecha de Retorno
          </label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => onReturnDateChange(e.target.value)}
            className="h-[40px] px-3.5 bg-[#181B22] border border-[#262D3D] rounded-lg text-[13px] text-[#F1F5F9] focus:outline-none focus:border-[#7C3AED]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider">
            Observaciones
          </label>
          <textarea
            value={returnObs}
            onChange={(e) => onReturnObsChange(e.target.value)}
            placeholder="Notas sobre el estado de retorno, incidencias..."
            rows={3}
            className="px-3.5 py-2.5 bg-[#181B22] border border-[#262D3D] rounded-lg text-[13px] text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED] resize-none"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#262D3D]">
          <button
            type="button"
            onClick={onBackToView}
            className="px-4 py-2 rounded-lg text-xs font-medium text-[#94A3B8] cursor-pointer hover:text-white"
          >
            Volver
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#10B981] text-white hover:bg-[#059669] transition-colors cursor-pointer"
          >
            <ArrowDownCircle size={14} />
            Confirmar Devolución
          </button>
        </div>
      </div>
    </Drawer>
  )
}
