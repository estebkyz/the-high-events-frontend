import type { EquipoItem } from "./types"

/** Texto que identifica un equipo: "Nombre (SERIE)". */
export function getEquipoTexto({
  nombre,
  serie,
}: Pick<EquipoItem, "nombre" | "serie">): string {
  return serie ? `${nombre} (${serie})` : nombre
}
