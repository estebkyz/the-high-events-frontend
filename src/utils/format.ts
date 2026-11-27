/** Formato único de moneda del sistema: `$ 1.250.000`. */
export function formatCOP(value: number | null | undefined): string {
  return `$ ${Math.round(Number(value ?? 0)).toLocaleString("es-CO")}`
}

/** Número de un texto monetario, sin centavos: `"$ 1.250.000,50"` → `1250000`. */
export function parseCOP(value: string | null | undefined): number {
  const [pesos] = (value ?? "").split(",")
  return Number(pesos.replace(/\D/g, "")) || 0
}

/** Fecha local `YYYY-MM-DD` (`toISOString` es UTC: de noche adelanta un día). */
export function todayISO(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

/** `YYYY-MM-DD` → fecha local, sin el desfase de UTC. */
function parseFecha(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null
}

/** `2026-12-20` → `20/12/2026`, como en el resto del sistema. */
export function formatFecha(iso: string | undefined): string {
  const date = parseFecha(iso ?? "")
  return date ? date.toLocaleDateString("es-CO", { dateStyle: "medium" }) : "Sin fecha"
}

/** `2026-12-20` → `domingo, 20 de diciembre de 2026`. */
export function formatFechaLarga(iso: string | undefined): string {
  const date = parseFecha(iso ?? "")
  return date ? date.toLocaleDateString("es-CO", { dateStyle: "full" }) : "Sin fecha"
}

/** `18:00` → `6:00 p. m.` */
export function formatHora(hora: string): string {
  const [hours, minutes] = hora.split(":").map(Number)
  return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString("es-CO", {
    timeStyle: "short",
  })
}

/** Días de `desde` a `hasta` (`YYYY-MM-DD`); negativo si ya pasó. */
export function diasEntre(desde: string, hasta: string): number | null {
  const start = parseFecha(desde)
  const end = parseFecha(hasta)
  return start && end ? Math.round((end.getTime() - start.getTime()) / 86_400_000) : null
}

/** Fecha y hora local `YYYY-MM-DD HH:mm`. */
export function nowLocal(date: Date = new Date()): string {
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${todayISO(date)} ${hours}:${minutes}`
}

/** Une las partes de un nombre, descartando vacíos. */
export function joinName(parts: (string | undefined)[], fallback: string): string {
  return parts.filter(Boolean).join(" ") || fallback
}

/** `3112223344` → `311 222 3344`; con indicativo, `+57 311 222 3344`. */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "")
  const group = (n: string) => `${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`
  if (digits.length === 12 && digits.startsWith("57"))
    return `+57 ${group(digits.slice(2))}`
  return digits.length === 10 ? group(digits) : raw
}
