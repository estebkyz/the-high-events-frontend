import type { SelectOption } from "../../components/CustomSelect"
import type { AgendaEvent, AgendaLocation } from "./types"

const _hoy = new Date()
export const TODAY_YEAR = _hoy.getFullYear()
export const TODAY_MONTH = _hoy.getMonth()
export const TODAY_DAY = _hoy.getDate()

export { ESTADO_COLORS } from "./utils"

export const INITIAL_EVENTS: AgendaEvent[] = []

export const INITIAL_LOCATIONS: AgendaLocation[] = []

export const TIPOS_AGENDAMIENTO_OPTIONS: SelectOption[] = [
  {
    label: "Evento",
    value: "evento",
    sublabel: "Montaje, show o producción en locación",
  },
  {
    label: "Visita Técnica",
    value: "visita_tecnica",
    sublabel: "Inspección de locación, medidas y pruebas de sonido/luces",
  },
  {
    label: "Reunión con Cliente",
    value: "reunion_cliente",
    sublabel: "Cita comercial, presentación o cierre de propuesta",
  },
  {
    label: "Otro",
    value: "otro",
    sublabel: "Otras actividades operativas o comerciales",
  },
]

export const ESTADOS_AGENDAMIENTO_OPTIONS: SelectOption[] = [
  { label: "Pendiente", value: "Pendiente", sublabel: "Por confirmar o agendamiento preliminar" },
  { label: "Confirmado", value: "Confirmado", sublabel: "Aprobado por el cliente y equipo" },
  { label: "Realizado", value: "Realizado", sublabel: "Actividad ejecutada satisfactoriamente" },
  { label: "Cancelado", value: "Cancelado", sublabel: "Agendamiento anulado o reprogramado" },
]

export const TIPOS_CITA_OPTIONS: SelectOption[] = [
  {
    label: "Reunión de Cotización",
    value: "Reunión de Cotización",
    sublabel: "Levantamiento inicial de requerimientos",
  },
  {
    label: "Presentación de Propuesta",
    value: "Presentación de Propuesta",
    sublabel: "Revisión comercial y ajustes de presupuesto",
  },
  {
    label: "Firma de Contrato",
    value: "Firma de Contrato",
    sublabel: "Cierre formal y acuerdo de pago",
  },
  {
    label: "Seguimiento Comercial",
    value: "Seguimiento Comercial",
    sublabel: "Acompañamiento o dudas del cliente",
  },
]

export const MODALIDADES_CITA_OPTIONS: SelectOption[] = [
  {
    label: "Videollamada (Meet / Zoom)",
    value: "Videollamada (Meet / Zoom)",
    sublabel: "Reunión remota virtual",
  },
  {
    label: "Oficina The High Events",
    value: "Oficina The High Events",
    sublabel: "Atención presencial en sede principal",
  },
  {
    label: "Punto externo acordado",
    value: "Punto externo acordado",
    sublabel: "Oficina del cliente o café",
  },
  {
    label: "Llamada telefónica",
    value: "Llamada telefónica",
    sublabel: "Contacto directo por teléfono / WhatsApp",
  },
]

export const ESTADOS_CITA_OPTIONS: SelectOption[] = ESTADOS_AGENDAMIENTO_OPTIONS

export const TIPOS_EVENTO_OPTIONS: SelectOption[] = [
  {
    label: "Reserva de Evento",
    value: "Reserva de Evento",
    sublabel: "Bloqueo de fecha para montaje y show",
  },
  {
    label: "Prueba Técnica de Equipos",
    value: "Prueba Técnica de Equipos",
    sublabel: "Soundcheck, luces y pantallas en sitio",
  },
  {
    label: "Inspección Técnica de Lugar",
    value: "Inspección Técnica de Lugar",
    sublabel: "Reconocimiento de locación y medidas",
  },
]

export const ESTADOS_EVENTO_OPTIONS: SelectOption[] = ESTADOS_AGENDAMIENTO_OPTIONS

export const MESES_NOMBRES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]
