export type EstadoCotizacion =
  | "Borrador"
  | "Enviada"
  | "Aceptada"
  | "Rechazada"
  | "Vencida"

export interface CotizacionDetalleItem {
  id?: string
  servicio_id?: string
  nombre: string
  cantidad: number
  precio_unitario: number
  subtotal: number
  observaciones?: string
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
  fecha: string // Fecha emisión
  fechaVence: string // Fecha vencimiento
  total: string
  totalNum: number
  estado: EstadoCotizacion
  url_documento?: string
  notas?: string
  servicios: string[]
  montos: string[]
  detalles?: CotizacionDetalleItem[]
  items?: {
    nombre: string
    cantidad: number
    valor_unitario: number
    subtotal: number
  }[]
}

export type CotizacionDrawerMode = "view" | "create" | "edit"

export type CotizacionFormData = Partial<CotizacionItem>
