import type { EntityLabel } from "@/hooks/useCrudActions"
import { toOptions } from "@/utils/list"
import type { EstadoPago, TipoCartera } from "./types"
import { ESQUEMA_PAGO } from "@/constants/empresa"

interface CarteraCopy {
  label: EntityLabel
  title: string
  tercero: string
  columna: string
  /** Declaración que habilita el saldo; sin ella manda el estado del evento. */
  condicionSaldo?: string
  saldoBloqueado: string
  pendiente: string
  emptyTitle: string
  emptyDescription: string
}

/** Textos de cada cartera: evita condicionales repartidos por los componentes. */
export const CARTERA: Record<TipoCartera, CarteraCopy> = {
  Clientes: {
    label: { singular: "abono", plural: "abonos", gender: "m" },
    title: "Abonos",
    tercero: "Cliente",
    columna: "Evento",
    saldoBloqueado: "El saldo se registra cuando el evento esté en estado Finalizado",
    pendiente: "Por cobrar",
    emptyTitle: "Aún no tienes abonos de clientes",
    emptyDescription: "Cada venta confirmada crea aquí su acuerdo de pago.",
  },
  Proveedores: {
    label: { singular: "pago", plural: "pagos", gender: "m" },
    title: "Pagos",
    tercero: "Proveedor",
    columna: "Servicio",
    condicionSaldo: "Confirmo que se verificó el cumplimiento del servicio.",
    saldoBloqueado:
      "El saldo exige que quien verifica pagos confirme el cumplimiento del servicio",
    pendiente: "Por desembolsar",
    emptyTitle: "Aún no tienes pagos a proveedores",
    emptyDescription: "Aparecen al asignar un proveedor a los servicios de un evento.",
  },
}

export const CARTERA_OPTIONS = toOptions(["Clientes", "Proveedores"])

export const ABONO_FILTERS = { estado: "Estado" }

export const ESTADO_CARTERA_TABS = [
  { id: "Pendiente", label: "Pendientes" },
  { id: "Liquidado", label: "Liquidados" },
]
export const ESTADO_CARTERA_OPTIONS = [
  { label: "Con saldo pendiente", value: "Pendiente" },
  { label: "Liquidados", value: "Liquidado" },
]

export const TIPO_PAGO_OPTIONS = [
  { label: `Anticipo (${ESQUEMA_PAGO.anticipo} %)`, value: "Anticipo" },
  { label: `Saldo (${ESQUEMA_PAGO.saldo} %)`, value: "Saldo" },
]

const ESTADOS_PAGO: EstadoPago[] = ["Pendiente", "Pagado"]
export const ESTADO_PAGO_OPTIONS = toOptions(ESTADOS_PAGO)

export const METODO_PAGO_OPTIONS = [
  { label: "Transferencia bancaria", value: "Transferencia" },
  { label: "Efectivo", value: "Efectivo" },
]
