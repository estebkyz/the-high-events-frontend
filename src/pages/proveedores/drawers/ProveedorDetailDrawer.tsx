import React from "react"
import { useNavigate } from "react-router-dom"
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
  ClipboardCheck,
  Wallet,
  ArrowUpRight,
} from "lucide-react"
import type { ProveedorItem, ProveedorViewTab } from "../types"
import { getProveedorContacto } from "../utils"
import { TimelineEntry } from "../components/TimelineEntry"

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
  const navigate = useNavigate()

  if (!provider) return null

  const hasEquipos = provider.equipos && provider.equipos.length > 0

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="detail"
      title={provider.razon_social}
      subtitle={`NIT ${provider.nit_documento}`}
    >
      <div className="space-y-4">
        {/* Status toggle & edit */}
        <div className="flex items-center justify-between">
          <StatusBadge status={provider.estado} />
          <div className="flex items-center gap-2">
            <button
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
            <button
              onClick={() => {
                onClose()
                onOpenEdit(provider)
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/30 hover:bg-[#7C3AED]/30 cursor-pointer"
            >
              Editar
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-[#111318] p-1 rounded-xl border border-[#2D3748]">
          {(["info", "historial"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => onViewTabChange(tab)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewTab === tab
                  ? "bg-[#7C3AED] text-white font-semibold"
                  : "text-[#94A3B8] hover:text-[#F1F5F9]"
              }`}
            >
              {tab === "info"
                ? "Información General"
                : "Historial de Contrataciones"}
            </button>
          ))}
        </div>

        {viewTab === "info" ? (
          <div className="space-y-4">
            <div className="p-4 bg-[#1A1D23] rounded-xl border border-[#2D3748] space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-3">
                  <Building2
                    size={16}
                    className="text-[#A78BFA] mt-0.5 shrink-0"
                  />
                  <div>
                    <p className="text-[11px] text-[#64748B]">Razón Social</p>
                    <p className="text-sm font-semibold text-[#F1F5F9]">
                      {provider.razon_social}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User size={16} className="text-[#A78BFA] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] text-[#64748B]">
                      Persona de Contacto
                    </p>
                    <p className="text-sm font-semibold text-[#F1F5F9]">
                      {getProveedorContacto(provider)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-[#A78BFA] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] text-[#64748B]">Teléfono</p>
                    <p className="text-sm font-semibold text-[#F1F5F9]">
                      {provider.telefono}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-[#A78BFA] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] text-[#64748B]">Email</p>
                    <p className="text-sm font-semibold text-[#F1F5F9]">
                      {provider.correo}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Catálogo de Servicios y Personal Especializado */}
            <div className="p-4 bg-[#1A1D23] rounded-xl border border-[#2D3748] space-y-2">
              <div className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#A78BFA]" />
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A78BFA]">
                  Servicios y Personal Especializado
                </p>
              </div>
              {provider.servicios && provider.servicios.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {provider.servicios.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-lg text-xs bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/30 font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#64748B] italic">
                  No registra servicios o personal especializado.
                </p>
              )}
            </div>

            {/* Catálogo de Equipos e Insumos Técnicos */}
            <div className="p-4 bg-[#1A1D23] rounded-xl border border-[#2D3748] space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Package size={13} className="text-[#60A5FA]" />
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#60A5FA]">
                    Equipos e Insumos Técnicos
                  </p>
                </div>
                {hasEquipos && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#3B82F6]/15 text-[#60A5FA] border border-[#3B82F6]/30">
                    <ClipboardCheck size={10} />
                    Aplica Acta de Recepción
                  </span>
                )}
              </div>
              {hasEquipos ? (
                <>
                  <div className="flex flex-wrap gap-1.5">
                    {provider.equipos.map((eq) => (
                      <span
                        key={eq}
                        className="px-3 py-1 rounded-lg text-xs bg-[#3B82F6]/15 text-[#60A5FA] border border-[#3B82F6]/30 font-medium"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-[#2D3748]/70 flex items-center justify-between gap-2">
                    <p className="text-[11px] text-[#94A3B8]">
                      Requiere Formato Digital de Entrega y Recepción con evidencias fotográficas en montaje y desmontaje.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onClose()
                        navigate("/recepciones")
                      }}
                      className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#3B82F6]/20 text-[#60A5FA] hover:bg-[#3B82F6]/30 transition-colors cursor-pointer"
                    >
                      Ir a Recepciones
                      <ArrowUpRight size={12} />
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-xs text-[#64748B] italic">
                  Este proveedor solo suministra servicios intangibles / personal (no requiere acta física de equipos).
                </p>
              )}
            </div>

            {/* Esquema de Liquidación Financiera (Abonos y Pagos 50% / 50%) */}
            <div className="p-3.5 bg-[#111318] rounded-xl border border-[#2D3748] flex items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Wallet size={16} className="text-[#10B981] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-[#F1F5F9]">
                    Liquidación Financiera (50% Anticipo + 50% Final)
                  </p>
                  <p className="text-[11px] text-[#94A3B8]">
                    50% para reserva y 50% restante tras verificar el servicio y la devolución de equipos.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose()
                  navigate("/abonos")
                }}
                className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 hover:bg-[#10B981]/25 transition-colors cursor-pointer"
              >
                Ver Abonos
                <ArrowUpRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#1A1D23] rounded-xl border border-[#2D3748] text-center">
                <p className="text-[24px] font-bold text-[#F1F5F9]">
                  {provider.contratosCount}
                </p>
                <p className="text-[11px] text-[#64748B]">Contratos Totales</p>
              </div>
              <div className="p-3 bg-[#1A1D23] rounded-xl border border-[#2D3748] text-center">
                <p className="text-[24px] font-bold text-[#10B981]">
                  {
                    provider.historial.filter((h) => h.estado === "Completado")
                      .length
                  }
                </p>
                <p className="text-[11px] text-[#64748B]">Completados</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
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
      </div>
    </Drawer>
  )
}

