import { BookOpen, List } from "lucide-react"
import type { SegmentedOption } from "@/components/SegmentedControl"
import type { EntityLabel } from "@/hooks/useCrudActions"
import { toOptions } from "@/utils/list"
import type { EstadoTarea, Fase, Prioridad } from "./types"

export const TAREA_LABEL: EntityLabel = {
  singular: "tarea",
  plural: "tareas",
  gender: "f",
}

export const TAREA_FILTERS = {
  evento: "Evento",
  fase: "Fase",
  empleado: "Responsable",
  prioridad: "Prioridad",
  estado: "Estado",
}

export const TAREA_VIEWS: SegmentedOption[] = [
  { value: "table", label: "Tabla", icon: List },
  { value: "catalogo", label: "Catálogo", icon: BookOpen },
]

export const FASES: Fase[] = ["Planificación", "Montaje", "Ejecución", "Desmontaje"]
export const FASE_OPTIONS = toOptions(FASES)

const PRIORIDADES: Prioridad[] = ["Alta", "Media", "Baja"]
export const PRIORIDAD_OPTIONS = toOptions(PRIORIDADES)

export const ESTADOS_TAREA: EstadoTarea[] = ["Pendiente", "En Proceso", "Completada"]
export const ESTADO_TAREA_TABS = [
  { id: "Pendiente", label: "Pendientes" },
  { id: "En Proceso", label: "En proceso" },
  { id: "Completada", label: "Completadas" },
]
