/** ENUM('recepcion_montaje','recepcion_desmontaje') */
export type TipoRecepcion = "Recepción Montaje" | "Recepción Desmontaje"

/** ENUM('pendiente','conforme','con_novedades','cerrada','anulada') */
export type EstadoRecepcion =
  | "Pendiente"
  | "Conforme"
  | "Con Novedades"
  | "Cerrada"
  | "Anulada"

/** ENUM('excelente','bueno','regular','dañado') */
export type EstadoItemRecepcion = "Excelente" | "Bueno" | "Regular" | "Dañado"

export interface RecepcionEquipo {
  equipo_id?: number
  nombre: string
  cantidad: number
  estado: EstadoItemRecepcion
  observaciones?: string
  /** Enlace a la foto. */
  evidencia_foto?: string
}

export interface Recepcion {
  id: string
  codigo: string
  evento: string
  evento_id?: number
  responsable: string
  responsable_id?: number
  /** Vacío: recepción interna de equipos propios. */
  proveedor: string
  tipo: TipoRecepcion
  fecha: string
  estado: EstadoRecepcion
  /** La preparó el evento. */
  automatico?: boolean
  observaciones: string
  parentCodigo?: string
  items: RecepcionEquipo[]
}

export type RecepcionForm = Pick<
  Recepcion,
  | "evento"
  | "evento_id"
  | "responsable"
  | "responsable_id"
  | "proveedor"
  | "tipo"
  | "fecha"
  | "estado"
  | "observaciones"
  | "items"
>

export type DevolucionForm = Pick<
  Recepcion,
  "responsable" | "responsable_id" | "observaciones" | "items"
>
