// Mapped exactly to MySQL Workbench: ENUM('planificacion', 'montaje', 'ejecucion', 'desmontaje')
export type Fase =
  | "Planificación"
  | "Montaje"
  | "Ejecución"
  | "Desmontaje"

export type Prioridad = "Alta" | "Media" | "Baja"

// Mapped exactly to MySQL Workbench: ENUM('pendiente', 'en_proceso', 'completada')
export type EstadoTarea =
  | "Pendiente"
  | "En Proceso"
  | "Completada"

/**
 * Representa un registro de `evento_tarea` (Tarea operativa asignada a un evento y empleado,
 * referenciando una plantilla del catálogo maestro `tarea`).
 */
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

export type TareaDrawerMode =
  | "none"
  | "new"
  | "edit"
  | "view"
  | "new_catalogo"
  | "edit_catalogo"

export type TareaFormData = Partial<TareaItem>

export interface TareaCatalogoFormValues {
  id?: string
  codigo?: string
  nombre_tarea: string
  descripcion: string
  fase_sugerida: Fase
}
