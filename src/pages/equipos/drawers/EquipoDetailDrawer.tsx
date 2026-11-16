import React from "react"
import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import { CustomSelect } from "../../../components/CustomSelect"
import { getCategoryIcon } from "../components/CategoryIcon"
import { MAINTENANCE_HISTORY, ESTADO_OPERATIVO_OPTIONS } from "../data"
import type { EquipoItem, EstadoOperativo } from "../types"

interface EquipoDetailDrawerProps {
  isOpen: boolean; onClose: () => void
  equipo: EquipoItem | null
  selectedEstado: EstadoOperativo
  setSelectedEstado: (estado: EstadoOperativo) => void
  onApplyEstado: (id: string, estado: EstadoOperativo) => void
}

const ESTADO_SELECT_OPTIONS = ESTADO_OPERATIVO_OPTIONS.map((e) => ({
  value: e,
  label: e,
}))

export function EquipoDetailDrawer({
  isOpen,
  onClose,
  equipo,
  selectedEstado,
  setSelectedEstado,
  onApplyEstado,
}: EquipoDetailDrawerProps) {
  if (!equipo) return null

  const history = MAINTENANCE_HISTORY[equipo.id] ?? []

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="detail"
      title="Detalle de Equipo"
      subtitle={equipo.serie}
    >
      <div className="space-y-4 text-xs">
        {/* Photo area + name */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#242830] border border-[#262D3D] flex items-center justify-center shrink-0">
            {getCategoryIcon(equipo.categoria, 22)}
          </div>
          <div className="min-w-0">
            <h2 className="text-[15px] font-bold text-[#F1F5F9] leading-tight">
              {equipo.nombre}
            </h2>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#7C3AED]/15 text-[#A78BFA] border border-[#7C3AED]/30">
              {equipo.categoria}
            </span>
            <p className="text-[#64748B] text-[11px] mt-1">
              Serie: {equipo.serie}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-[#181B22] rounded-lg border border-[#262D3D]">
            <span className="text-[#64748B] block mb-1.5 text-[11px]">
              Estado Operativo
            </span>
            <StatusBadge status={equipo.estadoOperativo} />
          </div>
          <div className="p-3 bg-[#181B22] rounded-lg border border-[#262D3D]">
            <span className="text-[#64748B] block mb-1.5 text-[11px]">
              Propiedad
            </span>
            <StatusBadge status={equipo.propiedad} />
          </div>
          <div className="p-3 bg-[#181B22] rounded-lg border border-[#262D3D] col-span-2">
            <span className="text-[#64748B] block mb-1 text-[11px]">
              Proveedor Asociado (id_proveedor)
            </span>
            {equipo.propiedad === "Alquilado" ? (
              <div>
                <span className="font-semibold text-[#F1F5F9] text-[13px]">
                  {equipo.proveedor_nombre || "Proveedor externo"}
                </span>
                <p className="text-[11px] text-[#60A5FA] mt-1">
                  Aplica Formato Digital de Entrega y Recepción con evidencias fotográficas (montaje y desmontaje).
                </p>
              </div>
            ) : (
              <span className="font-medium text-[#94A3B8] text-[12px]">
                Ninguno (id_proveedor = NULL · Activo Propio de The High Events)
              </span>
            )}
          </div>
          {equipo.costo_adquisicion ? (
            <div className="p-3 bg-[#181B22] rounded-lg border border-[#262D3D]">
              <span className="text-[#64748B] block mb-1 text-[11px]">
                Costo Adquisición
              </span>
              <span className="font-semibold text-[#10B981] text-[12px]">
                {equipo.costo_adquisicion.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
              </span>
            </div>
          ) : null}
          {equipo.costo_alquiler_dia ? (
            <div className="p-3 bg-[#181B22] rounded-lg border border-[#262D3D]">
              <span className="text-[#64748B] block mb-1 text-[11px]">
                Costo Alquiler / Día
              </span>
              <span className="font-semibold text-[#F59E0B] text-[12px]">
                {equipo.costo_alquiler_dia.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
              </span>
            </div>
          ) : null}
          {equipo.mantenimiento_proximo ? (
            <div className="p-3 bg-[#181B22] rounded-lg border border-[#262D3D] col-span-2">
              <span className="text-[#64748B] block mb-1 text-[11px]">
                Próximo Mantenimiento Programado
              </span>
              <span className="font-semibold text-[#F1F5F9] text-[12px]">
                {equipo.mantenimiento_proximo}
              </span>
            </div>
          ) : null}
        </div>

        {/* Maintenance history */}
        <div>
          <h4 className="font-semibold text-[#F1F5F9] mb-3 text-[13px]">
            Historial de Mantenimiento
          </h4>
          {history.length === 0 ? (
            <p className="text-[#64748B] italic text-[12px]">
              Sin historial registrado.
            </p>
          ) : (
            <div className="space-y-3 border-l-2 border-[#262D3D] pl-4 ml-1">
              {history.map((entry, i) => (
                <div key={i} className="relative">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] absolute -left-[21px] top-0.5 border-2 border-[#181B22]" />
                  <p className="font-medium text-[#F1F5F9] text-[12px]">
                    {entry.descripcion}
                  </p>
                  <p className="text-[10px] text-[#64748B] mt-0.5">
                    {entry.fecha} · {entry.tecnico}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cambiar Estado */}
        <div className="p-4 bg-[#181B22] rounded-xl border border-[#262D3D] space-y-3">
          <h4 className="font-semibold text-[#F1F5F9] text-[13px]">
            Cambiar Estado Operativo
          </h4>
          <CustomSelect
            value={selectedEstado}
            onChange={(val) => setSelectedEstado(val as EstadoOperativo)}
            options={ESTADO_SELECT_OPTIONS}
          />
          <button
            type="button"
            onClick={() => {
              onApplyEstado(equipo.id, selectedEstado)
              onClose()
            }}
            className="w-full py-2 rounded-lg text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors cursor-pointer"
          >
            Aplicar Cambio
          </button>
        </div>
      </div>
    </Drawer>
  )
}
