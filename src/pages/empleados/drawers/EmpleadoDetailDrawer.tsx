import React from "react"
import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import {
  DetailHeader,
  DetailSection,
  DetailGrid,
  DetailField,
} from "../../../components/detail"
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
      footer={
        <div className="flex gap-3">
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
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-[#F1F5F9] bg-[#181B22] border border-[#262D3D] hover:bg-[#222734] transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <DetailHeader
          badges={
            <>
              <StatusBadge status={selectedEmp.vinculacion || "Fijo"} />
              <StatusBadge status={selectedEmp.estado} />
            </>
          }
          title={
            <span className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 text-[#A78BFA] flex items-center justify-center font-bold text-sm shrink-0 border border-[#7C3AED]/30"
              >
                {fullName.charAt(0)}
              </span>
              <span className="truncate">{fullName}</span>
            </span>
          }
          subtitle={selectedEmp.cargo}
        />

        <DetailSection title="Información General" noBorder>
          <DetailGrid>
            <DetailField
              label="Documento Legal"
              value={`${selectedEmp.tipo_documento} ${selectedEmp.numero_documento}`}
            />
            <DetailField
              label="Teléfono"
              value={selectedEmp.telefono}
              valueClassName="tabular-nums"
            />
            <DetailField
              label="Correo Electrónico"
              value={selectedEmp.correo}
              span={2}
              valueClassName="break-all"
            />
            <DetailField
              label="Vinculación"
              value={selectedEmp.vinculacion || "Fijo"}
            />
          </DetailGrid>
        </DetailSection>

        {selectedEmp.emergenciaNombre && (
          <DetailSection title="Contacto de Emergencia / SST">
            <DetailGrid>
              <DetailField
                label="Nombre"
                value={selectedEmp.emergenciaNombre}
              />
              <DetailField
                label="Parentesco"
                value={selectedEmp.emergenciaParentesco || "Contacto"}
              />
              <DetailField
                label="Teléfono"
                value={selectedEmp.emergenciaTel}
                valueClassName="tabular-nums"
              />
            </DetailGrid>
          </DetailSection>
        )}

        <DetailSection title="Cambiar Estado">
          <div className="flex gap-2">
            {(["Activo", "Inactivo"] as const).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={selectedEmp.estado === s}
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
        </DetailSection>
      </div>
    </Drawer>
  )
}
