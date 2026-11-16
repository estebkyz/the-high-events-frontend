import type { EstadoPagoVenta } from "./types"

export function formatVentaCOP(num: number): string {
  return `$ ${num.toLocaleString("es-CO")}`
}

export function pagoProgress(estado: EstadoPagoVenta | string): number {
  if (estado === "Pendiente") return 0
  if (estado === "Parcial") return 50
  return 100
}

export function pagoColor(estado: EstadoPagoVenta | string): string {
  if (estado === "Pendiente") return "#EF4444"
  if (estado === "Parcial") return "#F59E0B"
  return "#10B981"
}
