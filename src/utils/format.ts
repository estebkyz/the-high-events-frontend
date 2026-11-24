/** Formato único de moneda del sistema: `$ 1.250.000`. */
export function formatCOP(value: number | null | undefined): string {
  return `$ ${Math.round(Number(value ?? 0)).toLocaleString("es-CO")}`
}

/** Extrae el número de un texto monetario: `"$ 1.250.000"` → `1250000`. */
export function parseCOP(value: string | null | undefined): number {
  return Number((value ?? "").replace(/\D/g, "")) || 0
}

/** Fecha local `YYYY-MM-DD` (`toISOString` es UTC: de noche adelanta un día). */
export function todayISO(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
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
