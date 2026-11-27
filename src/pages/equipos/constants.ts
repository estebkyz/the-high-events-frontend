import type { EntityLabel } from "@/hooks/useCrudActions"
import { toOptions } from "@/utils/list"
import type { EstadoOperativo } from "./types"
import { EMPRESA } from "@/constants/empresa"

export const EQUIPO_LABEL: EntityLabel = {
  singular: "equipo",
  plural: "equipos",
  gender: "m",
}

export const EQUIPO_FILTERS = {
  desde: "Desde",
  hasta: "Hasta",
  disponibilidad: "Disponibilidad",
  categoria: "Categoría",
  estado: "Estado",
}

export const DISPONIBLE = "Disponible"
export const NO_DISPONIBLE = "No disponible"
export const DISPONIBILIDAD_OPTIONS = toOptions([DISPONIBLE, NO_DISPONIBLE])

export const ESTADOS_OPERATIVOS: EstadoOperativo[] = [
  "Disponible",
  "En Evento",
  "Prestado",
  "En Mantenimiento",
  "De Baja",
]

export const ESTADO_OPERATIVO_OPTIONS = toOptions(ESTADOS_OPERATIVOS)

export const ESTADO_OPERATIVO_TABS = [
  { id: "Disponible", label: "Disponibles" },
  { id: "En Evento", label: "En evento" },
  { id: "Prestado", label: "Prestados" },
  { id: "En Mantenimiento", label: "Mantenimiento" },
]

export const PROPIEDAD_OPTIONS = [
  { label: `Propio (${EMPRESA.nombre})`, value: "Propio" },
  { label: "Alquilado (proveedor externo)", value: "Alquilado" },
]
