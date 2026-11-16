// Mapped exactly to MySQL Workbench: ENUM('evento', 'visita_tecnica', 'reunion_cliente', 'otro')
export type TipoAgendamiento = "evento" | "visita_tecnica" | "reunion_cliente" | "otro"

// Mapped exactly to MySQL Workbench: ENUM('pendiente', 'confirmado', 'cancelado', 'realizado')
export type EstadoAgendamiento =
  | "pendiente"
  | "confirmado"
  | "cancelado"
  | "realizado"
  | "Pendiente"
  | "Confirmado"
  | "Cancelado"
  | "Realizado"

export type AgendaKind = "evento" | "visita_tecnica" | "reunion_cliente" | "otro" | "cita"

export interface AgendaEvent {
  id: string
  kind: AgendaKind
  tipo_agendamiento: TipoAgendamiento
  title: string
  type: string
  /**
   * @deprecated Derivado del estado: usa getEstadoColor(ev.estado) de './utils'.
   */
  color?: string
  time: string // "HH:mm"
  day: number // 1..31
  month: number // 0-indexed (9 = Octubre)
  year: number
  client: string
  estado: EstadoAgendamiento | string
  venue?: string
  modalidadCita?: string
  motivo?: string
  notas?: string
  fechaTentativaEvento?: string // YYYY-MM-DD fecha tentativa planteada para el futuro evento
  tipoEventoTentativo?: string // Boda, Quinceañera, Corporativo, etc.
  lugarTentativo?: string
  cliente_id?: string
}

export interface AgendaFormData {
  kind: AgendaKind
  tipo_agendamiento: TipoAgendamiento
  title: string
  client: string
  time: string
  dateISO: string
  type: string
  estado: string
  venue: string
  modalidadCita: string
  motivo?: string
  notas: string
  fechaTentativaEvento?: string
  tipoEventoTentativo?: string
  lugarTentativo?: string
  cliente_id?: string
}

export interface AgendaLocation {
  id: number
  name: string
  count: number
  capacity: string
  color: string
  percentage: number
}

export type DrawerMode = "none" | "detail" | "edit" | "create"
export type FilterKind = "Todos" | TipoAgendamiento | "cita" | "evento"
