import type { AbonoItem } from "./types"

export const CLIENT_ABONOS: AbonoItem[] = []

export const SUPPLIER_ABONOS: AbonoItem[] = []

export const TIPO_PAGO_OPTIONS = [
  { label: "Anticipo (50%)", value: "Anticipo" },
  { label: "Saldo (50%)", value: "Saldo" },
]

export const MEDIO_PAGO_OPTIONS = [
  { label: "Transferencia Bancaria", value: "Transferencia" },
  { label: "Efectivo", value: "Efectivo" },
]

export const ESTADO_PAGO_OPTIONS = [
  { label: "Pendiente Verificación", value: "Pendiente Verificación" },
  { label: "Confirmado", value: "Confirmado" },
  { label: "Rechazado", value: "Rechazado" },
]

export const METODO_PAGO_OPTIONS = MEDIO_PAGO_OPTIONS

export const INITIAL_ABONOS: AbonoItem[] = []
