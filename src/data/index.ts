/**
 * Capa centralizada de catálogos y datos mock iniciales — The High Events
 * Arquitectura Frontend (SWEBOK v4.0 - Separación de Datos y Presentación)
 */

import { RouteId } from "../types"

export interface MonthlyRevenuePoint {
  month: string; ingresos: number // en millones para graficar eje Y, formateado en COP completo al mostrar
  meta: number
  costos: number
}

export const REVENUE_SERIES: MonthlyRevenuePoint[] = [
  { month: "May", ingresos: 28.0, meta: 35.0, costos: 17.5 },
  { month: "Jun", ingresos: 34.5, meta: 35.0, costos: 21.2 },
  { month: "Jul", ingresos: 42.0, meta: 40.0, costos: 25.8 },
  { month: "Ago", ingresos: 38.0, meta: 40.0, costos: 23.4 },
  { month: "Sep", ingresos: 46.5, meta: 50.0, costos: 28.6 },
  { month: "Oct", ingresos: 52.8, meta: 55.0, costos: 32.5 },
]

export interface WeeklyRevenuePoint {
  day: string; actual: number // en millones COP (Semana actual)
  anterior: number // en millones COP (Semana anterior)
}

export const WEEK_COMPARISON_SERIES: WeeklyRevenuePoint[] = [
  { day: "Lun", actual: 2.5, anterior: 1.8 },
  { day: "Mar", actual: 4.2, anterior: 3.5 },
  { day: "Mié", actual: 6.8, anterior: 5.0 },
  { day: "Jue", actual: 12.2, anterior: 8.4 },
  { day: "Vie", actual: 18.5, anterior: 15.2 },
  { day: "Sáb", actual: 24.0, anterior: 19.8 },
  { day: "Dom", actual: 8.8, anterior: 6.5 },
]

export interface DashboardUpcomingEvent {
  id: string; nombre: string
  cliente: string
  modalidad: "Cliente" | "Producción Propia"
  fecha: string
  locacion: string
  ventaTotal: number
  saldoCliente: number
  costoProveedores: number
  margenPct: number
  estado: "Confirmado" | "En proceso" | "Cotización"
}

// Ordenados estrictamente de forma cronológica desde la fecha actual (22 Oct 2026 en adelante)
export const DASHBOARD_UPCOMING_EVENTS: DashboardUpcomingEvent[] = [
  {
    id: "1",
    nombre: "Gala Corporativa Tech",
    cliente: "Grupo Empresarial Norte",
    modalidad: "Cliente",
    fecha: "24 Oct 2026",
    locacion: "Hotel Sheraton · Medellín",
    ventaTotal: 12200000,
    saldoCliente: 6100000, // 50% restante al finalizar
    costoProveedores: 7100000,
    margenPct: 41.8,
    estado: "Confirmado",
  },
  {
    id: "2",
    nombre: "Halloween Night Experience",
    cliente: "The High Events (Taquilla)",
    modalidad: "Producción Propia",
    fecha: "31 Oct 2026",
    locacion: "Discoteca Mijito · Provenza",
    ventaTotal: 28500000,
    saldoCliente: 0,
    costoProveedores: 16200000,
    margenPct: 43.2,
    estado: "Confirmado",
  },
  {
    id: "3",
    nombre: "Festival 360 Open Air",
    cliente: "The High Events (Taquilla)",
    modalidad: "Producción Propia",
    fecha: "01 Nov 2026",
    locacion: "Discoteca 360 · Medellín",
    ventaTotal: 42000000,
    saldoCliente: 0,
    costoProveedores: 25800000,
    margenPct: 38.6,
    estado: "En proceso",
  },
  {
    id: "4",
    nombre: "Quinceañera Familia Rodríguez",
    cliente: "Familia Rodríguez",
    modalidad: "Cliente",
    fecha: "05 Nov 2026",
    locacion: "Salón Versailles · El Poblado",
    ventaTotal: 8400000,
    saldoCliente: 4200000, // 50% restante al finalizar
    costoProveedores: 5100000,
    margenPct: 39.3,
    estado: "Confirmado",
  },
  {
    id: "5",
    nombre: "Lanzamiento Producto X",
    cliente: "TechCorp S.A.",
    modalidad: "Cliente",
    fecha: "10 Nov 2026",
    locacion: "Centro de Convenciones Plaza Mayor",
    ventaTotal: 25000000,
    saldoCliente: 12500000, // 50% restante
    costoProveedores: 15400000,
    margenPct: 38.4,
    estado: "En proceso",
  },
]

export interface DashboardActionItem {
  id: number; severity: "critical" | "warning" | "info"
  tag: string
  title: string
  text: string
  responsable: string
  actionLabel: string
  targetRoute: RouteId
}

