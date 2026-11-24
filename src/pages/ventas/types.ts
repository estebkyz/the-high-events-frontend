export type TipoVenta = "Cliente" | "Propio"
export type EstadoPagoVenta = "Pendiente" | "Parcial" | "Pagado"
export type EstadoVenta = "Confirmada" | "Anulada"

export interface VentaItem {
  id: string
  evento_id: string
  numero_factura: string
  fecha: string
  totalNum: number
  estado_venta: EstadoVenta
  /** Derivados por el servidor a partir del evento y los pagos. */
  codigo: string
  tipo: TipoVenta
  clienteEvento: string
  total: string
  estadoPago: EstadoPagoVenta
  cotizacion_id?: string
}

export type VentaForm = Pick<
  VentaItem,
  "evento_id" | "numero_factura" | "fecha" | "totalNum" | "estado_venta"
>
