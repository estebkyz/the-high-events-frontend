import type { EventoItem } from "@/pages/eventos/types"
import { formatCOP, todayISO } from "@/utils/format"
import type { VentaForm, VentaItem } from "./types"

export const EMPTY_VENTA: VentaForm = {
  evento_id: "",
  numero_factura: "",
  fecha: "",
  totalNum: 0,
  estado_venta: "Confirmada",
}

export function emptyVentaHoy(): VentaForm {
  return { ...EMPTY_VENTA, fecha: todayISO() }
}

export function ventaToForm(item: VentaItem): VentaForm {
  const { evento_id, numero_factura, fecha, totalNum, estado_venta } = item
  return { evento_id, numero_factura, fecha, totalNum, estado_venta }
}

/** Al elegir el evento se propone su presupuesto como total. */
export function seleccionarEvento(
  form: VentaForm,
  evento: EventoItem | undefined,
): Partial<VentaForm> {
  return {
    evento_id: evento?.id ?? "",
    totalNum: form.totalNum || (evento?.presupuesto_estimado ?? 0),
  }
}

export function validateVenta(form: VentaForm): string | null {
  if (!form.evento_id) return "El evento es obligatorio"
  if (!form.numero_factura.trim()) return "El número de factura es obligatorio"
  if (!form.fecha) return "La fecha es obligatoria"
  if (!(form.totalNum > 0)) return "El monto total debe ser mayor a cero"
  return null
}

/** `total` (texto) siempre se deriva de `totalNum`. */
export function ventaToPayload(form: VentaForm) {
  return {
    ...form,
    numero_factura: form.numero_factura.trim(),
    total: formatCOP(form.totalNum),
  }
}