export const DASHBOARD_ACTION_ITEMS: DashboardActionItem[] = [
  {
    id: 1,
    severity: "critical",
    tag: "Incidente Técnico",
    title: "Fallo en módulo de pantalla LED P3 durante prueba",
    text: "Reportado en montaje previo para Gala Sheraton. Requiere reemplazo de gabinete con proveedor audiovisual.",
    responsable: "Alejandra Osorio (Operaciones)",
    actionLabel: "Gestionar incidente",
    targetRoute: "incidentes",
  },
  {
    id: 2,
    severity: "critical",
    tag: "Formato de Entrega · Desmontaje",
    title: "3 equipos alquilados sin 2da verificación de devolución",
    text: "Pendiente comparar estado físico inicial vs. final y evidencia fotográfica (Evento Boda Prom 18 Oct).",
    responsable: "Alejandra Osorio (Logística)",
    actionLabel: "Firmar acta final",
    targetRoute: "recepciones",
  },
  {
    id: 3,
    severity: "warning",
    tag: "Anticipos 50% · WhatsApp",
    title: "3 comprobantes de anticipo (50%) por verificar en banco",
    text: "Clientes enviaron soporte por WhatsApp ($ 14.200.000). Validar ingreso en cuenta y enviar recibo.",
    responsable: "Tomás Quintero (Dirección)",
    actionLabel: "Verificar abonos",
    targetRoute: "abonos",
  },
  {
    id: 4,
    severity: "warning",
    tag: "Cierre de Evento · Regla 50/50",
    title: "Boda Prom 2026 y Fiesta La Pista listas para liquidación",
    text: "Cobrar 50% final al cliente ($ 5.500.000) y liberar 50% restante a proveedores ($ 3.200.000).",
    responsable: "Tomás Quintero (Dirección)",
    actionLabel: "Liquidar cierre",
    targetRoute: "ventas",
  },
  {
    id: 5,
    severity: "info",
    tag: "Comercial & Visitas Técnicas",
    title: "4 propuestas enviadas tras visita técnica sin respuesta (+5 días)",
    text: "Contactar clientes para confirmar bloqueo de fecha y recepción del 50% de anticipo.",
    responsable: "Coordinación Ventas",
    actionLabel: "Ver cotizaciones",
    targetRoute: "cotizaciones",
  },
]

export interface CalendarDayStatus {
  day: number; status: "free" | "booked" | "own_event" | "technical_visit"
  label?: string
  locacion?: string
  responsable?: string
}

// Mini calendario Octubre 2026 (31 días, empieza Jueves = offset 3 en Lun-Dom)
export const OCTOBER_2026_CALENDAR: CalendarDayStatus[] = [
  {
    day: 2,
    status: "booked",
    label: "Corp. Bancolombia (Finalizado)",
    locacion: "Club El Rodeo",
  },
  {
    day: 3,
    status: "own_event",
    label: "High Night Session (Finalizado)",
    locacion: "Discoteca La Pista",
  },
  {
    day: 9,
    status: "booked",
    label: "Cumpleaños Privado VIP (Finalizado)",
    locacion: "Llanogrande",
  },
  {
    day: 10,
    status: "booked",
    label: "Matrimonio Gómez (Finalizado)",
    locacion: "Hacienda Fizebad",
  },
  {
    day: 16,
    status: "own_event",
    label: "Showcase Electrónico (Finalizado)",
    locacion: "Discoteca 360",
  },
  {
    day: 18,
    status: "booked",
    label: "Boda Prom 2026 (Por cerrar 50%)",
    locacion: "Club Campestre",
  },
  {
    day: 20,
    status: "own_event",
    label: "After Party La Pista (Por cerrar)",
    locacion: "Discoteca La Pista",
  },
  {
    day: 23,
    status: "technical_visit",
    label: "Visita Técnica: TechCorp S.A.",
    locacion: "Plaza Mayor",
    responsable: "Tomás Quintero",
  },
  {
    day: 24,
    status: "booked",
    label: "Gala Corporativa Tech",
    locacion: "Hotel Sheraton",
    responsable: "Alejandra Osorio",
  },
  {
    day: 27,
    status: "technical_visit",
    label: "Visita Técnica: Boda Campestre",
    locacion: "Santa Elena",
    responsable: "Tomás Quintero",
  },
  {
    day: 29,
    status: "technical_visit",
    label: "Inspección Sonido e Iluminación",
    locacion: "Discoteca Mijito",
    responsable: "Alejandra Osorio",
  },
  {
    day: 31,
    status: "own_event",
    label: "Halloween Night Experience",
    locacion: "Discoteca Mijito",
    responsable: "Tomás & Andrés",
  },
]

export const ESTADOS_EVENTO_CATALOG = [
  "Cotización",
  "Confirmado",
  "En proceso",
  "Finalizado",
  "Cancelado",
] as const

export const CATEGORIAS_EQUIPO_CATALOG = [
  "Audio",
  "Iluminación",
  "Video",
  "Estructuras",
] as const

export const FASES_TAREA_CATALOG = [
  "Planificación",
  "Montaje",
  "Prueba Técnica",
  "Ejecución",
  "Desmontaje",
] as const

export interface ComparisonPoint {
  label: string; actual: number
  anterior: number
} // millones de COP

export const MONTH_COMPARISON_SERIES: ComparisonPoint[] = [
  { label: "Sem 1", actual: 9.4, anterior: 8.1 },
  { label: "Sem 2", actual: 22.1, anterior: 18.9 },
  { label: "Sem 3", actual: 37.6, anterior: 33.2 },
  { label: "Sem 4", actual: 52.8, anterior: 46.5 },
]
