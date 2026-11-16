import React from "react"
import { ArrowLeftCircle } from "lucide-react"
import { Drawer } from "../../../components/Drawer"
import { TipoBadge } from "../components/RecepcionBadges"
import type { Recepcion, DevolucionItem } from "../types"

interface RecepcionDevolucionDrawerProps {
  isOpen: boolean; onClose: () => void
  devolucionParent: Recepcion | null
  devItems: DevolucionItem[]
  setDevItems: React.Dispatch<React.SetStateAction<DevolucionItem[]>>
  devObservaciones: string
  setDevObservaciones: (obs: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function RecepcionDevolucionDrawer({
  isOpen,
  onClose,
  devolucionParent,
  devItems,
  setDevItems,
  devObservaciones,
  setDevObservaciones,
  onSubmit,
}: RecepcionDevolucionDrawerProps) {
  if (!devolucionParent) return null

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      size="modal"
      title="Registrar Devolución"
      subtitle={`Ref: ${devolucionParent.codigo} · ${devolucionParent.proveedor}`}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Tarjeta de referencia de recepción origen */}
        <div className="bg-[#111318] border border-[#262D3D] rounded-xl p-3.5 space-y-1 text-xs">
          <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
            Recepción de Origen
          </p>
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-bold text-[#A78BFA]">
              {devolucionParent.codigo}
            </p>
            <TipoBadge tipo={devolucionParent.tipo} />
          </div>
          <p className="text-[#94A3B8]">
            {devolucionParent.evento} · {devolucionParent.proveedor}
          </p>
        </div>

        {/* Condición de retorno por equipo */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold text-[#F8FAFC]">
            Estado de Equipos al Devolver
          </p>
          <div className="space-y-2">
            {devItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 bg-[#111318] border border-[#262D3D] rounded-xl p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#F8FAFC] truncate">
                    {item.nombre}
                  </p>
                  <p className="text-[11px] text-[#64748B]">
                    Cantidad: {item.cantidad}
                  </p>
                </div>
                <select
                  value={item.condicion}
                  onChange={(e) =>
                    setDevItems((prev) =>
                      prev.map((it, i) =>
                        i === idx ? { ...it, condicion: e.target.value } : it,
                      ),
                    )
                  }
                  className="text-xs bg-[#181B22] border border-[#262D3D] rounded-lg text-[#F8FAFC] px-2.5 py-1.5 focus:outline-none focus:border-[#7C3AED] cursor-pointer"
                >
                  <option value="Bueno">Bueno</option>
                  <option value="Regular">Regular</option>
                  <option value="Dañado">Dañado</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Observaciones de devolución */}
        <div>
          <label className="text-[13px] font-medium text-[#F8FAFC] block mb-1.5">
            Observaciones de Devolución
          </label>
          <textarea
            rows={3}
            placeholder="Novedades o condiciones físicas al momento de la devolución..."
            value={devObservaciones}
            onChange={(e) => setDevObservaciones(e.target.value)}
            className="w-full p-3 bg-[#111318] border border-[#262D3D] rounded-xl text-xs text-[#F8FAFC] placeholder-[#64748B] hover:border-[#333C50] focus:outline-none focus:border-[#7C3AED] focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40 transition-colors resize-none"
          />
        </div>

        {/* Acciones */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#262D3D]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#F8FAFC] bg-[#181B22] border border-[#262D3D] hover:bg-[#222734] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all shadow-md shadow-[#7C3AED]/25 cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeftCircle size={14} />
            <span>Registrar Devolución</span>
          </button>
        </div>
      </form>
    </Drawer>
  )
}
