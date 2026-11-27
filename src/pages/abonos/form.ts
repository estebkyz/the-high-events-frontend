import { formatCOP, todayISO } from "@/utils/format"
import { CARTERA } from "./constants"
import type { AbonoItem, EstadoPago, PagoForm, PagoHistorial, TipoPago } from "./types"
import { totalComprometido } from "./utils"

export const EMPTY_PAGO: PagoForm = {
  tipoPago: "Anticipo",
  montoNum: 0,
  fecha: "",
  metodo: "Transferencia",
  comprobante: "",
  estado: "Pagado",
  observaciones: "",
  condicionVerificada: false,
}

/** Lo que falta de la cuota, sin pasarse del total del acuerdo. */
export function montoSugerido(abono: AbonoItem, tipo: TipoPago): number {
  const cuota = tipo === "Anticipo" ? abono.anticipoNum : abono.saldoNum
  const abonado = totalComprometido(abono, tipo)
  const disponible = abono.totalNum - totalComprometido(abono)
  return Math.max(0, Math.min(cuota - abonado, disponible))
}

/** Quien no verifica pagos los registra pendientes. */
export function pagoInicial(abono: AbonoItem, canVerify: boolean): PagoForm {
  const tipoPago = abono.estadoAnticipo === "Pendiente" ? "Anticipo" : "Saldo"
  return {
    ...EMPTY_PAGO,
    tipoPago,
    montoNum: montoSugerido(abono, tipoPago),
    fecha: todayISO(),
    estado: canVerify ? "Pagado" : "Pendiente",
    condicionVerificada: Boolean(abono.eventoFinalizado),
  }
}

export function validatePago(form: PagoForm, abono: AbonoItem): string | null {
  if (!(form.montoNum > 0)) return "El monto del pago es obligatorio"
  const disponible = abono.totalNum - totalComprometido(abono)
  if (form.montoNum > disponible) {
    return `El monto supera lo pendiente del acuerdo (${formatCOP(disponible)})`
  }
  if (!form.fecha) return "La fecha de pago es obligatoria"
  if (form.fecha > todayISO()) return "La fecha de pago no puede ser futura"
  if (!form.comprobante.trim()) return "El comprobante o referencia es obligatorio"
  if (form.tipoPago === "Saldo" && !form.condicionVerificada) {
    return CARTERA[abono.tipoCartera].saldoBloqueado
  }
  return null
}

/** Cambios sobre el acuerdo al registrar una transacción. */
export function aplicarPago(abono: AbonoItem, form: PagoForm): Partial<AbonoItem> {
  const entry: PagoHistorial = {
    fecha: form.fecha,
    monto: formatCOP(form.montoNum),
    montoNum: form.montoNum,
    metodo: form.metodo,
    concepto: form.tipoPago,
    tipoPago: form.tipoPago,
    comprobante: form.comprobante.trim(),
    estado: form.estado,
    observaciones: form.observaciones.trim() || undefined,
  }
  const historial = [entry, ...abono.historial]
  return form.tipoPago === "Saldo" && abono.tipoCartera === "Proveedores"
    ? { historial, cumplimientoVerificado: true }
    : { historial }
}

/** Confirma o rechaza una transacción que estaba pendiente de verificación. */
export function verificarPago(
  abono: AbonoItem,
  pagoId: string,
  estado: EstadoPago,
): Partial<AbonoItem> {
  return {
    historial: abono.historial.map((pago) =>
      pago.id === pagoId ? { ...pago, estado } : pago,
    ),
  }
}
