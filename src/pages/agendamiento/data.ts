import type { SelectOption } from "../../components/CustomSelect"
import type { AgendaEvent, AgendaLocation, TipoAgendamiento } from "./types"

// "Hoy" real (antes eran constantes fijas que nunca avanzaban).
const _hoy = new Date()
export const TODAY_YEAR = _hoy.getFullYear()
export const TODAY_MONTH = _hoy.getMonth() // 0-indexed
export const TODAY_DAY = _hoy.getDate()

// Los colores por estado viven ahora en './utils' (fuente única).
export { ESTADO_COLORS } from "./utils"

/**
 * Agendamientos iniciales mapeados exactamente a los 4 tipos oficiales:
 * ENUM('evento', 'visita_tecnica', 'reunion_cliente', 'otro')
 * y 4 estados oficiales:
 * ENUM('pendiente', 'confirmado', 'cancelado', 'realizado')
 */
export const INITIAL_EVENTS: AgendaEvent[] = [
  {
    id: "1",
    kind: "evento",
    tipo_agendamiento: "evento",
    title: "Quinceañera Rodríguez",
    type: "Reserva de Evento",
    time: "18:00",
    venue: "Salón Principal 360",
    day: 5,
    month: 9,
    year: 2026,
    client: "Familia Rodríguez",
    estado: "Pendiente",
  },
  {
    id: "2",
    kind: "cita",
    tipo_agendamiento: "reunion_cliente",
    title: "Presentación Propuesta TechCorp",
    type: "Reunión de Cotización",
    time: "09:00",
    modalidadCita: "Videollamada (Meet / Zoom)",
    notas: "Revisar requerimientos de pantallas LED y sonido line array.",
    fechaTentativaEvento: "2026-11-10",
    tipoEventoTentativo: "Lanzamiento Corporativo",
    lugarTentativo: "Centro de Convenciones Ágora Bogotá",
    day: 10,
    month: 9,
    year: 2026,
    client: "TechCorp S.A.",
    estado: "Pendiente",
  },
  {
    id: "3",
    kind: "evento",
    tipo_agendamiento: "evento",
    title: "Boda Prom San José",
    type: "Reserva de Evento",
    time: "15:00",
    venue: "Club Campestre Norte",
    day: 15,
    month: 9,
    year: 2026,
    client: "Colegio San José",
    estado: "Confirmado",
  },
  {
    id: "4",
    kind: "evento",
    tipo_agendamiento: "evento",
    title: "Gala Corporativa Norte",
    type: "Reserva de Evento",
    time: "19:00",
    venue: "Hotel Sheraton Ballroom",
    day: 22,
    month: 9,
    year: 2026,
    client: "Grupo Empresarial Norte",
    estado: "Confirmado",
  },
  {
    id: "5",
    kind: "evento",
    tipo_agendamiento: "visita_tecnica",
    title: "Festival 360 Noche",
    type: "Prueba Técnica de Equipos",
    time: "21:00",
    venue: "Discoteca 360 Underground",
    day: 28,
    month: 9,
    year: 2026,
    client: "The High Events",
    estado: "Confirmado",
  },
  {
    id: "6",
    kind: "evento",
    tipo_agendamiento: "visita_tecnica",
    title: "Cumpleaños Rivera",
    type: "Inspección Técnica de Lugar",
    time: "17:00",
    venue: "Terraza VIP",
    day: 18,
    month: 9,
    year: 2026,
    client: "Familia Rivera",
    estado: "Pendiente",
  },
  {
    id: "7",
    kind: "cita",
    tipo_agendamiento: "reunion_cliente",
    title: "Cierre de Contrato Grupo ABC",
    type: "Firma de Contrato",
    time: "10:00",
    modalidadCita: "Oficina The High Events",
    notas: "Definir anticipo del 50% y cronograma general.",
    day: 20,
    month: 9,
    year: 2026,
    client: "Grupo ABC Ltda.",
    estado: "Realizado",
  },
]

export const INITIAL_LOCATIONS: AgendaLocation[] = [
  {
    id: 1,
    name: "Salón Principal 360",
    count: 12,
    capacity: "500 pax",
    color: "bg-[#7C3AED]",
    percentage: 80,
  },
  {
    id: 2,
    name: "Terraza VIP",
    count: 6,
    capacity: "200 pax",
    color: "bg-[#3B82F6]",
    percentage: 50,
  },
  {
    id: 3,
    name: "Club Campestre Norte",
    count: 4,
    capacity: "800 pax",
    color: "bg-[#10B981]",
    percentage: 30,
  },
  {
    id: 4,
    name: "Hotel Sheraton Ballroom",
    count: 15,
    capacity: "1000 pax",
    color: "bg-[#F59E0B]",
    percentage: 90,
  },
  {
    id: 5,
    name: "Discoteca 360 Underground",
    count: 8,
    capacity: "350 pax",
    color: "bg-[#EC4899]",
    percentage: 65,
  },
  {
    id: 6,
    name: "Centro de Convenciones",
    count: 5,
    capacity: "1200 pax",
    color: "bg-[#6366F1]",
    percentage: 40,
  },
]

/**
 * Tipos oficiales de Agendamiento ENUM('evento', 'visita_tecnica', 'reunion_cliente', 'otro')
 */
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

/**
 * Estados oficiales de Agendamiento ENUM('pendiente', 'confirmado', 'cancelado', 'realizado')
 */
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
