/** ENUM('planificacion','montaje','ejecucion','desmontaje') */
export type Fase = "Planificación" | "Montaje" | "Ejecución" | "Desmontaje"

export type Prioridad = "Alta" | "Media" | "Baja"

/** ENUM('pendiente','en_proceso','completada') */
export type EstadoTarea = "Pendiente" | "En Proceso" | "Completada"

/** Tarea asignada a un evento y empleado (`evento_tarea`). */
export interface TareaItem {
  id: string
  tarea_id?: string
  codigo_tarea?: string
  tarea: string
  descripcion_catalogo?: string
  evento_id?: number | string
  evento: string
  responsable_id?: number | string
  responsable: string
  cargo_responsable?: string
  fase: Fase
  prioridad: Prioridad
  fechaLimite: string
  hora_inicio_estimada?: string
  hora_fin_estimada?: string
  hora_inicio_real?: string
  hora_fin_real?: string
  estado: EstadoTarea
  bloqueada_por_tarea_id?: number
  notas?: string
}

/** Plantilla del catálogo maestro (`tarea`). */
export interface TareaCatalogoItem {
  id: string
  codigo: string
  nombre_tarea: string
  descripcion: string
  fase_sugerida: Fase
}

export type TareaForm = Omit<TareaItem, "id">
export type TareaCatalogoForm = Omit<TareaCatalogoItem, "id" | "codigo">
export type TareaView = "kanban" | "table" | "catalogo"
