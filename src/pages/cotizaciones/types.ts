export type EstadoCotizacion =
  | "Borrador"
  | "Enviada"
  | "Aceptada"
  | "Rechazada"
  | "Vencida"

export interface CotizacionDetalle {
  nombre: string
  cantidad: number
  valor_unitario: number
  subtotal: number
}

export interface CotizacionItem {
  id: string
  codigo: string
  cliente: string
  cliente_id?: string
  asesor?: string
  empleado_id?: string
  nombre_evento: string
  fecha_evento?: string
  direccion?: string
  hora_inicio?: string
  hora_fin?: string
  aforo_esperado?: number
  /** Fecha de emisión. */
  fecha: string
  /** Fecha de vencimiento. */
  fechaVence: string
  total: string
  totalNum: number
  estado: EstadoCotizacion
  url_documento?: string
  notas?: string
  servicios: string[]
  /** Precio de cada servicio, en el mismo orden que `servicios`. */
  montos: string[]
  items?: CotizacionDetalle[]
}

export type CotizacionForm = Omit<CotizacionItem, "id" | "codigo" | "estado">
