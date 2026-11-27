import type { EntityLabel } from "@/hooks/useCrudActions"
import { toOptions } from "@/utils/list"
import type { EstadoPagoVenta, EstadoVenta } from "./types"

export const VENTA_LABEL: EntityLabel = {
  singular: "venta",
  plural: "ventas",
  gender: "f",
}

export const VENTA_FILTERS = { tipo: "Tipo", pago: "Pago", estado: "Estado" }

export const ESTADOS_VENTA: EstadoVenta[] = ["Confirmada", "Anulada"]
export const ESTADO_VENTA_OPTIONS = toOptions(ESTADOS_VENTA)

const ESTADOS_PAGO: EstadoPagoVenta[] = ["Pendiente", "Parcial", "Pagado"]
export const ESTADO_PAGO_OPTIONS = toOptions(ESTADOS_PAGO)
export const ESTADO_PAGO_TABS = [
  { id: "Pendiente", label: "Pendientes" },
  { id: "Parcial", label: "Parciales" },
  { id: "Pagado", label: "Pagadas" },
]

export const TIPO_VENTA_OPTIONS = [
  { value: "Cliente", label: "Cliente" },
  { value: "Propio", label: "Propio" },
]
