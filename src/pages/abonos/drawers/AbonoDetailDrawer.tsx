import React from "react"
import { useNavigate } from "react-router-dom"
import {
  Receipt,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
} from "lucide-react"
import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import { FormInput } from "../../../components/FormInput"
import { CustomSelect } from "../../../components/CustomSelect"
import type { AbonoItem, PagoFormState, TipoPagoEnum } from "../types"
import {
  METODO_PAGO_OPTIONS,
  TIPO_PAGO_OPTIONS,
  ESTADO_PAGO_OPTIONS,
} from "../data"

interface AbonoDetailDrawerProps {
  isOpen: boolean; abono: AbonoItem | null
  onClose: () => void
  showPagoForm: boolean
  setShowPagoForm: (val: boolean) => void
  pagoForm: PagoFormState
  setPagoForm: React.Dispatch<React.SetStateAction<PagoFormState>>
  onPagoSubmit: (e: React.FormEvent) => void
  onGenerarRecibo: () => void
}

export const AbonoDetailDrawer: React.FC<AbonoDetailDrawerProps> = ({
  isOpen,
  abono,
  onClose,
  showPagoForm,
  setShowPagoForm,
  pagoForm,
  setPagoForm,
  onPagoSubmit,
  onGenerarRecibo,
}) => {
  const navigate = useNavigate()
  if (!abono) return null

  const isClientes = abono.tipoCartera === "Clientes"

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isClientes ? abono.evento : abono.servicio || abono.evento}
      subtitle={`Gestión de Cartera de ${abono.tipoCartera}`}
      size="detail"
    >
      <div className="space-y-4">
        {/* Event header card */}
        <div className="bg-[#1A1D23] border border-[#2D3748] rounded-xl p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
              {isClientes ? "Monto Total Acordado" : "Monto Total Contratado"}
            </p>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/30">
              {abono.tipoCartera}
            </span>
          </div>
          <p className="text-[20px] font-bold text-[#F1F5F9]">{abono.total}</p>
          <div className="text-[12px] text-[#94A3B8] flex items-center gap-2 flex-wrap pt-1">
            <span>
              {isClientes ? "Cliente:" : "Proveedor:"}{" "}
              <strong className="text-[#F1F5F9]">
                {abono.cliente || abono.proveedor || "No asignado"}
              </strong>
            </span>
            {!isClientes && abono.servicio && (
              <>
                <span className="text-[#475569]">·</span>
                <span>
                  Evento:{" "}
                  <strong className="text-[#F1F5F9]">{abono.evento}</strong>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Desglose de 50% Anticipo y 50% Saldo */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Esquema de Pagos (50% / 50%)
            </p>
            <span className="text-[11px] text-[#64748B]">
              Normativa contractual
            </span>
          </div>
          <div className="bg-[#1A1D23] border border-[#2D3748] rounded-xl overflow-hidden divide-y divide-[#2D3748]/60">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-[13px] font-medium text-[#F1F5F9]">
                  Anticipo Inicial (50%)
                </p>
                <p className="text-[11px] text-[#10B981] font-semibold">
                  {abono.anticipo}
                </p>
              </div>
              <StatusBadge status={abono.estadoAnticipo} />
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-[13px] font-medium text-[#F1F5F9]">
                  Saldo Final (50%)
                </p>
                <p className="text-[11px] text-[#64748B]">
                  {isClientes
                    ? "Exigible tras finalización satisfactoria del evento"
                    : "Exigible tras verificar cumplimiento del servicio"}
                </p>
                <p className="text-[11px] text-[#F59E0B] font-semibold mt-0.5">
                  {abono.saldo}
                </p>
              </div>
              <StatusBadge status={abono.estadoSaldo} />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[12px]">
            <span className="text-[#94A3B8]">
              Avance de Recaudo / Desembolso
            </span>
            <span className="font-bold text-[#F1F5F9]">
              {abono.porcentaje}%
            </span>
          </div>
          <div className="w-full bg-[#111318] h-2.5 rounded-full overflow-hidden border border-[#2D3748]">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                abono.porcentaje === 100
                  ? "bg-[#10B981]"
                  : abono.porcentaje >= 50
                    ? "bg-[#F59E0B]"
                    : "bg-[#EF4444]"
              }`}
              style={{ width: `${abono.porcentaje}%` }}
            />
          </div>
        </div>

        {/* Habilitación de "Crear Evento Operativo" si el anticipo 50% ya está pagado */}
        {isClientes && abono.estadoAnticipo === "Pagado" && (
          <div className="p-3.5 bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F1F5F9] flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#10B981]" />
                Anticipo 50% Confirmado · Venta Activa
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981]">
                Paso 5: Crear Evento
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Con el primer 50% cobrado, el evento pasa a ejecución. Aquí es donde se asignan los equipos del inventario, los empleados y sus tareas correspondientes.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose()
                navigate("/eventos/nuevo")
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all shadow-sm shadow-[#7C3AED]/20 cursor-pointer"
            >
              <Sparkles size={13} />
              <span>+ Crear Evento Operativo (Equipos y Personal)</span>
            </button>
          </div>
        )}

        {/* Historial de Transacciones (pago_cliente / pago_proveedor) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              Bitácora de Transacciones ({abono.historial.length})
            </p>
            <span className="text-[11px] text-[#64748B]">
              Comprobantes asociados
            </span>
          </div>
          {abono.historial.length === 0 ? (
            <div className="bg-[#1A1D23] border border-[#2D3748] rounded-xl p-4 text-center text-[12px] text-[#64748B]">
              No se han registrado comprobantes de pago aún.
            </div>
          ) : (
            <div className="space-y-2.5">
              {abono.historial.map((entry, i) => (
                <div
                  key={entry.id || i}
                  className="bg-[#1A1D23] border border-[#2D3748] rounded-xl p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/30">
                        {entry.tipoPago || entry.concepto}
                      </span>
                      <span className="text-xs text-[#94A3B8]">
                        {entry.fecha}
                      </span>
                    </div>
                    <span className="text-[14px] font-bold text-[#10B981]">
                      {entry.monto}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#94A3B8] flex items-center gap-2 flex-wrap">
                    <span>
                      Medio:{" "}
                      <strong className="text-[#CBD5E1]">{entry.metodo}</strong>
                    </span>
                    {entry.comprobante && (
                      <>
                        <span className="text-[#475569]">·</span>
                        <span className="flex items-center gap-1 text-[#60A5FA]">
                          <FileText size={11} />
                          Comprobante: <strong>{entry.comprobante}</strong>
                        </span>
                      </>
                    )}
                  </div>

                  {entry.observaciones && (
                    <p className="text-[11px] text-[#64748B] italic bg-[#111318] p-2 rounded-lg border border-[#262D3D]">
                      "{entry.observaciones}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Registrar Pago section (Basado en pago_cliente / pago_proveedor) */}
        {(showPagoForm ||
          abono.estadoAnticipo === "Pendiente" ||
          abono.estadoSaldo === "Pendiente") && (
          <div className="space-y-3 border-t border-[#2D3748] pt-4">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-[#F1F5F9] flex items-center gap-1.5">
                <TrendingUp size={16} className="text-[#10B981]" />
                Registrar Transacción (
                {isClientes ? "pago_cliente" : "pago_proveedor"})
              </p>
              {showPagoForm && (
                <button
                  type="button"
                  onClick={() => setShowPagoForm(false)}
                  className="text-xs text-[#94A3B8] hover:text-[#F1F5F9] cursor-pointer"
                >
                  Ocultar formulario
                </button>
              )}
            </div>

            {!showPagoForm ? (
              <button
                type="button"
                onClick={() => setShowPagoForm(true)}
                className="w-full py-2.5 border border-[#7C3AED]/50 text-[#A78BFA] rounded-xl text-[12px] font-semibold hover:bg-[#7C3AED]/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <TrendingUp size={14} />
                Ingresar nuevo abono / pago
              </button>
            ) : (
              <form
                onSubmit={onPagoSubmit}
                className="space-y-3.5 bg-[#14171F] border border-[#2D3748] rounded-xl p-4 shadow-sm"
              >
                {/* Tipo de Pago: Anticipo vs Saldo */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
                    Tipo de Pago (50%)
                  </label>
                  <CustomSelect
                    value={pagoForm.tipoPago}
                    onChange={(val) => {
                      const nuevoTipo = val as TipoPagoEnum
                      const sugerido =
                        nuevoTipo === "Anticipo" ? abono.anticipo : abono.saldo
                      setPagoForm((p) => ({
                        ...p,
                        tipoPago: nuevoTipo,
                        monto: p.monto || sugerido,
                      }))
                    }}
                    options={TIPO_PAGO_OPTIONS}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormInput
                    label="Valor / Monto"
                    placeholder="$ 0"
                    value={pagoForm.monto}
                    onChange={(e) =>
                      setPagoForm((p) => ({ ...p, monto: e.target.value }))
                    }
                    required
                  />
                  <FormInput
                    label="Fecha de Pago"
                    type="date"
                    value={pagoForm.fecha}
                    onChange={(e) =>
                      setPagoForm((p) => ({ ...p, fecha: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
                      Medio de Pago
                    </label>
                    <CustomSelect
                      value={pagoForm.metodo}
                      onChange={(val) =>
                        setPagoForm((p) => ({ ...p, metodo: val }))
                      }
                      options={METODO_PAGO_OPTIONS}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
                      Estado Transacción
                    </label>
                    <CustomSelect
                      value={pagoForm.estado}
                      onChange={(val) =>
                        setPagoForm((p) => ({
                          ...p,
                          estado: val as "Pagado" | "Pendiente",
                        }))
                      }
                      options={ESTADO_PAGO_OPTIONS}
                    />
                  </div>
                </div>

                {/* Comprobante / URL Comprobante (diagrama ER) */}
                <FormInput
                  label="Comprobante (N° Transacción o Referencia)"
                  placeholder="Ej. TR-2026-9941 o URL de soporte"
                  value={pagoForm.comprobante}
                  onChange={(e) =>
                    setPagoForm((p) => ({ ...p, comprobante: e.target.value }))
                  }
                  required
                />

                {/* Verificación de Regla de Negocio si es Saldo */}
                {pagoForm.tipoPago === "Saldo" && (
                  <div className="p-3 rounded-xl bg-[#1A1D23] border border-[#2D3748] space-y-1.5">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pagoForm.verificacionCondicion}
                        onChange={(e) =>
                          setPagoForm((p) => ({
                            ...p,
                            verificacionCondicion: e.target.checked,
                          }))
                        }
                        className="mt-0.5 rounded border-[#2D3748] text-[#7C3AED] focus:ring-[#7C3AED]"
                      />
                      <span className="text-[11px] text-[#CBD5E1] leading-relaxed">
                        {isClientes ? (
                          <>
                            <strong>Validación de Regla de Negocio:</strong>{" "}
                            Confirmo que el evento ha finalizado
                            satisfactoriamente para habilitar el recaudo del 50%
                            restante.
                          </>
                        ) : (
                          <>
                            <strong>Validación de Regla de Negocio:</strong>{" "}
                            Confirmo que se ha verificado el cumplimiento y
                            calidad de los servicios contratados al proveedor
                            para autorizar la liquidación del 50% restante.
                          </>
                        )}
                      </span>
                    </label>
                  </div>
                )}

                {/* Observaciones (diagrama ER) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] block">
                    Observaciones
                  </label>
                  <textarea
                    rows={2}
                    value={pagoForm.observaciones}
                    onChange={(e) =>
                      setPagoForm((p) => ({
                        ...p,
                        observaciones: e.target.value,
                      }))
                    }
                    placeholder="Detalles adicionales sobre la transacción o soporte..."
                    className="w-full px-3 py-2 bg-[#111318] border border-[#2D3748] rounded-xl text-xs text-[#F1F5F9] focus:outline-none focus:border-[#7C3AED] resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowPagoForm(false)}
                    className="flex-1 py-2 text-xs text-[#94A3B8] border border-[#2D3748] rounded-xl hover:bg-[#2D3748] transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-semibold bg-[#7C3AED] text-white rounded-xl hover:bg-[#6D28D9] transition-colors cursor-pointer shadow-sm shadow-[#7C3AED]/25"
                  >
                    Guardar Transacción
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Generar Recibo button */}
        <button
          type="button"
          onClick={onGenerarRecibo}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] rounded-xl text-[13px] font-semibold hover:bg-[#10B981]/25 transition-colors cursor-pointer"
        >
          <Receipt size={16} />
          Generar Comprobante / Recibo de Caja
        </button>
      </div>
    </Drawer>
  )
}
