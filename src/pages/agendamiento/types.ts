/** ENUM('evento','visita_tecnica','reunion_cliente','otro') */
export type TipoAgendamiento = "evento" | "visita_tecnica" | "reunion_cliente" | "otro"

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
  day: number
  /** 0-11 */
  month: number
  year: number
  client: string
  estado: EstadoAgendamiento
  venue?: string
  modalidadCita?: string
  notas?: string
  /** Fecha tentativa del futuro evento (`YYYY-MM-DD`). */
  fechaTentativaEvento?: string
  tipoEventoTentativo?: string
  lugarTentativo?: string
  cliente_id?: string
  evento_id?: string
  cotizacion_id?: string
}

export interface AgendaForm extends Omit<AgendaEvent, "id" | "day" | "month" | "year"> {
  dateISO: string
  motivo: string
  venue: string
  modalidadCita: string
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
