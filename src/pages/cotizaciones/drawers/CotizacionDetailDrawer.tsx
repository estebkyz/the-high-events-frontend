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
import {
  DetailHeader,
  DetailSection,
  DetailGrid,
  DetailField,
  DetailHighlight,
  DetailList,
} from "../../../components/detail"
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

  const serviceCount =
    quote.items && quote.items.length > 0
      ? quote.items.length
      : quote.servicios.length

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="detail"
      title="Detalle de cotización"
      footer={
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onSendEmail(quote)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/40 hover:bg-[#3B82F6]/30 transition-colors cursor-pointer"
            >
              <Mail size={13} aria-hidden="true" /> Enviar por Email
            </button>
            <button
              type="button"
              onClick={() => onDownloadPdf(quote)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-[#242830] text-[#94A3B8] border border-[#2D3748] hover:bg-[#2D3748] transition-colors cursor-pointer"
            >
              <Download size={13} aria-hidden="true" /> Descargar PDF
            </button>
          </div>
          <div className="flex gap-2.5">
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
      }
    >
      <div className="space-y-4">
        <DetailHeader
          badges={<StatusBadge status={quote.estado} />}
          title={<span className="font-mono text-[#A78BFA]">{quote.codigo}</span>}
          subtitle={
            <>
              <span>{quote.cliente}</span>
              {quote.notas && (
                <span className="block text-[#64748B] mt-0.5 italic">
                  {quote.notas}
                </span>
              )}
            </>
          }
          meta={
            <>
              <span>Emisión: {quote.fecha}</span>
              {quote.fechaVence && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Vencimiento: {quote.fechaVence}</span>
                </>
              )}
            </>
          }
        />

        {(quote.nombre_evento || quote.fecha_evento || quote.direccion) && (
          <DetailSection noBorder title="Información del Evento">
            <DetailGrid>
              {quote.nombre_evento && (
                <DetailField label="Evento" span={2} value={quote.nombre_evento} />
              )}
              {quote.fecha_evento && (
                <DetailField label="Fecha" value={quote.fecha_evento} />
              )}
              {(quote.hora_inicio || quote.hora_fin) && (
                <DetailField
                  label="Horario"
                  value={`${quote.hora_inicio || "--:--"} - ${quote.hora_fin || "--:--"}`}
                />
              )}
              {quote.direccion && (
                <DetailField label="Ubicación" span={2} value={quote.direccion} />
              )}
              {quote.aforo_esperado && (
                <DetailField
                  label="Aforo estimado del evento"
                  value={`${quote.aforo_esperado} personas`}
                />
              )}
              {quote.asesor && (
                <DetailField
                  label="Empleado"
                  value={quote.asesor}
                  valueClassName="text-[#A78BFA]"
                />
              )}
            </DetailGrid>
          </DetailSection>
        )}

        <DetailSection
          title="Servicios Incluidos"
          count={serviceCount > 0 ? `${serviceCount} ítem(s)` : undefined}
        >
          {quote.items && quote.items.length > 0 ? (
            <DetailList>
              {quote.items.map((it, i) => (
                <div
                  key={i}
                  className="py-2.5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-[#F1F5F9]">
                      {it.nombre}
                    </span>
                    <span className="text-[11px] text-[#94A3B8] ml-2">
                      x{it.cantidad} @{" "}
                      {it.valor_unitario.toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                  <span className="text-xs text-[#A78BFA] font-semibold tabular-nums shrink-0">
                    {it.subtotal.toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              ))}
            </DetailList>
          ) : (
            <DetailList>
              {quote.servicios.map((svc, i) => (
                <div
                  key={i}
                  className="py-2.5 flex items-center justify-between gap-3"
                >
                  <span className="text-xs font-medium text-[#F1F5F9]">
                    {svc}
                  </span>
                  <span className="text-xs text-[#A78BFA] font-semibold tabular-nums shrink-0">
                    {quote.montos[i] || ""}
                  </span>
                </div>
              ))}
            </DetailList>
          )}
        </DetailSection>

        <DetailHighlight
          label="Total Cotización"
          value={quote.total}
          tone="accent"
        />

        {/* Paso siguiente si está Aceptada: Registrar Primer Abono (50%) */}
        {quote.estado === "Aceptada" && (
          <div className="p-3.5 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#10B981] flex items-center gap-1.5">
                <CheckCircle size={14} aria-hidden="true" />
                Cotización Aceptada · Requiere Anticipo (50%)
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] shrink-0">
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
              <CreditCard size={13} aria-hidden="true" />
              <span>+ Registrar Primer Abono (50% Anticipo)</span>
            </button>
          </div>
        )}

        <DetailSection title="Ciclo de Estado">
          <div className="flex items-center gap-0">
            {ESTADO_ORDER.map((est, i) => {
              const cfg = ESTADO_TIMELINE[est]
              const Icon = cfg.icon
              const currentIndex = ESTADO_ORDER.indexOf(quote.estado)
              const isPast =
                currentIndex >= i &&
                quote.estado !== "Rechazada" &&
                quote.estado !== "Vencida"
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
                        aria-hidden="true"
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
                        isPast && !isNegative && currentIndex > i
                          ? "bg-[#10B981]/50"
                          : "bg-[#2D3748]"
                      }`}
                    />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        </DetailSection>

        <DetailSection title="Cambiar Estado">
          <div className="flex flex-wrap gap-2">
            {quote.estado === "Borrador" && (
              <button
                type="button"
                onClick={() => onAdvanceEstado(quote.id, "Enviada")}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/40 hover:bg-[#3B82F6]/30 transition-colors cursor-pointer"
              >
                <Send size={12} aria-hidden="true" /> Enviar Cotización
              </button>
            )}
            {quote.estado === "Enviada" && (
              <>
                <button
                  type="button"
                  onClick={() => onAdvanceEstado(quote.id, "Aceptada")}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 hover:bg-[#10B981]/30 transition-colors cursor-pointer"
                >
                  <CheckCircle size={12} aria-hidden="true" /> Aceptar
                </button>
                <button
                  type="button"
                  onClick={() => onAdvanceEstado(quote.id, "Rechazada")}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 hover:bg-[#EF4444]/30 transition-colors cursor-pointer"
                >
                  <XCircle size={12} aria-hidden="true" /> Rechazar
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
            {(quote.estado === "Aceptada" ||
              quote.estado === "Rechazada" ||
              quote.estado === "Vencida") && (
              <button
                type="button"
                onClick={() => onAdvanceEstado(quote.id, "Borrador")}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-[#2D3748] text-[#94A3B8] border border-[#2D3748] hover:bg-[#374151] transition-colors cursor-pointer"
              >
                <RefreshCw size={12} aria-hidden="true" /> Resetear a Borrador
              </button>
            )}
          </div>
        </DetailSection>
      </div>
    </Drawer>
  )
}
