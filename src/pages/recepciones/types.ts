// Mapped exactly to MySQL Workbench: ENUM('recepcion_montaje','recepcion_desmontaje')
export type TipoRecepcion = "Recepción Montaje" | "Recepción Desmontaje"

// Mapped exactly to MySQL Workbench: ENUM('pendiente','conforme','cerrada','anulada')
export type EstadoRecepcion = "Pendiente" | "Conforme" | "Cerrada" | "Anulada"

// Mapped exactly to MySQL Workbench: ENUM('excelente','bueno','regular','dañado')
export type EstadoItemRecepcion = "Excelente" | "Bueno" | "Regular" | "Dañado"

export interface EquipmentItem {
  nombre: string
  cantidad: number
  estado: EstadoItemRecepcion | string
  observaciones?: string
}

export interface Recepcion {
  id: string
  codigo: string
  evento: string
  evento_id?: number
  responsable?: string
  responsable_id?: number
  subcontrato?: string
  subcontrato_id?: number
  proveedor: string
  tipo: TipoRecepcion
  fecha: string
  fecha_hora?: string
  estado: EstadoRecepcion
  descripcion: string
  observaciones: string
  firma_digital?: string
  parentCodigo?: string
  items: EquipmentItem[]
}

export interface NewItem {
  nombre: string
  cantidad: string
  estado: EstadoItemRecepcion | string
  observaciones?: string
}

export interface DevolucionItem {
  nombre: string
  cantidad: number
  condicion: EstadoItemRecepcion | string
}

export type RecepcionDrawerMode = null | "view" | "create" | "edit" | "devolucion"

export interface RecepcionesKPIsData {
  total: number
  pendientes: number
  conformes: number
  cerradas: number
}
