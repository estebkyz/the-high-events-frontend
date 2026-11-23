import type {
  EquipoItem,
  Categoria,
  EstadoOperativo,
  MantenimientoEntry,
} from "./types"

export const CATEGORIA_OPTIONS: Categoria[] = [
  "Audio",
  "Iluminación",
  "Video",
  "Estructuras",
]

export const PROPIEDAD_OPTIONS = [
  "Propio",
  "Alquilado",
] as const

export const ESTADO_OPERATIVO_OPTIONS: EstadoOperativo[] = [
  "Disponible",
  "En Evento",
  "Prestado",
  "En Mantenimiento",
  "De Baja",
]

export const MAINTENANCE_HISTORY: Record<string, MantenimientoEntry[]> = {}

export const INITIAL_EQUIPMENT: EquipoItem[] = []

export const INITIAL_EQUIPOS = INITIAL_EQUIPMENT
