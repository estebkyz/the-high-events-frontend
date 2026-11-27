import type { EquipoItem } from "@/pages/equipos/types"
import { ROUTE_PATHS } from "@/routes/paths"
import { uniqueValues } from "@/utils/list"
import type { EventoDocumento } from "./types"

const plural = (n: number, uno: string, varios: string) =>
  `${n} ${n === 1 ? uno : varios}`

/** Documentos en borrador que preparará el servidor al guardar el evento. */
export function resumenDocumentos(equipos: EquipoItem[]): string | null {
  if (equipos.length === 0) return null
  const propios = equipos.filter((eq) => eq.propiedad === "Propio").length
  const proveedores = uniqueValues(
    equipos
      .filter((eq) => eq.propiedad === "Alquilado")
      .map((eq) => eq.proveedor_nombre ?? "Proveedor"),
  )
  const origenes = [...(propios > 0 ? ["Equipos propios"] : []), ...proveedores]
  const partes = [
    propios > 0 && `1 préstamo (${plural(propios, "equipo", "equipos")})`,
    `${plural(origenes.length, "recepción", "recepciones")} (${origenes.join(", ")})`,
  ]
  return partes.filter(Boolean).join(" y ")
}

/** Módulo donde se gestiona el documento. */
export function rutaDocumento({ tipo }: EventoDocumento): string {
  return tipo === "prestamo" ? ROUTE_PATHS.prestamos : ROUTE_PATHS.recepciones
}
