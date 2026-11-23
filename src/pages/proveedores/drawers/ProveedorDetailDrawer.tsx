import React from "react"
import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import {
  DetailHeader,
  DetailSection,
  DetailGrid,
  DetailField,
  DetailList,
  DetailEmptyNote,
} from "../../../components/detail"
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
      footer={
        <div className="flex items-center justify-end gap-3">
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
            <Edit2 size={13} aria-hidden="true" />
            <span>Editar proveedor</span>
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <DetailHeader
          badges={
            <div className="flex items-center justify-between w-full gap-2 flex-wrap">
              <div className="flex items-center gap-2.5">
                <StatusBadge status={provider.estado} />
                <span className="text-xs text-[#94A3B8]">
                  {provider.contratosCount} contrataciones registradas
                </span>
              </div>
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
                  <ToggleLeft size={13} aria-hidden="true" />
                ) : (
                  <ToggleRight size={13} aria-hidden="true" />
                )}
                {provider.estado === "Activo" ? "Desactivar" : "Activar"}
              </button>
            </div>
          }
          title={provider.razon_social}
          subtitle={`NIT: ${provider.nit_documento}`}
        />

        {/* Pestañas */}
        <div
          role="tablist"
          aria-label="Secciones del proveedor"
          className="flex items-center gap-1 bg-[#14171D] p-1 rounded-xl border border-[#2D3748]"
        >
          {(["info", "historial"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={viewTab === tab}
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
            <DetailSection title="Datos de Contacto" noBorder>
              <DetailGrid>
                <DetailField
                  label="Razón Social"
                  icon={Building2}
                  value={provider.razon_social}
                />
                <DetailField
                  label="Persona de Contacto"
                  icon={User}
                  value={getProveedorContacto(provider)}
                />
                <DetailField
                  label="Teléfono"
                  icon={Phone}
                  value={provider.telefono}
                  valueClassName="tabular-nums"
                />
                <DetailField
                  label="Correo Electrónico"
                  icon={Mail}
                  value={provider.correo}
                  valueClassName="break-all"
                />
              </DetailGrid>
            </DetailSection>

            <DetailSection
              title="Especialidades / Servicios Ofrecidos"
              icon={Sparkles}
              count={provider.servicios?.length ?? 0}
            >
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
                <DetailEmptyNote text="No registra servicios especializados." />
              )}
            </DetailSection>

            <DetailSection
              title="Equipos Alquilados Vinculados (FK Inventario)"
              icon={Package}
              count={equiposDelProveedor.length}
            >
              {equiposDelProveedor.length > 0 ? (
                <DetailList>
                  {equiposDelProveedor.map((eq) => (
                    <div
                      key={eq.id}
                      className="py-2.5 flex items-center justify-between gap-2 text-xs"
                    >
                      <span className="font-medium text-[#F1F5F9] truncate">
                        {eq.nombre}
                      </span>
                      <span className="text-[11px] font-mono text-[#60A5FA] shrink-0">
                        {eq.serie}
                      </span>
                    </div>
                  ))}
                </DetailList>
              ) : (
                <DetailEmptyNote text="Sin equipos individuales registrados bajo este proveedor en el módulo de Equipos." />
              )}
            </DetailSection>
          </div>
        ) : (
          <DetailSection
            title="Historial de Contrataciones"
            count={provider.historial.length}
            noBorder
          >
            <div className="space-y-1 max-h-[340px] overflow-y-auto pr-1">
              {provider.historial.length === 0 ? (
                <DetailEmptyNote text="Sin historial de contrataciones aún." />
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
          </DetailSection>
        )}
      </div>
    </Drawer>
  )
}
