import type { AgendaEvent } from "./types"

/**
 * Utilidades y reglas de dominio de Agendamiento (fechas y estados).
 * Mapeado a los 4 estados oficiales de Workbench: ENUM('pendiente', 'confirmado', 'cancelado', 'realizado')
 */

export type GrupoEstado =
  | "pendiente"
  | "confirmado"
  | "realizado"
  | "cancelado"

export const GRUPO_META: Record<
  GrupoEstado,
  {
    label: string
    color: string
    text: string
    badgeClass: string
    chipClass: string
  }
> = {
  pendiente: {
    label: "Pendiente",
    color: "#F59E0B",
    text: "#B45309",
    badgeClass:
      "bg-amber-100 text-amber-800 border border-amber-300 dark:bg-[#F59E0B]/20 dark:text-[#FCD34D] dark:border-[#F59E0B]/30",
    chipClass:
      "bg-amber-100 text-amber-900 border-l-[3px] border-l-amber-600 dark:bg-[#F59E0B]/20 dark:text-[#FCD34D] dark:border-l-[#F59E0B]",
  },
  confirmado: {
    label: "Confirmado",
    color: "#3B82F6",
    text: "#1D4ED8",
    badgeClass:
      "bg-blue-100 text-blue-800 border border-blue-300 dark:bg-[#3B82F6]/20 dark:text-[#93C5FD] dark:border-[#3B82F6]/30",
    chipClass:
      "bg-blue-100 text-blue-900 border-l-[3px] border-l-blue-600 dark:bg-[#3B82F6]/20 dark:text-[#93C5FD] dark:border-l-[#3B82F6]",
  },
  realizado: {
    label: "Realizado",
    color: "#10B981",
    text: "#047857",
    badgeClass:
      "bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-[#10B981]/20 dark:text-[#6EE7B7] dark:border-[#10B981]/30",
    chipClass:
      "bg-emerald-100 text-emerald-900 border-l-[3px] border-l-emerald-600 dark:bg-[#10B981]/20 dark:text-[#6EE7B7] dark:border-l-[#10B981]",
  },
  cancelado: {
    label: "Cancelado",
    color: "#EF4444",
    text: "#B91C1C",
    badgeClass:
      "bg-red-100 text-red-800 border border-red-300 dark:bg-[#EF4444]/20 dark:text-[#FCA5A5] dark:border-[#EF4444]/30",
    chipClass:
      "bg-red-100 text-red-900 border-l-[3px] border-l-red-600 dark:bg-[#EF4444]/20 dark:text-[#FCA5A5] dark:border-l-[#EF4444]",
  },
}

const ESTADO_GRUPO: Record<string, GrupoEstado> = {
  Pendiente: "pendiente",
  pendiente: "pendiente",
  Confirmado: "confirmado",
  confirmado: "confirmado",
  Realizado: "realizado",
  realizado: "realizado",
  Cancelado: "cancelado",
  cancelado: "cancelado",
  // Aliases de compatibilidad UI
  Programada: "pendiente",
  Confirmada: "confirmado",
  Realizada: "realizado",
  Cancelada: "cancelado",
  "En Ejecución": "confirmado",
  Finalizado: "realizado",
  Cotización: "pendiente",
}

export const getGrupo = (estado: string): GrupoEstado =>
  ESTADO_GRUPO[estado] ?? "pendiente"

export const getEstadoMeta = (estado: string) => GRUPO_META[getGrupo(estado)]

export const getEstadoColor = (estado: string) => getEstadoMeta(estado).color

export const ESTADO_COLORS: Record<string, string> = Object.fromEntries(
  Object.keys(ESTADO_GRUPO).map((estado) => [estado, getEstadoColor(estado)]),
)

export const esPorConfirmar = (ev: Pick<AgendaEvent, "estado">) =>
  getGrupo(ev.estado) === "pendiente"

export function compareAgenda(a: AgendaEvent, b: AgendaEvent) {
  return (
    a.year - b.year ||
    a.month - b.month ||
    a.day - b.day ||
    a.time.localeCompare(b.time)
  )
}

export function esAnteriorA(
  ev: AgendaEvent,
  year: number,
  month: number,
  day: number,
) {
  return (
    ev.year < year ||
    (ev.year === year &&
      (ev.month < month || (ev.month === month && ev.day < day)))
  )
}

export const FILTROS_ESTADO: { value: string; label: string }[] = [
  { value: "Todos", label: "Todos los Estados" },
  { value: "pendiente", label: "Pendientes" },
  { value: "confirmado", label: "Confirmados" },
  { value: "realizado", label: "Realizados" },
  { value: "cancelado", label: "Cancelados" },
]

export const labelFiltroEstado = (value: string) =>
  FILTROS_ESTADO.find((f) => f.value === value)?.label ?? value

export function coincideEstado(
  ev: Pick<AgendaEvent, "estado">,
  filtro: string,
) {
  if (filtro === "Todos") return true
  if (filtro in GRUPO_META) return getGrupo(ev.estado) === filtro
  return ev.estado === filtro || getGrupo(ev.estado) === getGrupo(filtro)
}

export function formatToISODate(
  year: number,
  monthZeroIndexed: number,
  day: number,
): string {
  const m = String(monthZeroIndexed + 1).padStart(2, "0")
  const d = String(day).padStart(2, "0")
  return `${year}-${m}-${d}`
}

export function parseDateISO(
  iso: string,
  fallbackYear: number,
  fallbackMonth: number,
  fallbackDay: number,
): { year: number; month: number; day: number } {
  const [y, m, d] = (iso || "").split("-").map(Number)
  return {
    year: y || fallbackYear,
    month: m ? m - 1 : fallbackMonth,
    day: d || fallbackDay,
  }
}

export function getDaysInMonth(year: number, monthZeroIndexed: number): number {
  return new Date(year, monthZeroIndexed + 1, 0).getDate()
}

export function getStartDayOfWeek(
  year: number,
  monthZeroIndexed: number,
): number {
  return new Date(year, monthZeroIndexed, 1).getDay()
}
