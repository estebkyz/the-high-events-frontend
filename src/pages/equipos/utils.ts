import { DISPONIBLE, NO_DISPONIBLE } from "./constants"
import type { DisponibilidadEquipo, EquipoItem, RangoFechas } from "./types"

/** Texto que identifica un equipo: "Nombre (SERIE)". */
export function getEquipoTexto({
  nombre,
  serie,
}: Pick<EquipoItem, "nombre" | "serie">): string {
  return serie ? `${nombre} (${serie})` : nombre
}

/** Días completos de la consulta; sin fecha inicial, "ahora". Un solo día si no hay final. */
export function rangoDeDias(desde: string, hasta: string): RangoFechas | null {
  if (!desde) return null
  return { inicio: `${desde}T00:00`, fin: `${hasta > desde ? hasta : desde}T23:59` }
}

export function estadoDisponibilidad(
  disponibilidad: DisponibilidadEquipo | undefined,
): string | undefined {
  if (!disponibilidad) return undefined
  return disponibilidad.disponible ? DISPONIBLE : NO_DISPONIBLE
}
