import { todayISO } from "@/utils/format"
import { MESES } from "./constants"
import type { AgendaEvent, CalendarMonth } from "./types"

export function isReunion(event: Pick<AgendaEvent, "tipo_agendamiento">): boolean {
  return event.tipo_agendamiento === "reunion_cliente"
}

export function getEventISO({ year, month, day }: AgendaEvent): string {
  return todayISO(new Date(year, month, day))
}

export function parseISO(iso: string): { year: number; month: number; day: number } {
  const [year, month, day] = iso.split("-").map(Number)
  return { year, month: month - 1, day }
}

export function getToday() {
  return parseISO(todayISO())
}

export function shiftMonth({ year, month }: CalendarMonth, delta: number): CalendarMonth {
  const date = new Date(year, month + delta, 1)
  return { year: date.getFullYear(), month: date.getMonth() }
}

export function formatMonth({ year, month }: CalendarMonth): string {
  return `${MESES[month]} ${year}`
}

/** 42 celdas (6 semanas) que cubren el mes, comenzando en domingo. */
export function getCalendarDays({ year, month }: CalendarMonth): Date[] {
  const offset = new Date(year, month, 1).getDay()
  return Array.from({ length: 42 }, (_, i) => new Date(year, month, 1 - offset + i))
}

export function compareAgenda(a: AgendaEvent, b: AgendaEvent): number {
  return getEventISO(a).localeCompare(getEventISO(b)) || a.time.localeCompare(b.time)
}

/** Agendamiento vigente en la misma fecha y hora. */
export function findConflict(
  events: AgendaEvent[],
  dateISO: string,
  time: string,
  ignoreId?: string,
): AgendaEvent | undefined {
  return events.find(
    (ev) =>
      ev.id !== ignoreId &&
      getEventISO(ev) === dateISO &&
      ev.time.slice(0, 5) === time.slice(0, 5) &&
      ev.estado !== "Cancelado",
  )
}
