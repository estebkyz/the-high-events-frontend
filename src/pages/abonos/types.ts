export type TipoPago = "Anticipo" | "Saldo"
/** Estado de una transacción. */
export type EstadoPago = "Pagado" | "Pendiente" | "Rechazado"
/** Estado derivado de cada cuota del acuerdo. */
export type EstadoCuota = "Pagado" | "Pendiente"
export type TipoCartera = "Clientes" | "Proveedores"

/** Transacción individual. Sin `id` hasta que el servidor la registra. */
export interface PagoHistorial {
  id?: string
  fecha: string
  monto: string
  montoNum: number
  metodo: string
  concepto: string
  tipoPago: TipoPago
  comprobante?: string
  estado: EstadoPago
  observaciones?: string
}

/**
 * Acuerdo de pago (50 % anticipo / 50 % saldo). Lo deriva el servidor de una
 * venta o de los servicios de un proveedor: aquí solo se registran pagos.
 */
export interface AbonoItem {
  id: string
  tipoCartera: TipoCartera
  evento: string
  cliente?: string
  proveedor?: string
  servicio?: string
  /** Responsable del evento: encargado de sus pagos. */
  responsable?: string
  total: string
  totalNum: number
  anticipo: string
  anticipoNum: number
  saldo: string
  saldoNum: number
  estadoAnticipo: EstadoCuota
  estadoSaldo: EstadoCuota
  fechaAnticipo?: string
  fechaSaldo?: string
  /** Clientes: el saldo se habilita al finalizar el evento. */
  eventoFinalizado?: boolean
  /** Proveedores: se envía al registrar el saldo. */
  cumplimientoVerificado?: boolean
  porcentaje: number
  fechaPago: string
  historial: PagoHistorial[]
}

export interface PagoForm {
  tipoPago: TipoPago
  montoNum: number
  fecha: string
  metodo: string
  comprobante: string
  estado: EstadoPago
  observaciones: string
  condicionVerificada: boolean
}
