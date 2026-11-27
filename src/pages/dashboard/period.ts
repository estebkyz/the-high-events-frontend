import { todayISO } from "@/utils/format"
import type { Bucket, DateRange, Period, RangeType } from "./types"

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

function toDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

function daysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

function mondayOf(date: Date): Date {
  return addDays(date, -((date.getDay() + 6) % 7))
}

function dayBucket(label: string, date: Date): Bucket {
  const iso = todayISO(date)
  return { label, from: iso, to: iso }
}

function buildBuckets(type: RangeType, anchor: Date): Bucket[] {
  switch (type) {
    case "dia":
      // Un día aislado no dibuja tendencia: se muestran los 7 que terminan en él.
      return Array.from({ length: 7 }, (_, i) => {
        const date = addDays(anchor, i - 6)
        return dayBucket(`${date.getDate()}/${date.getMonth() + 1}`, date)
      })
    case "semana":
      return DIAS.map((dia, i) => dayBucket(dia, addDays(mondayOf(anchor), i)))
    case "mes": {
      const last = daysInMonth(anchor)
      const at = (day: number) =>
        todayISO(new Date(anchor.getFullYear(), anchor.getMonth(), day))
      return [1, 8, 15, 22, 29]
        .filter((start) => start <= last)
        .map((start, i) => ({
          label: `Sem ${i + 1}`,
          from: at(start),
          to: at(Math.min(start + 6, last)),
        }))
    }
    case "anio":
      return Array.from({ length: 12 }, (_, month) => {
        const date = new Date(anchor.getFullYear(), month, 1)
        const label = date.toLocaleString("es-CO", { month: "short" }).replace(".", "")
        return {
          label,
          from: todayISO(date),
          to: todayISO(new Date(anchor.getFullYear(), month, daysInMonth(date))),
        }
      })
  }
}

function formatLabel(type: RangeType, anchor: Date): string {
  switch (type) {
    case "dia":
      return anchor.toLocaleDateString("es-CO", { dateStyle: "long" })
    case "semana": {
      const monday = mondayOf(anchor)
      const format = (d: Date) =>
        d.toLocaleDateString("es-CO", { day: "numeric", month: "short" })
      return `${format(monday)} – ${format(addDays(monday, 6))}`
    }
    case "mes":
      return anchor.toLocaleDateString("es-CO", { month: "long", year: "numeric" })
    case "anio":
      return String(anchor.getFullYear())
  }
}

/** Fecha ancla desplazada `delta` períodos. */
export function shiftAnchor(type: RangeType, iso: string, delta: number): string {
  const date = toDate(iso)
  switch (type) {
    case "dia":
      return todayISO(addDays(date, delta))
    case "semana":
      return todayISO(addDays(date, delta * 7))
    case "mes":
      return todayISO(new Date(date.getFullYear(), date.getMonth() + delta, 1))
    case "anio":
      return todayISO(new Date(date.getFullYear() + delta, date.getMonth(), 1))
  }
}

export function getPeriod(type: RangeType, iso: string): Period {
  const anchor = toDate(iso)
  const buckets = buildBuckets(type, anchor)
  const previous =
    type === "dia" ? addDays(anchor, -7) : toDate(shiftAnchor(type, iso, -1))
  const range: DateRange =
    type === "dia"
      ? { from: iso, to: iso }
      : { from: buckets[0].from, to: buckets[buckets.length - 1].to }
  return {
    range,
    label: formatLabel(type, anchor),
    buckets,
    previousBuckets: buildBuckets(type, previous),
  }
}

const NOMBRE_ANTERIOR: Record<RangeType, (inicio: Date) => string> = {
  dia: () => "el día anterior",
  semana: () => "la semana anterior",
  mes: (inicio) => inicio.toLocaleDateString("es-CO", { month: "long" }),
  anio: (inicio) => String(inicio.getFullYear()),
}

/**
 * Período con el que se compara. Si el actual aún no termina, el anterior se corta
 * en el mismo día: comparar un mes a medias con uno completo siempre daría una caída.
 */
export function getComparison(
  type: RangeType,
  iso: string,
  hoy: string,
): { range: DateRange; label: string } {
  const { range } = getPeriod(type, iso)
  const previous = getPeriod(type, shiftAnchor(type, iso, -1)).range
  const start = toDate(previous.from)
  const label = NOMBRE_ANTERIOR[type](start)
  if (hoy < range.from || hoy >= range.to) return { range: previous, label }

  const elapsed = Math.round(
    (toDate(hoy).getTime() - toDate(range.from).getTime()) / 86_400_000,
  )
  const cut = todayISO(addDays(start, elapsed))
  return {
    range: { from: previous.from, to: cut < previous.to ? cut : previous.to },
    label: `${label} a la fecha`,
  }
}

/** Acepta `YYYY-MM-DD` y `YYYY-MM-DDTHH:mm`. */
export function isInRange(date: string | undefined, { from, to }: DateRange): boolean {
  const day = (date ?? "").slice(0, 10)
  return day >= from && day <= to
}
