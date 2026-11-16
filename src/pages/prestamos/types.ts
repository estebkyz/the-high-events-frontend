// Mapped exactly to MySQL Workbench: ENUM('activo','devuelto','con_retraso','con_danos')
export type PrestamoEstado = "Activo" | "Devuelto" | "Con Retraso" | "Con Daños"

export type PrestamoDrawerMode = "none" | "new" | "edit" | "view" | "return"

export interface EquipoPrestado {
  id: string
  nombre: string
  serie: string
  condicionSalida: string
  condicionRetorno?: string
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

export type PrestamoFormData = Partial<PrestamoItem>
