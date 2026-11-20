import React from "react"
import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import {
  Building2,
  Phone,
  Mail,
  User,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Package,
  Edit2,
} from "lucide-react"
import type { ProveedorItem, ProveedorViewTab } from "../types"
import { getProveedorContacto } from "../utils"
import { TimelineEntry } from "../components/TimelineEntry"
import { INITIAL_EQUIPOS } from "../../equipos/data"

interface ProveedorDetailDrawerProps {
  isOpen: boolean
  provider: ProveedorItem | null
  viewTab: ProveedorViewTab
  onViewTabChange: (tab: ProveedorViewTab) => void
  onClose: () => void
  onToggleEstado: (id: string) => void
  onOpenEdit: (provider: ProveedorItem) => void
}

export const ProveedorDetailDrawer: React.FC<ProveedorDetailDrawerProps> = ({
  isOpen,
  provider,
  viewTab,
  onViewTabChange,
  onClose,
  onToggleEstado,
  onOpenEdit,
}) => {
  if (!provider) return null

  // Equipos alquilados registrados en el módulo de Equipos con FK a este proveedor
  const equiposDelProveedor = INITIAL_EQUIPOS.filter(
    (eq) =>
      eq.propiedad === "Alquilado" &&
      (String(eq.proveedor_id) === String(provider.id) ||
        eq.proveedor_nombre === provider.razon_social),
  )

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      width="max-w-2xl"
      title={`Detalle de proveedor — ${provider.razon_social}`}
      subtitle={`NIT ${provider.nit_documento}`}
    >
      <div className="space-y-4">
        {/* Barra superior de estado y edición */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <StatusBadge status={provider.estado} />
            <span className="text-xs text-[#94A3B8]">
              {provider.contratosCount} contrataciones registradas
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleEstado(provider.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                provider.estado === "Activo"
                  ? "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30 hover:bg-[#EF4444]/20"
                  : "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30 hover:bg-[#10B981]/20"
              }`}
            >
              {provider.estado === "Activo" ? (
                <ToggleLeft size={13} />
              ) : (
                <ToggleRight size={13} />
              )}
              {provider.estado === "Activo" ? "Desactivar" : "Activar"}
            </button>
          </div>
        </div>

        {/* Pestañas */}
        <div className="flex items-center gap-1 bg-[#111318] p-1 rounded-xl border border-[#2D3748]">
          {(["info", "historial"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onViewTabChange(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewTab === tab
                  ? "bg-[#7C3AED] text-white font-semibold"
                  : "text-[#94A3B8] hover:text-[#F1F5F9]"
              }`}
            >
              {tab === "info"
                ? "Información General y Servicios"
                : `Historial de Contrataciones (${provider.historial.length})`}
            </button>
          ))}
        </div>

        {viewTab === "info" ? (
          <div className="space-y-4">
            {/* Tarjeta de datos de contacto con diseño amplio (el correo nunca se corta) */}
            <div className="p-4 bg-[#111318] rounded-xl border border-[#262D3D] grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-6 flex items-start gap-3">
                <Building2
                  size={16}
                  className="text-[#A78BFA] mt-0.5 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-[11px] text-[#64748B]">
                    Razón Social y NIT
                  </p>
                  <p className="text-sm font-semibold text-[#F1F5F9]">
                    {provider.razon_social}
                  </p>
                  <p className="text-xs font-mono text-[#94A3B8] mt-0.5">
                    NIT: {provider.nit_documento}
                  </p>
                </div>
              </div>

              <div className="sm:col-span-6 flex items-start gap-3">
                <User size={16} className="text-[#A78BFA] mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-[#64748B]">
                    Persona de Contacto
                  </p>
                  <p className="text-sm font-semibold text-[#F1F5F9]">
                    {getProveedorContacto(provider)}
                  </p>
                </div>
              </div>

              <div className="sm:col-span-4 flex items-start gap-3 pt-3 border-t border-[#262D3D]/60">
                <Phone size={16} className="text-[#A78BFA] mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] text-[#64748B]">Teléfono</p>
                  <p className="text-sm font-semibold text-[#F1F5F9] tabular-nums">
                    {provider.telefono}
                  </p>
                </div>
              </div>

              <div className="sm:col-span-8 flex items-start gap-3 pt-3 border-t border-[#262D3D]/60">
                <Mail size={16} className="text-[#A78BFA] mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-[#64748B]">
                    Correo Electrónico
                  </p>
                  <p className="text-sm font-semibold text-[#F1F5F9] break-all">
                    {provider.correo}
                  </p>
                </div>
              </div>
            </div>

            {/* Servicios y Equipos consultados por relación desde Equipos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#111318] rounded-xl border border-[#262D3D] space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#A78BFA]" />
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A78BFA]">
                    Especialidades / Servicios Ofrecidos
                  </p>
                </div>
                {provider.servicios && provider.servicios.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {provider.servicios.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-lg text-xs bg-[#7C3AED]/15 text-[#A78BFA] border border-[#7C3AED]/30 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#64748B] italic">
                    No registra servicios especializados.
                  </p>
                )}
              </div>

              <div className="p-4 bg-[#111318] rounded-xl border border-[#262D3D] space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <Package size={13} className="text-[#60A5FA]" />
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#60A5FA]">
                    Equipos Alquilados Vinculados (FK Inventario)
                  </p>
                </div>
                {equiposDelProveedor.length > 0 ? (
                  <div className="space-y-1.5">
                    {equiposDelProveedor.map((eq) => (
                      <div
                        key={eq.id}
                        className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-[#181B22] border border-[#262D3D]"
                      >
                        <span className="font-medium text-[#F1F5F9] truncate">
                          {eq.nombre}
                        </span>
                        <span className="text-[10.5px] font-mono text-[#60A5FA] shrink-0 ml-2">
                          {eq.serie}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#64748B] italic">
                    Sin equipos individuales registrados bajo este proveedor en el módulo de Equipos.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1 max-h-[340px] overflow-y-auto pr-1">
            {provider.historial.length === 0 ? (
              <p className="text-xs text-[#64748B] italic py-4">
                Sin historial de contrataciones aún.
              </p>
            ) : (
              <div className="relative">
                {provider.historial.map((entry, idx) => (
                  <TimelineEntry key={idx} entry={entry} />
                ))}
                <div className="pl-6">
                  <div className="w-3 h-3 rounded-full bg-[#2D3748] border-2 border-[#4A5568]" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pie del Modal */}
        <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#262D3D]">
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
              onOpenEdit(provider)
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors cursor-pointer"
          >
            <Edit2 size={13} />
            <span>Editar proveedor</span>
          </button>
        </div>
      </div>
    </Drawer>
  )
}
