import type {
  PeriodData,
  PeriodOption,
  EventoDraftFormState,
  DashboardRangeType,
} from "./types"

const now = new Date()
const CURRENT_YEAR = now.getFullYear()
const CURRENT_MONTH = now.getMonth()

export const PERIOD_OPTIONS: readonly PeriodOption[] = [
  { id: "nov-2026", label: "Noviembre 2026", monthIndex: 10, year: 2026 },
  { id: "oct-2026", label: "Octubre 2026", monthIndex: 9, year: 2026 },
  { id: "sep-2026", label: "Septiembre 2026", monthIndex: 8, year: 2026 },
  { id: "ago-2026", label: "Agosto 2026", monthIndex: 7, year: 2026 },
  { id: "dic-2026", label: "Diciembre 2026", monthIndex: 11, year: 2026 },
] as const

export const PERIOD_OPTIONS_BY_RANGE: Record<
  DashboardRangeType,
  readonly PeriodOption[]
> = {
  dia: [
    { id: "hoy-2026", label: "Hoy", monthIndex: CURRENT_MONTH, year: CURRENT_YEAR },
  ],
  semana: [
    { id: "sem-2026", label: "Semana Actual", monthIndex: CURRENT_MONTH, year: CURRENT_YEAR },
  ],
  mes: PERIOD_OPTIONS,
  anio: [
    { id: "anio-2026", label: `Año ${CURRENT_YEAR}`, monthIndex: CURRENT_MONTH, year: CURRENT_YEAR },
  ],
}

export const MILLON = 1_000_000

const EMPTY_PERIOD: PeriodData = {
  monthIndex: CURRENT_MONTH,
  year: CURRENT_YEAR,
  monthName: "período actual",
  previousMonthName: "período anterior",
  vendido: 0,
  cobrado: 0,
  ticket: 0,
  eventosConfirmados: 0,
  eventosTotal: 0,
  porCobrar: 0,
  porPagarProveedores: 0,
  rentabilidad: 0,
  metaCobrado: 0,
  cobradoMesAnterior: 0,
  monthComparison: [
    { label: "Sem 1", actual: 0, anterior: 0 },
    { label: "Sem 2", actual: 0, anterior: 0 },
    { label: "Sem 3", actual: 0, anterior: 0 },
    { label: "Sem 4", actual: 0, anterior: 0 },
  ],
  weekComparison: [
    { day: "Lun", actual: 0, anterior: 0 },
    { day: "Mar", actual: 0, anterior: 0 },
    { day: "Mié", actual: 0, anterior: 0 },
    { day: "Jue", actual: 0, anterior: 0 },
    { day: "Vie", actual: 0, anterior: 0 },
    { day: "Sáb", actual: 0, anterior: 0 },
    { day: "Dom", actual: 0, anterior: 0 },
  ],
  serviciosRevenue: [],
  modalidadEventos: [],
  operacionStats: [
    { categoria: "Equipos Técnicos", completado: 0, pendiente: 0, alerta: 0, unidad: "equipos" },
    { categoria: "Tareas Operativas", completado: 0, pendiente: 0, alerta: 0, unidad: "tareas" },
    { categoria: "Actas de Recepción", completado: 0, pendiente: 0, alerta: 0, unidad: "actas" },
    { categoria: "Incidentes Reportados", completado: 0, pendiente: 0, alerta: 0, unidad: "casos" },
  ],
  calendarDays: [],
}

export const PERIOD_DATA: Record<string, PeriodData> = {
  "hoy-2026": EMPTY_PERIOD,
  "sem-2026": EMPTY_PERIOD,
  "nov-2026": { ...EMPTY_PERIOD, monthIndex: 10, year: 2026, monthName: "noviembre", previousMonthName: "octubre" },
  "oct-2026": { ...EMPTY_PERIOD, monthIndex: 9, year: 2026, monthName: "octubre", previousMonthName: "septiembre" },
  "sep-2026": { ...EMPTY_PERIOD, monthIndex: 8, year: 2026, monthName: "septiembre", previousMonthName: "agosto" },
  "ago-2026": { ...EMPTY_PERIOD, monthIndex: 7, year: 2026, monthName: "agosto", previousMonthName: "julio" },
  "dic-2026": { ...EMPTY_PERIOD, monthIndex: 11, year: 2026, monthName: "diciembre", previousMonthName: "noviembre" },
  "anio-2026": { ...EMPTY_PERIOD, monthName: "2026", previousMonthName: "2025" },
}

export function getDashboardPeriodData(periodId: string): PeriodData {
  return PERIOD_DATA[periodId] ?? EMPTY_PERIOD
}

export const CAL_YEAR = CURRENT_YEAR
export const CAL_MONTH = CURRENT_MONTH
export const CAL_MONTH_NAME = "noviembre"

export const STATUS_META = {
  booked: {
    label: "Evento de cliente",
    legend: "Evento cliente",
    description: "Evento contratado por un cliente con cotización confirmada",
    glyph: "●",
    dotColor: "bg-[#A78BFA]",
    cell: "bg-[#7C3AED]/25 text-[#F8FAFC] font-semibold border-[#7C3AED]/40",
    badge: "bg-[#7C3AED]/20 text-[#A78BFA]",
    swatch: "bg-[#7C3AED]",
  },
  own_event: {
    label: "Evento propio",
    legend: "Evento propio",
    description: "Producción propia organizada por The High Events",
    glyph: "■",
    dotColor: "bg-[#34D399]",
    cell: "bg-[#10B981]/20 text-[#34D399] font-semibold border-[#10B981]/40",
    badge: "bg-[#10B981]/20 text-[#34D399]",
    swatch: "bg-[#10B981]",
  },
  technical_visit: {
    label: "Visita técnica / Reunión",
    legend: "Visita / Reunión",
    description: "Inspección técnica en lugar del evento o reunión de cotización",
    glyph: "▲",
    dotColor: "bg-[#FBBF24]",
    cell: "bg-[#F59E0B]/20 text-[#FBBF24] font-semibold border-[#F59E0B]/40",
    badge: "bg-[#F59E0B]/20 text-[#FBBF24]",
    swatch: "bg-[#F59E0B]",
  },
  free: {
    label: "Fecha disponible",
    legend: "Disponible",
    description: "Sin actividades programadas aún (disponible para agendar)",
    glyph: "",
    dotColor: "bg-[#475569]",
    cell: "bg-[#111318] text-[#CBD5E1] hover:border-[#3B455A]",
    badge: "bg-[#222734] text-[#CBD5E1]",
    swatch: "bg-[#111318]",
  },
} as const

export const EMPTY_DRAFT: EventoDraftFormState = {
  nombre: "",
  modalidad: "Cliente",
  cliente: "",
  fecha: "",
  locacion: "",
  presupuesto: "",
}
