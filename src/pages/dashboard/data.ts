import { REVENUE_SERIES } from "../../data"
import type { PeriodData, PeriodOption, EventoDraftFormState } from "./types"

export const PERIOD_OPTIONS: readonly PeriodOption[] = [
  { id: "oct-2026", label: "Octubre 2026" },
  { id: "q4-2026", label: "Trimestre Q4", sinDatos: true },
  { id: "2026", label: "Año 2026", sinDatos: true },
] as const

// Cobrado, meta y mes anterior salen de REVENUE_SERIES (fuente única), no de literales.
export const MILLON = 1_000_000
const mesActual = REVENUE_SERIES[REVENUE_SERIES.length - 1]
const mesAnterior = REVENUE_SERIES[REVENUE_SERIES.length - 2]

export const PERIOD_DATA: Record<string, PeriodData> = {
  "oct-2026": {
    vendido: 68_000_000,
    cobrado: Math.round(mesActual.ingresos * MILLON),
    ticket: 4_857_143,
    eventosConfirmados: 8,
    eventosTotal: 14,
    porCobrar: 15_200_000,
    porPagarProveedores: 6_400_000,
    rentabilidad: 26_100_000,
    metaCobrado: Math.round(mesActual.meta * MILLON),
    cobradoMesAnterior: Math.round(mesAnterior.ingresos * MILLON),
  },
}

export const CAL_YEAR = 2026
export const CAL_MONTH = 9 // octubre (0-indexed)
export const CAL_MONTH_NAME = "octubre"

// El estado se codifica con color Y con un glifo, no solo con color.
export const STATUS_META = {
  booked: { label: "Reservado cliente",
    legend: "Evento cliente",
    glyph: "●",
    cell: "bg-[#7C3AED]/25 text-[#F8FAFC] font-semibold",
    badge: "bg-[#7C3AED]/20 text-[#A78BFA]",
    swatch: "bg-[#7C3AED]/60",
  },
  own_event: {
    label: "Producción propia",
    legend: "Evento propio",
    glyph: "■",
    cell: "bg-[#10B981]/20 text-[#34D399] font-semibold",
    badge: "bg-[#10B981]/20 text-[#34D399]",
    swatch: "bg-[#10B981]/50",
  },
  technical_visit: {
    label: "Reunión",
    legend: "Reunión",
    glyph: "▲",
    cell: "bg-[#F59E0B]/20 text-[#FBBF24] font-semibold",
    badge: "bg-[#F59E0B]/20 text-[#FBBF24]",
    swatch: "bg-[#F59E0B]/50",
  },
  free: {
    label: "Fecha disponible",
    legend: "Disponible",
    glyph: "",
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
