export type TipoVenta = "Cliente" | "Propio"

export type EstadoPagoVenta = "Pendiente" | "Parcial" | "Pagado"
export type EstadoVenta = "Confirmada" | "Anulada"

export type VentaDrawerMode = "none" | "create" | "edit" | "view"

export interface VentaItem {
  id: string
  codigo: string
  tipo: TipoVenta
  clienteEvento: string
  numero_factura?: string
  fecha: string
  total: string
  totalNum: number
  estadoPago: EstadoPagoVenta
  estado_venta?: EstadoVenta
  cotizacion_id?: string
}

export type VentaFormData = Partial<VentaItem>

export interface VentasKPIsData {
  totalVentasCOP: number; totalVentasCount: number
  cobradoCOP: number
  cobradoCount: number
  pendienteCOP: number
  pendienteCount: number
  clientesCount: number
  propiosCount: number
}
