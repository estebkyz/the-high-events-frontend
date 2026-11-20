import React from "react"
import { Camera, ArrowLeftCircle } from "lucide-react"
import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import { TipoBadge, ItemEstadoBadge } from "../components/RecepcionBadges"
import type { Recepcion } from "../types"

interface RecepcionDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
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
      position="center"
      width="max-w-2xl"
      title={`Detalle de recepción — ${recepcion.codigo}`}
      subtitle={`${recepcion.evento} · Proveedor: ${recepcion.proveedor}`}
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

        {/* Metadatos de cabecera (Tabla recepciones) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#111318] rounded-xl border border-[#262D3D] p-4 text-xs">
          <div>
            <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-0.5">
              Evento Asociado (FK id_evento)
            </p>
            <p className="text-[#F8FAFC] font-semibold">{recepcion.evento}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-0.5">
              Proveedor (FK id_proveedor)
            </p>
            <p className="text-[#F8FAFC] font-semibold">
              {recepcion.proveedor}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-0.5">
              Fecha de Verificación
            </p>
            <p className="text-[#CBD5E1]">{recepcion.fecha}</p>
          </div>
        </div>

        {/* Detalle Normalizado por Aparato (Tabla detalle_recepcion) */}
        <div className="space-y-2">
          <h3 className="text-[13px] font-bold text-[#F8FAFC]">
            Detalle por Equipo Recibido (Tabla detalle_recepcion)
          </h3>
          <div className="bg-[#111318] rounded-xl border border-[#262D3D] overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#181B22] border-b border-[#262D3D] text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
                  <th className="px-3 py-2.5 text-left">Aparato / Equipo</th>
                  <th className="px-2 py-2.5 text-center">Cant.</th>
                  <th className="px-3 py-2.5 text-left">Estado Físico</th>
                  <th className="px-3 py-2.5 text-left">Observación del Aparato</th>
                  <th className="px-3 py-2.5 text-right">Evidencia Foto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262D3D]/50">
                {recepcion.items.map((item, i) => (
                  <tr
                    key={i}
                    className="hover:bg-[#181B22]/50 transition-colors"
                  >
                    <td className="px-3 py-2.5 text-[#F8FAFC] font-semibold">
                      {item.nombre}
                    </td>
                    <td className="px-2 py-2.5 text-center text-[#94A3B8] tabular-nums">
                      {item.cantidad}
                    </td>
                    <td className="px-3 py-2.5">
                      <ItemEstadoBadge estado={item.estado} />
                    </td>
                    <td className="px-3 py-2.5 text-[#CBD5E1]">
                      {item.observaciones || (
                        <span className="text-[#64748B] italic">
                          Sin novedad física
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-medium bg-[#7C3AED]/15 text-[#C4B5FD] border border-[#7C3AED]/30">
                        <Camera size={11} />
                        <span className="truncate max-w-[110px]">
                          {item.evidencia_foto || `evidencia_eq_${i + 1}.jpg`}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Botón registrar devolución si es Recepción Montaje */}
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
                <span>Registrar Devolución en Desmontaje</span>
              </button>
            </div>
          )}
      </div>
    </Drawer>
  )
}
