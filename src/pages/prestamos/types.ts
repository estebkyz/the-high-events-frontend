/** ENUM('activo','devuelto','con_retraso','con_danos') */
export type PrestamoEstado = "Activo" | "Devuelto" | "Con Retraso" | "Con Daños"

/** ENUM('excelente','bueno','regular','mal') */
export type CondicionEquipo = "Excelente" | "Bueno" | "Regular" | "Dañado"

export interface EquipoPrestado {
  id: string
  nombre: string
  serie: string
  condicionSalida: CondicionEquipo
  condicionRetorno?: CondicionEquipo
}

export interface PrestamoItem {
  id: string
  codigo: string
  responsable: string
  responsable_id?: number
  evento: string
  evento_id?: number
  equipos: EquipoPrestado[]
  fechaSalida: string
  fechaDevolucion: string
  fecha_devolucion_real?: string
  estado: PrestamoEstado
  observaciones_entrega?: string
  observaciones_devolucion?: string
}

export type PrestamoForm = Pick<
  PrestamoItem,
  | "responsable"
  | "responsable_id"
  | "evento"
  | "evento_id"
  | "equipos"
  | "fechaSalida"
  | "fechaDevolucion"
  | "observaciones_entrega"
>

export interface DevolucionPrestamoForm {
  fecha: string
  observaciones: string
  /** id del equipo → condición al retorno. */
  condiciones: Record<string, CondicionEquipo>
}
