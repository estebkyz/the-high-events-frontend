import type { EntityLabel } from "@/hooks/useCrudActions"
import type { EstadoOperativo } from "@/pages/equipos/types"
import { toOptions } from "@/utils/list"
import type { CondicionEquipo, PrestamoEstado } from "./types"

export const PRESTAMO_LABEL: EntityLabel = {
  singular: "préstamo",
  plural: "préstamos",
  gender: "m",
}

export const PRESTAMO_FILTERS = { estado: "Estado" }

export const ESTADOS_PRESTAMO: PrestamoEstado[] = [
  "Activo",
  "Devuelto",
  "Con Retraso",
  "Con Daños",
]
export const ESTADO_PRESTAMO_OPTIONS = toOptions(ESTADOS_PRESTAMO)
export const ESTADO_PRESTAMO_TABS = [
  { id: "Activo", label: "Activos" },
  { id: "Devuelto", label: "Devueltos" },
  { id: "Con Retraso", label: "Con retraso" },
  { id: "Con Daños", label: "Con daños" },
]

/** Estados desde los que un equipo puede prestarse. */
export const PRESTABLES: EstadoOperativo[] = ["Disponible", "En Evento"]

const CONDICIONES: CondicionEquipo[] = ["Excelente", "Bueno", "Regular", "Dañado"]
export const CONDICION_RETORNO_OPTIONS = toOptions(CONDICIONES)
/** Un equipo dañado no sale en préstamo. */
export const CONDICION_SALIDA_OPTIONS = toOptions(
  CONDICIONES.filter((c) => c !== "Dañado"),
)
