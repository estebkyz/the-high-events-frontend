import React from "react"
import { Camera, PenLine, ArrowLeftCircle } from "lucide-react"
import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import { TipoBadge, ItemEstadoBadge } from "../components/RecepcionBadges"
import type { Recepcion } from "../types"

interface RecepcionDetailDrawerProps {
  isOpen: boolean; onClose: () => void
  recepcion: Recepcion | null
  onOpenDevolucion: (parent: Recepcion) => void
}

export function RecepcionDetailDrawer({
  isOpen,
  onClose,
  recepcion,
  onOpenDevolucion,
}: RecepcionDetailDrawerProps) {
  if (!recepcion) return null

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={recepcion.codigo}
      subtitle={`${recepcion.evento} · ${recepcion.proveedor}`}
      size="detail"
    >
      <div className="space-y-4">
        {/* Badges de cabecera */}
        <div className="flex flex-wrap items-center gap-2">
          <TipoBadge tipo={recepcion.tipo} />
          <StatusBadge status={recepcion.estado} />
          {recepcion.parentCodigo && (
            <span className="text-[11px] text-[#94A3B8] bg-[#111318] border border-[#262D3D] px-2 py-0.5 rounded">
              Ref: {recepcion.parentCodigo}
            </span>
          )}
        </div>

        {/* Metadatos */}
        <div className="grid grid-cols-2 gap-3 bg-[#111318] rounded-xl border border-[#262D3D] p-4 text-xs">
          <div>
            <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-0.5">
              Evento
            </p>
            <p className="text-[#F8FAFC] font-semibold">{recepcion.evento}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-0.5">
              Proveedor
            </p>
            <p className="text-[#F8FAFC] font-semibold">
              {recepcion.proveedor}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-0.5">
              Fecha
            </p>
            <p className="text-[#CBD5E1]">{recepcion.fecha}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-0.5">
              Subcontrato
            </p>
            <p className="text-[#CBD5E1]">{recepcion.subcontrato}</p>
          </div>
        </div>

        {/* Información del acta */}
        <div className="space-y-2">
          <h3 className="text-[13px] font-bold text-[#F8FAFC] flex items-center gap-2">
            <PenLine size={14} className="text-[#A78BFA]" />
            Información del Acta
          </h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            {recepcion.descripcion}
          </p>
          {recepcion.observaciones && (
            <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-xl p-3">
              <p className="text-[11px] font-bold text-[#F59E0B] uppercase mb-1">
                Observaciones
              </p>
              <p className="text-xs text-[#F8FAFC]">
                {recepcion.observaciones}
              </p>
            </div>
          )}
        </div>

        {/* Inventario de equipos */}
        <div className="space-y-2">
          <h3 className="text-[13px] font-bold text-[#F8FAFC]">
            Inventario de Equipos
          </h3>
          <div className="bg-[#111318] rounded-xl border border-[#262D3D] overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#181B22] border-b border-[#262D3D] text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
                  <th className="px-3 py-2 text-left">Ítem</th>
                  <th className="px-3 py-2 text-center">Cantidad</th>
                  <th className="px-3 py-2 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262D3D]/50">
                {recepcion.items.map((item, i) => (
                  <tr
                    key={i}
                    className="hover:bg-[#181B22]/50 transition-colors"
                  >
                    <td className="px-3 py-2.5 text-[#F8FAFC] font-medium">
                      {item.nombre}
                    </td>
                    <td className="px-3 py-2.5 text-center text-[#94A3B8]">
                      {item.cantidad}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <ItemEstadoBadge estado={item.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Adjuntar fotos */}
        <div className="border border-dashed border-[#262D3D] rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-[#7C3AED]/50 transition-colors cursor-pointer bg-[#111318]">
          <div className="w-9 h-9 rounded-full bg-[#7C3AED]/15 flex items-center justify-center">
            <Camera size={18} className="text-[#A78BFA]" />
          </div>
          <p className="text-xs font-semibold text-[#F8FAFC]">
            Adjuntar fotos del estado
          </p>
          <p className="text-[11px] text-[#64748B]">
            JPG, PNG o PDF · Máx. 10MB
          </p>
        </div>

        {/* Firma digital */}
        <div className="bg-[#111318] border border-[#262D3D] rounded-xl p-4 space-y-3">
          <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
            Firma Digital
          </p>
          <div className="h-12 border-b-2 border-dashed border-[#262D3D] flex items-end justify-center pb-1">
            <p className="text-[11px] text-[#64748B] italic">
              Firma del responsable aquí
            </p>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
            <span>Responsable: The High Events</span>
            <span>Estado: Verificado</span>
          </div>
        </div>

        {/* Botón registrar devolución si es Firmada y Entrega */}
        {(recepcion.estado === "Conforme" || recepcion.estado === "Cerrada") &&
          recepcion.tipo === "Recepción Montaje" && (
          <div className="pt-2 border-t border-[#262D3D]">
            <button
              type="button"
              onClick={() => {
                onClose()
                setTimeout(() => onOpenDevolucion(recepcion), 80)
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#7C3AED]/15 border border-[#7C3AED]/40 text-[#C4B5FD] rounded-xl text-xs font-semibold hover:bg-[#7C3AED]/25 transition-colors cursor-pointer"
            >
              <ArrowLeftCircle size={15} />
              <span>Registrar Devolución de Equipos</span>
            </button>
          </div>
        )}
      </div>
    </Drawer>
  )
}
