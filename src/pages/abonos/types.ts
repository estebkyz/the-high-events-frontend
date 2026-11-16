export type TipoPagoEnum = "Anticipo" | "Saldo"
export type EstadoPagoTransaccion = "Pagado" | "Pendiente"
export type TipoAbonoTab = "Clientes" | "Proveedores"

/**
 * Representa una transacción individual según el modelo ER (pago_cliente / pago_proveedor)
 */
export interface PaymentHistoryEntry {
  id?: string
  fecha: string
  monto: string
  montoNum?: number
  metodo: string
  concepto: string
  tipoPago?: TipoPagoEnum
  comprobante?: string
  estado?: EstadoPagoTransaccion
  observaciones?: string
}

/**
 * Entidad principal para la gestión de abonos y control del 50% anticipo / 50% saldo
 */
export interface AbonoItem {
  id: string; tipoCartera: TipoAbonoTab
  evento: string
  cliente?: string
  proveedor?: string
  servicio?: string
  total: string
  totalNum: number
  anticipo: string
  anticipoNum: number
  saldo: string
  saldoNum: number
  estadoAnticipo: "Pagado" | "Pendiente"
  estadoSaldo: "Pagado" | "Pendiente"
  fechaAnticipo?: string
  fechaSaldo?: string
  eventoFinalizado?: boolean // Regla Clientes: 50% saldo una vez finalizado satisfactoriamente el evento
  cumplimientoVerificado?: boolean // Regla Proveedores: 50% saldo tras verificar cumplimiento de servicios
  porcentaje: number
  fechaPago: string
  historial: PaymentHistoryEntry[]
  observaciones?: string
}

export interface AbonosKPIsData {
  anticiposClientes: number; saldosPendClientes: number
  anticiposProv: number
  saldosPendProv: number
}

export interface PagoFormState {
  tipoPago: TipoPagoEnum; monto: string
  fecha: string
  metodo: string
  comprobante: string
  estado: EstadoPagoTransaccion
  observaciones: string
  verificacionCondicion: boolean
}

export type AbonoDrawerMode = "view" | "create" | "edit" | "payment"

export type AbonoFormData = Partial<AbonoItem>
