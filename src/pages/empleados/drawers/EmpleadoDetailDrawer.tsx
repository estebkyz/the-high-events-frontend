import React from "react"
import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import { getEmpleadoFullName } from "../utils"
import type { EmpleadoItem, EstadoEmpleado } from "../types"

interface EmpleadoDetailDrawerProps {
  isOpen: boolean; onClose: () => void
  selectedEmp: EmpleadoItem | null
  onEdit: (emp: EmpleadoItem) => void
  onSetEstado: (id: string, estado: EstadoEmpleado) => void
}

export function EmpleadoDetailDrawer({
  isOpen,
  onClose,
  selectedEmp,
  onEdit,
  onSetEstado,
}: EmpleadoDetailDrawerProps) {
  if (!selectedEmp) return null

  const fullName = getEmpleadoFullName(selectedEmp)

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="detail"
      title={`Ficha Colaborador — ${fullName}`}
      subtitle="Información legal, cargo operativo, contacto y SST"
    >
      <div className="space-y-4">
        {/* Cabecera con avatar */}
        <div className="flex items-center gap-3.5 p-3.5 bg-[#111318] rounded-xl border border-[#262D3D]">
          <div className="w-11 h-11 rounded-xl bg-[#7C3AED]/20 text-[#A78BFA] flex items-center justify-center font-bold text-base shrink-0 border border-[#7C3AED]/30">
            {fullName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-[#F8FAFC] truncate">
              {fullName}
            </p>
            <p className="text-xs text-[#A78BFA] font-medium mt-0.5">
              {selectedEmp.cargo}
            </p>
            <div className="mt-2 flex gap-2">
              <StatusBadge status={selectedEmp.vinculacion || "Fijo"} />
              <StatusBadge status={selectedEmp.estado} />
            </div>
          </div>
        </div>

        {/* Metadatos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            {
              label: "Documento Legal",
              value: `${selectedEmp.tipo_documento} ${selectedEmp.numero_documento}`,
            },
            { label: "Teléfono", value: selectedEmp.telefono },
            { label: "Correo Electrónico", value: selectedEmp.correo },
            { label: "Vinculación", value: selectedEmp.vinculacion || "Fijo" },
          ].map((item) => (
            <div
              key={item.label}
              className="p-3 bg-[#111318] rounded-xl border border-[#262D3D]"
            >
              <p className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">
                {item.label}
              </p>
              <p className="text-xs text-[#F8FAFC] font-semibold mt-1 break-all">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Contacto de emergencia */}
        {selectedEmp.emergenciaNombre && (
          <div className="p-3.5 bg-[#111318] rounded-xl border border-[#262D3D] text-xs">
            <p className="text-[10px] text-[#A78BFA] uppercase tracking-wider font-semibold mb-1">
              Contacto de Emergencia / SST
            </p>
            <p className="text-sm text-[#F8FAFC] font-bold">
              {selectedEmp.emergenciaNombre}{" "}
              <span className="text-[#94A3B8] text-xs font-normal">
                ({selectedEmp.emergenciaParentesco || "Contacto"})
              </span>
            </p>
            <p className="text-xs text-[#94A3B8] mt-0.5 tabular-nums">
              {selectedEmp.emergenciaTel}
            </p>
          </div>
        )}

        {/* Cambiar Estado */}
        <div className="p-3.5 bg-[#111318] rounded-xl border border-[#262D3D] space-y-2">
          <p className="text-[10px] text-[#A78BFA] uppercase tracking-wider font-semibold">
            Cambiar Estado
          </p>
          <div className="flex gap-2">
            {(["Activo", "Inactivo"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSetEstado(selectedEmp.id, s)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors border cursor-pointer ${
                  selectedEmp.estado === s
                    ? s === "Activo"
                      ? "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40"
                      : "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40"
                    : "bg-[#181B22] text-[#94A3B8] border-[#262D3D] hover:bg-[#222734]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="pt-2 flex gap-3 border-t border-[#262D3D]">
          <button
            type="button"
            onClick={() => onEdit(selectedEmp)}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors cursor-pointer"
          >
            Editar Colaborador
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] bg-[#181B22] border border-[#262D3D] hover:bg-[#222734] transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Drawer>
  )
}
