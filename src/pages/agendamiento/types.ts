import type { EstadoEvento } from "@/pages/eventos/types"

/** ENUM('reunion_cliente','visita_tecnica','otro'): lo que se agenda. */
export type TipoAgendamiento = "reunion_cliente" | "visita_tecnica" | "otro"
/** En el calendario también aparecen los eventos del módulo de Eventos. */
export type TipoEntrada = TipoAgendamiento | "evento"

/** ENUM('pendiente','confirmado','cancelado','realizado') */
export type EstadoAgendamiento = "Pendiente" | "Confirmado" | "Realizado" | "Cancelado"

export interface AgendaEvent {
  id: string
  tipo_agendamiento: TipoAgendamiento
  title: string
  /** Actividad o motivo. */
  motivo?: string
  /** `HH:mm` */
  time: string
  /** `HH:mm`: hora de fin */
  timeEnd?: string
  day: number
  /** 0-11 */
  month: number
  year: number
  client: string
  estado: EstadoAgendamiento
  notas?: string
  /** Fecha tentativa del futuro evento (`YYYY-MM-DD`). */
  fechaTentativaEvento?: string
  tipoEventoTentativo?: string
  lugarTentativo?: string
  /** Antes del evento, el cliente; sobre un evento, el cliente es el del evento. */
  cliente_id?: string
  evento_id?: string
  evento?: string
  /** Empleado que atiende */
  responsable_id?: string
  responsable?: string
}

/** Lo que muestra el calendario: una reunión o un evento del módulo de Eventos. */
export interface AgendaEntry extends Omit<AgendaEvent, "estado" | "tipo_agendamiento"> {
  tipo_agendamiento: TipoEntrada
  estado: EstadoAgendamiento | EstadoEvento
  /** Lugar de un evento del calendario */
  venue?: string
}

export interface AgendaForm extends Omit<
  AgendaEvent,
  "id" | "day" | "month" | "year" | "evento" | "responsable"
> {
  dateISO: string
  timeEnd: string
  motivo: string
  notas: string
  fechaTentativaEvento: string
  tipoEventoTentativo: string
  lugarTentativo: string
}

/** Mes visible en el calendario (`month` 0-11). */
export interface CalendarMonth {
  year: number
  month: number
}
