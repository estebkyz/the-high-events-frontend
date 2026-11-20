import React from "react"
import { useNavigate } from "react-router-dom"
import {
  Send,
  Mail,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  CreditCard,
} from "lucide-react"
import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import type { CotizacionItem, EstadoCotizacion } from "../types"
import { ESTADO_ORDER, ESTADO_TIMELINE } from "../data"

interface CotizacionDetailDrawerProps {
  isOpen: boolean; quote: CotizacionItem | null
  onClose: () => void
  onAdvanceEstado: (id: string, estado: EstadoCotizacion) => void
  onSendEmail: (quote: CotizacionItem) => void
  onDownloadPdf: (quote: CotizacionItem) => void
  onOpenEdit: (quote: CotizacionItem) => void
}

export const CotizacionDetailDrawer: React.FC<CotizacionDetailDrawerProps> = ({
  isOpen,
  quote,
  onClose,
  onAdvanceEstado,
  onSendEmail,
  onDownloadPdf,
  onOpenEdit,
}) => {
  const navigate = useNavigate()
  if (!quote) return null

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="detail"
      title={`Detalle de cotización`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="p-3.5 bg-[#1A1D23] rounded-xl border border-[#2D3748]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[17px] font-bold font-mono text-[#A78BFA]">
                {quote.codigo}
              </p>
              <p className="text-sm font-semibold text-[#F1F5F9] mt-0.5">
                {quote.cliente}
              </p>
              {quote.notas && (
                <p className="text-xs text-[#64748B] mt-1 italic">
                  {quote.notas}
                </p>
              )}
            </div>
            <StatusBadge status={quote.estado} />
          </div>
          <div className="mt-3 flex gap-4 text-xs text-[#94A3B8]">
            <span>
              <span className="text-[#64748B]">Emisión:</span> {quote.fecha}
            </span>
            {quote.fechaVence && (
              <span>
                <span className="text-[#64748B]">Vencimiento:</span>{" "}
                {quote.fechaVence}
              </span>
            )}
          </div>
        </div>

        {/* (Si existe) */}
        {(quote.nombre_evento || quote.fecha_evento || quote.direccion) && (
          <div className="p-3.5 bg-[#1A1D23] rounded-xl border border-[#2D3748] space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {quote.nombre_evento && (
                <div className="col-span-2">
                  <span className="font-semibold text-[#F1F5F9]">{quote.nombre_evento}</span>
                </div>
              )}
              {quote.fecha_evento && (
                <div>
                  <span className="text-[#64748B]">Fecha: </span>
                  <span className="text-[#F1F5F9]">{quote.fecha_evento}</span>
                </div>
              )}
              {(quote.hora_inicio || quote.hora_fin) && (
                <div>
                  <span className="text-[#64748B]">Horario: </span>
                  <span className="text-[#F1F5F9]">{quote.hora_inicio || "--:--"} - {quote.hora_fin || "--:--"}</span>
                </div>
              )}
              {quote.direccion && (
                <div className="col-span-2">
                  <span className="text-[#64748B]">Ubicación: </span>
                  <span className="text-[#F1F5F9]">{quote.direccion}</span>
                </div>
              )}
              {quote.aforo_esperado && (
                <div>
                  <span className="text-[#64748B]">Aforo estimado del evento: </span>
                  <span className="text-[#F1F5F9]">{quote.aforo_esperado} personas</span>
                </div>
              )}
              {quote.asesor && (
                <div>
                  <span className="text-[#64748B]">Empleado: </span>
                  <span className="text-[#A78BFA]">{quote.asesor}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Services list */}
        <div>
          <p className="text-[10px] text-[#A78BFA] uppercase tracking-wider font-semibold mb-2">
            Servicios Incluidos
          </p>
          {quote.items && quote.items.length > 0 ? (
            <div className="space-y-1.5">
              {quote.items.map((it, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 bg-[#1A1D23] rounded-lg border border-[#2D3748]"
                >
                  <div>
                    <span className="text-xs font-medium text-[#F1F5F9]">
                      {it.nombre}
                    </span>
                    <span className="text-[10px] text-[#64748B] ml-2">
                      x{it.cantidad} @ {it.valor_unitario.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <span className="text-xs text-[#A78BFA] font-semibold ml-3 shrink-0">
                    {it.subtotal.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1.5">
              {quote.servicios.map((svc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 bg-[#1A1D23] rounded-lg border border-[#2D3748]"
                >
                  <span className="text-xs font-medium text-[#F1F5F9]">
                    {svc}
                  </span>
                  <span className="text-xs text-[#A78BFA] font-semibold ml-3 shrink-0">
                    {quote.montos[i] || ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total */}
        <div className="p-4 bg-[#7C3AED]/10 rounded-xl border border-[#7C3AED]/30 flex items-center justify-between">
          <p className="text-sm font-semibold text-[#A78BFA]">
            Total Cotización
          </p>
          <p className="text-2xl font-bold text-[#F1F5F9]">{quote.total}</p>
        </div>

        {/* Paso siguiente si está Aceptada: Registrar Primer Abono (50%) */}
        {quote.estado === "Aceptada" && (
          <div className="p-3.5 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#10B981] flex items-center gap-1.5">
                <CheckCircle size={14} />
                Cotización Aceptada · Requiere Anticipo (50%)
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981]">
                Paso 3
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Para convertir esta cotización en una venta formal y habilitar la reserva de recursos operativos (equipos y personal), el cliente debe registrar el primer abono del 50%.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose()
                navigate("/abonos", {
                  state: {
                    fromQuote: true,
                    cotizacionCodigo: quote.codigo,
                    cliente: quote.cliente,
                    evento: quote.nombre_evento || `Evento de ${quote.cliente}`,
                    total: quote.total,
                  },
                })
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-[#10B981] text-white hover:bg-[#059669] transition-all shadow-sm shadow-[#10B981]/20 cursor-pointer"
            >
              <CreditCard size={13} />
              <span>+ Registrar Primer Abono (50% Anticipo)</span>
            </button>
          </div>
        )}

        {/* Status timeline */}
        <div>
          <p className="text-[10px] text-[#A78BFA] uppercase tracking-wider font-semibold mb-3">
            Ciclo de Estado
          </p>
          <div className="flex items-center gap-0">
            {ESTADO_ORDER.map((est, i) => {
              const cfg = ESTADO_TIMELINE[est]
              const Icon = cfg.icon
              const currentIndex = ESTADO_ORDER.indexOf(quote.estado)
              const isPast = currentIndex >= i && quote.estado !== "Rechazada" && quote.estado !== "Vencida"
              const isCurrent = quote.estado === est
              const isNegative =
                (quote.estado === "Rechazada" && est === "Rechazada") ||
                (quote.estado === "Vencida" && est === "Vencida")
              return (
                <React.Fragment key={est}>
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isCurrent || isNegative
                          ? isNegative
                            ? "bg-[#EF4444]/20 border-[#EF4444]"
                            : "bg-[#7C3AED]/20 border-[#7C3AED]"
                          : isPast
                            ? "bg-[#10B981]/20 border-[#10B981]"
                            : "bg-[#242830] border-[#2D3748]"
                      }`}
                    >
                      <Icon
                        size={13}
                        className={
                          isCurrent || isNegative
                            ? isNegative
                              ? "text-[#EF4444]"
                              : "text-[#A78BFA]"
                            : isPast
                              ? "text-[#10B981]"
                              : "text-[#64748B]"
                        }
                      />
                    </div>
                    <span
                      className={`text-[8px] text-center leading-tight ${
                        isCurrent
                          ? "text-[#A78BFA] font-semibold"
                          : isNegative
                            ? "text-[#EF4444]"
                            : "text-[#64748B]"
                      }`}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  {i < ESTADO_ORDER.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 -mt-4 mx-0.5 rounded transition-colors ${
                        isPast &&
                        !isNegative &&
                        currentIndex > i
                          ? "bg-[#10B981]/50"
                          : "bg-[#2D3748]"
                      }`}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </div>

        {/* Advance state actions */}
        <div className="p-3 bg-[#1A1D23] rounded-xl border border-[#2D3748] space-y-3">
          <p className="text-[10px] text-[#A78BFA] uppercase tracking-wider font-semibold">
            Cambiar Estado
          </p>
          <div className="flex flex-wrap gap-2">
            {quote.estado === "Borrador" && (
              <button
                type="button"
                onClick={() => onAdvanceEstado(quote.id, "Enviada")}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/40 hover:bg-[#3B82F6]/30 transition-colors cursor-pointer"
              >
                <Send size={12} /> Enviar Cotización
              </button>
            )}
            {quote.estado === "Enviada" && (
              <>
                <button
                  type="button"
                  onClick={() => onAdvanceEstado(quote.id, "Aceptada")}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 hover:bg-[#10B981]/30 transition-colors cursor-pointer"
                >
                  <CheckCircle size={12} /> Aceptar
                </button>
                <button
                  type="button"
                  onClick={() => onAdvanceEstado(quote.id, "Rechazada")}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 hover:bg-[#EF4444]/30 transition-colors cursor-pointer"
                >
                  <XCircle size={12} /> Rechazar
                </button>
                <button
                  type="button"
                  onClick={() => onAdvanceEstado(quote.id, "Vencida")}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-[#64748B]/20 text-[#94A3B8] border border-[#64748B]/40 hover:bg-[#64748B]/30 transition-colors cursor-pointer"
                >
                  Vencer
                </button>
              </>
            )}
            {(quote.estado === "Aceptada" || quote.estado === "Rechazada" || quote.estado === "Vencida") && (
              <button
                type="button"
                onClick={() => onAdvanceEstado(quote.id, "Borrador")}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-[#2D3748] text-[#94A3B8] border border-[#2D3748] hover:bg-[#374151] transition-colors cursor-pointer"
              >
                <RefreshCw size={12} /> Resetear a Borrador
              </button>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => onSendEmail(quote)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/40 hover:bg-[#3B82F6]/30 transition-colors cursor-pointer"
          >
            <Mail size={13} /> Enviar por Email
          </button>
          <button
            type="button"
            onClick={() => onDownloadPdf(quote)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-[#242830] text-[#94A3B8] border border-[#2D3748] hover:bg-[#2D3748] transition-colors cursor-pointer"
          >
            <Download size={13} /> Descargar PDF
          </button>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onOpenEdit(quote)}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors cursor-pointer"
          >
            Editar Cotización
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] border border-[#2D3748] transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Drawer>
  )
}
