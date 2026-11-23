import { useNavigate } from "react-router-dom"
import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import {
  DetailHeader,
  DetailSection,
  DetailGrid,
  DetailField,
  DetailHighlight,
} from "../../../components/detail"
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
      footer={
        <div className="space-y-2">
          {sale.tipo === "Cliente" && sale.estadoPago !== "Pendiente" && (
            <button
              type="button"
              onClick={() => {
                onClose()
                navigate("/eventos/nuevo")
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all shadow-md shadow-[#7C3AED]/20 cursor-pointer"
            >
              <Sparkles size={14} aria-hidden="true" />
              <span>+ Programar Equipos y Personal del Evento</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onDownload(sale)}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 hover:bg-[#10B981]/30 transition-colors cursor-pointer"
          >
            <Download size={14} aria-hidden="true" />
            Descargar Comprobante de Venta
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <DetailHeader
          badges={
            <>
              <StatusBadge
                status={sale.tipo === "Cliente" ? "Natural" : "Empresa"}
              />
              <StatusBadge status={sale.estado_venta || "Confirmada"} />
            </>
          }
          title={sale.codigo}
          subtitle={sale.clienteEvento}
        />

        <DetailGrid>
          <DetailField label="Cliente / Evento" value={sale.clienteEvento} />
          <DetailField label="Fecha" value={sale.fecha} />
          {sale.numero_factura && (
            <DetailField
              label="Factura Legal"
              value={sale.numero_factura}
              valueClassName="text-[#10B981]"
            />
          )}
          {sale.cotizacion_id && (
            <DetailField
              label="Cotización Asociada"
              value={sale.cotizacion_id}
              valueClassName="text-[#A78BFA]"
            />
          )}
        </DetailGrid>

        <DetailSection title="Información de Pago" icon={DollarSign}>
          <DetailHighlight
            label="Total"
            value={sale.total}
            badge={<StatusBadge status={sale.estadoPago} />}
            tone="success"
          />

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
        </DetailSection>

        <DetailSection title="Cambiar Estado de Pago" icon={RefreshCw}>
          <div className="flex gap-2">
            {(["Pendiente", "Parcial", "Pagado"] as const).map((estado) => (
              <button
                key={estado}
                type="button"
                aria-pressed={sale.estadoPago === estado}
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
        </DetailSection>
      </div>
    </Drawer>
  )
}
