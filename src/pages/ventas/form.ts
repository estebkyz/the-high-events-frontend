import type { EventoItem } from "@/pages/eventos/types"
import { todayISO } from "@/utils/format"
import type { VentaForm, VentaItem } from "./types"

export const EMPTY_VENTA: VentaForm = {
  evento_id: "",
  numero_factura: "",
  fecha: "",
  estado_venta: "Confirmada",
}

export function emptyVentaHoy(): VentaForm {
  return { ...EMPTY_VENTA, fecha: todayISO() }
}

export function ventaToForm(item: VentaItem): VentaForm {
  const { evento_id, numero_factura, fecha, estado_venta } = item
  return { evento_id, numero_factura, fecha, estado_venta }
}

/** Solo se vende un evento aceptado o en curso que ya tiene valor. */
export function eventoVendible(evento: EventoItem): boolean {
  return (
    evento.estado !== "Cotización" &&
    evento.estado !== "Cancelado" &&
    (evento.valor_total ?? 0) > 0
  )
}

export function validateVenta(
  form: VentaForm,
  evento: EventoItem | undefined,
): string | null {
  if (!form.evento_id) return "El evento es obligatorio"
  if (evento && !eventoVendible(evento)) {
    return "Ese evento aún no tiene valor: defínelo en Eventos o acepta su cotización"
  }
  if (!form.numero_factura.trim()) return "El número de factura es obligatorio"
  if (!form.fecha) return "La fecha es obligatoria"
  return null
}

export function ventaToPayload(form: VentaForm) {
  return { ...form, numero_factura: form.numero_factura.trim() }
}
