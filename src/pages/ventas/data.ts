import type { VentaItem, EstadoPagoVenta, TipoVenta } from "./types"

export const ESTADO_PAGO_OPTIONS: EstadoPagoVenta[] = [
  "Pendiente",
  "Parcial",
  "Pagado",
]

export const TIPO_VENTA_OPTIONS: { value: TipoVenta; label: string }[] = [
  { value: "Cliente", label: "Cliente" },
  { value: "Propio", label: "Propio" },
]

export const INITIAL_SALES: VentaItem[] = []
