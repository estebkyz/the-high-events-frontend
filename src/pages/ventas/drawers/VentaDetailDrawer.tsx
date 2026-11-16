import React from "react"
import { useNavigate } from "react-router-dom"
import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import { DollarSign, RefreshCw, Download, Sparkles } from "lucide-react"
import { pagoProgress, pagoColor } from "../utils"
import type { VentaItem, EstadoPagoVenta } from "../types"

interface VentaDetailDrawerProps {
  isOpen: boolean; onClose: () => void
  sale: VentaItem | null
  onChangePago: (sale: VentaItem, newEstado: EstadoPagoVenta) => void
  onDownload: (sale: VentaItem) => void
}

export function VentaDetailDrawer({
  isOpen,
  onClose,
  sale,
  onChangePago,
  onDownload,
}: VentaDetailDrawerProps) {
  const navigate = useNavigate()
  if (!sale) return null

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="detail"
      title="Detalle de Venta"
      subtitle="Información completa del comprobante"
    >
      <div className="space-y-4">
        {/* Venta Header */}
        <div className="p-3.5 bg-[#181B22] rounded-xl border border-[#262D3D] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-bold text-[#F1F5F9]">
              {sale.codigo}
            </span>
            <div className="flex items-center gap-1.5">
              <StatusBadge
                status={sale.tipo === "Cliente" ? "Natural" : "Empresa"}
              />
              <StatusBadge status={sale.estado_venta || "Confirmada"} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-[#64748B] mb-0.5">Cliente / Evento</p>
              <p className="font-semibold text-[#F1F5F9]">
                {sale.clienteEvento}
              </p>
            </div>
            <div>
              <p className="text-[#64748B] mb-0.5">Fecha</p>
              <p className="font-semibold text-[#F1F5F9]">{sale.fecha}</p>
            </div>
            {sale.numero_factura && (
              <div>
                <p className="text-[#64748B] mb-0.5">Factura Legal</p>
                <p className="font-semibold text-[#10B981]">{sale.numero_factura}</p>
              </div>
            )}
            {sale.cotizacion_id && (
              <div>
                <p className="text-[#64748B] mb-0.5">Cotización Asociada</p>
                <p className="font-semibold text-[#A78BFA]">{sale.cotizacion_id}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Info */}
        <div className="p-4 bg-[#181B22] rounded-xl border border-[#262D3D] space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={15} className="text-[#A78BFA]" />
            <h4 className="text-sm font-semibold text-[#F1F5F9]">
              Información de Pago
            </h4>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-[#64748B]">Total</p>
              <p className="text-[20px] font-bold text-[#10B981]">
                {sale.total}
              </p>
            </div>
            <StatusBadge status={sale.estadoPago} />
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-[11px] text-[#94A3B8] mb-1.5">
              <span>Progreso de pago</span>
              <span
                className="font-bold"
                style={{ color: pagoColor(sale.estadoPago) }}
              >
                {pagoProgress(sale.estadoPago)}%
              </span>
            </div>
            <div className="w-full bg-[#262D3D] h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pagoProgress(sale.estadoPago)}%`,
                  backgroundColor: pagoColor(sale.estadoPago),
                }}
              />
            </div>
          </div>
        </div>

        {/* Cambiar Estado Pago */}
        <div className="p-4 bg-[#181B22] rounded-xl border border-[#262D3D] space-y-3">
          <div className="flex items-center gap-2">
            <RefreshCw size={14} className="text-[#A78BFA]" />
            <h4 className="text-sm font-semibold text-[#F1F5F9]">
              Cambiar Estado de Pago
            </h4>
          </div>
          <div className="flex gap-2">
            {(["Pendiente", "Parcial", "Pagado"] as const).map((estado) => (
              <button
                key={estado}
                type="button"
                onClick={() => onChangePago(sale, estado)}
                className={`flex-1 py-2 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                  sale.estadoPago === estado
                    ? estado === "Pagado"
                      ? "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40"
                      : estado === "Parcial"
                        ? "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40"
                        : "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40"
                    : "bg-[#242830] text-[#64748B] border-[#262D3D] hover:border-[#4A5568]"
                }`}
              >
                {estado}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          {sale.tipo === "Cliente" && sale.estadoPago !== "Pendiente" && (
            <button
              type="button"
              onClick={() => {
                onClose()
                navigate("/eventos/nuevo")
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all shadow-md shadow-[#7C3AED]/20 cursor-pointer"
            >
              <Sparkles size={14} />
              <span>+ Programar Equipos y Personal del Evento</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onDownload(sale)}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 hover:bg-[#10B981]/30 transition-colors cursor-pointer"
          >
            <Download size={14} />
            Descargar Comprobante de Venta
          </button>
        </div>
      </div>
    </Drawer>
  )
}
