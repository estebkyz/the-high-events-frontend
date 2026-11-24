/** Fechas y horarios del evento (`YYYY-MM-DDTHH:mm`, hora local). */

const DAY_MS = 86_400_000

export function splitDateTime(value: string): [date: string, time: string] {
  const [date = "", time = ""] = value.split("T")
  return [date, time.slice(0, 5)]
}

export function joinDateTime(date: string, time: string): string {
  return date || time ? `${date}T${time}` : ""
}

function addDays(isoDate: string, days: number): string {
  return new Date(Date.parse(isoDate) + days * DAY_MS).toISOString().slice(0, 10)
}

/** Evento nocturno: 19:00 → 02:00 el mismo día significa "al día siguiente". */
function normalizeEndDate(start: string, endDate: string, endTime: string): string {
  const [startDate, startTime] = splitDateTime(start)
  const isOvernight =
    startDate && startTime && endTime && endDate === startDate && endTime <= startTime
  return isOvernight ? addDays(startDate, 1) : endDate
}

interface Schedule {
  hora_inicio: string
  hora_fin: string
}

/** Al mover el inicio, el fin se desplaza igual y conserva la duración. */
export function moveStart(current: Schedule, date: string, time: string): Schedule {
  const [previousDate] = splitDateTime(current.hora_inicio)
  const [endDate, endTime] = splitDateTime(current.hora_fin)
  const hora_inicio = joinDateTime(date, time)

  let nextEnd = endDate || date
  if (date && previousDate && endDate) {
    const delta = Math.round((Date.parse(date) - Date.parse(previousDate)) / DAY_MS)
    nextEnd = addDays(endDate, delta)
  }
  return {
    hora_inicio,
    hora_fin: joinDateTime(normalizeEndDate(hora_inicio, nextEnd, endTime), endTime),
  }
}

/** Cambiar la hora de fin ajusta el día; una fecha elegida a mano se respeta. */
export function moveEndTime(current: Schedule, time: string): string {
  const [startDate] = splitDateTime(current.hora_inicio)
  const [endDate] = splitDateTime(current.hora_fin)
  const date = endDate || startDate
  return joinDateTime(normalizeEndDate(current.hora_inicio, date, time), time)
}

export function buildSchedule(date: string, start: string, end: string): Schedule {
  const hora_inicio = joinDateTime(date, start)
  return {
    hora_inicio,
    hora_fin: joinDateTime(normalizeEndDate(hora_inicio, date, end), end),
  }
}

/** `null` mientras el rango esté incompleto. */
export function durationMinutes({ hora_inicio, hora_fin }: Schedule): number | null {
  const isComplete = [hora_inicio, hora_fin].every((value) =>
    splitDateTime(value).every(Boolean),
  )
  if (!isComplete) return null
  return Math.round((Date.parse(hora_fin) - Date.parse(hora_inicio)) / 60_000)
}

export function formatDuration(minutes: number): string {
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  const rest = minutes % 60
  return [days && `${days} d`, hours && `${hours} h`, rest && `${rest} min`]
    .filter(Boolean)
    .join(" ")
}

/** `20 nov 2026, 7:00 p. m.` */
export function formatDateTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Sin fecha"
  return date.toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })
}

export function formatSchedule({ hora_inicio, hora_fin }: Schedule): string {
  return `${formatDateTime(hora_inicio)} – ${formatDateTime(hora_fin)}`
}

/** Día y mes corto para la tarjeta: `{ day: "20", month: "NOV" }`. */
export function dayAndMonth(value: string): { day: string; month: string } {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return { day: "--", month: "---" }
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: date
      .toLocaleString("es-CO", { month: "short" })
      .replace(".", "")
      .toUpperCase(),
  }
}
