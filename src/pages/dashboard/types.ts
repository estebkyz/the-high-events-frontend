import type { RouteId } from "../../types"
import type { CalendarDayStatus } from "../../data"

export type { RouteId, CalendarDayStatus }

export interface PeriodData {
  vendido: number; cobrado: number
  ticket: number
  eventosConfirmados: number
  eventosTotal: number
  porCobrar: number
  porPagarProveedores: number
  rentabilidad: number
  metaCobrado: number
  cobradoMesAnterior: number
}

export interface PeriodOption {
  id: string; label: string
  sinDatos?: boolean
}

export interface ChartSeries {
  name: string; color: string
  values: number[] // millones de COP
  area?: boolean
  strong?: boolean
}

export interface ChartReference {
  value: number // millones de COP
  label: string
}

export interface EventoDraft {
  nombre: string; modalidad: "Cliente" | "Propio"
  cliente: string
  fecha: string
  locacion: string
  presupuesto: number
}

export interface EventoDraftFormState {
  nombre: string; modalidad: "Cliente" | "Propio"
  cliente: string
  fecha: string
  locacion: string
  presupuesto: string
}

export interface DashboardPageProps {
  onNavigate?: (route: RouteId) => void
  onCreateEvent?: (draft: EventoDraft) => void
}
