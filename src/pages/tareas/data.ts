import type { TareaItem, Prioridad, EstadoTarea, Fase } from "./types"
import type { AsignacionesMap } from "../eventos/types"

export const INITIAL_TASKS: TareaItem[] = []

export function getEventoTareasStore(): TareaItem[] {
  return []
}

export function saveEventoTareasStore(_tasks: TareaItem[]): void {
  // Manejado directamente por la API REST (/api/evento-tareas)
}

export function syncEventoTareasFromEvento(
  _eventoNombre: string,
  _horaInicioEvento: string | undefined,
  _assignments: AsignacionesMap,
): void {
  // Sincronizado vía API al guardar el evento en la base de datos
}

export const PRIORIDAD_DOT: Record<Prioridad, string> = {
  Alta: "bg-[#EF4444]",
  Media: "bg-[#F59E0B]",
  Baja: "bg-[#10B981]",
}

export const KANBAN_HEADER_COLORS: Record<EstadoTarea, string> = {
  Pendiente: "text-[#F59E0B]",
  "En Proceso": "text-[#3B82F6]",
  Completada: "text-[#10B981]",
}

export const KANBAN_BORDER_COLORS: Record<EstadoTarea, string> = {
  Pendiente: "border-[#F59E0B]/30",
  "En Proceso": "border-[#3B82F6]/30",
  Completada: "border-[#10B981]/30",
}

export const FASE_OPTIONS: { label: string; value: Fase }[] = [
  { label: "Planificación", value: "Planificación" },
  { label: "Montaje", value: "Montaje" },
  { label: "Ejecución", value: "Ejecución" },
  { label: "Desmontaje", value: "Desmontaje" },
]

export const PRIORIDAD_OPTIONS: { label: string; value: Prioridad }[] = [
  { label: "Alta", value: "Alta" },
  { label: "Media", value: "Media" },
  { label: "Baja", value: "Baja" },
]
