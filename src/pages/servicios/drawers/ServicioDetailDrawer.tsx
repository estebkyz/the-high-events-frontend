import React from "react"
import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import { Tag, DollarSign, FileText, Edit2, Clock, Truck } from "lucide-react"
import { TIPO_COBRO_LABELS, type ServicioItem } from "../types"
import { INITIAL_PROVIDERS } from "../../proveedores/data"

interface ServicioDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  service: ServicioItem | null
  onOpenEdit: (service: ServicioItem) => void
}

export function ServicioDetailDrawer({
  isOpen,
  onClose,
  service,
  onOpenEdit,
}: ServicioDetailDrawerProps) {
  if (!service) return null

  const linkedProviders = INITIAL_PROVIDERS.filter(
    (p) =>
      p.estado === "Activo" &&
      p.servicios.some(
        (srv) =>
          srv.toLowerCase().includes(service.categoria.toLowerCase()) ||
          service.categoria.toLowerCase().includes(srv.toLowerCase()) ||
          service.nombre.toLowerCase().includes(srv.toLowerCase()),
      ),
  )

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="detail"
      title="Detalle de servicio"
    >
      <div className="space-y-4 text-xs">
        {/* Header / Badges */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#262D3D]">
          <div>
            <h3 className="text-[15px] font-bold text-[#F1F5F9]">
              {service.nombre}
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Categoría:{" "}
              <span className="text-[#A78BFA] font-semibold">
                {service.categoria}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={service.estado} />
          </div>
        </div>

        {/* General Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-3 bg-[#111318] border border-[#262D3D] rounded-xl">
            <p className="text-[#64748B] text-[10px] uppercase tracking-wider flex items-center gap-1 font-semibold">
              <Tag size={12} /> Categoría
            </p>
            <p className="font-semibold text-[#F1F5F9] text-[13px] mt-1">
              {service.categoria}
            </p>
          </div>
          <div className="p-3 bg-[#111318] border border-[#262D3D] rounded-xl">
            <p className="text-[#64748B] text-[10px] uppercase tracking-wider flex items-center gap-1 font-semibold">
              <Clock size={12} /> Modalidad Cobro
            </p>
            <p className="font-semibold text-[#A78BFA] text-[13px] mt-1">
              {TIPO_COBRO_LABELS[service.tipo_cobro] || service.tipo_cobro}
            </p>
          </div>
          <div className="p-3 bg-[#111318] border border-[#262D3D] rounded-xl sm:col-span-2">
            <p className="text-[#64748B] text-[10px] uppercase tracking-wider flex items-center gap-1 font-semibold">
              <DollarSign size={12} /> Tarifa Base
            </p>
            <p className="font-bold text-[#10B981] text-[15px] mt-1">
              {service.precioBase}
              <span className="text-[11px] text-[#94A3B8] font-normal ml-1">
                ({TIPO_COBRO_LABELS[service.tipo_cobro] || service.tipo_cobro})
              </span>
            </p>
          </div>
        </div>

        {/* Descripción */}
        <div className="pt-2 border-t border-[#262D3D]/60 space-y-1.5">
          <p className="text-[#64748B] text-[11px] flex items-center gap-1 font-semibold">
            <FileText size={12} /> Descripción Técnica
          </p>
          <p className="text-[#F1F5F9] text-[13px] leading-relaxed p-3 bg-[#111318] border border-[#262D3D] rounded-xl">
            {service.descripcion}
          </p>
        </div>

        {/* Relación M:N con Proveedores (Catálogo Maestro) */}
        <div className="p-3.5 bg-[#111318] border border-[#262D3D] rounded-xl space-y-2">
          <p className="text-[#A78BFA] text-[11px] uppercase tracking-wider flex items-center gap-1.5 font-semibold">
            <Truck size={13} /> Proveedores Habilitados (Relación M:N)
          </p>
          <p className="text-[11px] text-[#94A3B8]">
            Servicio del catálogo maestro: puede ejecutarse directamente por The High Events o contratarse con cualquiera de los proveedores habilitados según el evento:
          </p>
          {linkedProviders.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {linkedProviders.map((p) => (
                <span
                  key={p.id}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#7C3AED]/15 text-[#A78BFA] border border-[#7C3AED]/30"
                >
                  {p.razon_social}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-[#64748B] italic">
              Ejecución directa por The High Events (sin terceros asociados actualmente).
            </p>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="pt-4 flex justify-end gap-3 border-t border-[#262D3D]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] border border-[#262D3D] transition-colors cursor-pointer"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => {
              onClose()
              onOpenEdit(service)
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all cursor-pointer"
          >
            <Edit2 size={13} />
            Editar servicio
          </button>
        </div>
      </div>
    </Drawer>
  )
}

