import type { RouteId } from "../../types"
import type { CalendarDayStatus } from "../../data"

export type { RouteId, CalendarDayStatus }

export interface CalendarActivityItem {
  id: string
  type: "booked" | "own_event" | "technical_visit"
  title: string
  time: string
  locacion: string
  responsable?: string
}

export interface MultiEventCalendarDay {
  day: number
  activities: CalendarActivityItem[]
}

export interface CategoryRevenueItem {
  categoria: string
  monto: number // millones COP
  porcentaje: number
  eventos: number
  color: string
}

export interface ModalityBreakdownItem {
  label: string
  cantidad: number
  porcentaje: number
  ingresos: number // millones COP
  color: string
}

export interface OperationalStatItem {
  categoria: string
  completado: number
  pendiente: number
  alerta: number
  unidad: string
}

export interface PeriodData {
  monthIndex: number // 0-11
  year: number
  monthName: string
  previousMonthName: string
  vendido: number
  cobrado: number
  ticket: number
  eventosConfirmados: number
  eventosTotal: number
  porCobrar: number
  porPagarProveedores: number
  rentabilidad: number
  metaCobrado: number
  cobradoMesAnterior: number
  monthComparison: { label: string; actual: number; anterior: number }[]
  weekComparison: { day: string; actual: number; anterior: number }[]
  serviciosRevenue: CategoryRevenueItem[]
  modalidadEventos: ModalityBreakdownItem[]
  operacionStats: OperationalStatItem[]
  calendarDays: MultiEventCalendarDay[]
}

export interface PeriodOption {
  id: string
  label: string
  monthIndex: number
  year: number
}

export interface ChartSeries {
  name: string
  color: string
  values: number[] // millones de COP
  area?: boolean
  strong?: boolean
}

export interface ChartReference {
  value: number // millones de COP
  label: string
}

export interface EventoDraft {
  nombre: string
  modalidad: "Cliente" | "Propio"
  cliente: string
  fecha: string
  locacion: string
  presupuesto: number
}

export interface EventoDraftFormState {
  nombre: string
  modalidad: "Cliente" | "Propio"
  cliente: string
  fecha: string
  locacion: string
  presupuesto: string
}

export interface DashboardPageProps {
  onNavigate?: (route: RouteId) => void
  onCreateEvent?: (draft: EventoDraft) => void
}
