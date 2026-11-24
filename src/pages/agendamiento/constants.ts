import type { EntityLabel } from "@/hooks/useCrudActions"
import { toOptions } from "@/utils/list"
import type { EstadoAgendamiento, TipoAgendamiento } from "./types"

export const AGENDA_LABEL: EntityLabel = {
  singular: "agendamiento",
  plural: "agendamientos",
  gender: "m",
}

export const AGENDA_FILTERS = { tipo: "Tipo", estado: "Estado" }

export const TIPO_LABELS: Record<TipoAgendamiento, string> = {
  evento: "Evento",
  visita_tecnica: "Visita técnica",
  reunion_cliente: "Reunión con cliente",
  otro: "Otro",
}
export const TIPO_OPTIONS = Object.entries(TIPO_LABELS).map(([value, label]) => ({
  value,
  label,
}))

/** Actividades sugeridas por tipo. */
export const ACTIVIDADES: Record<TipoAgendamiento, string[]> = {
  evento: ["Reserva de Evento", "Prueba Técnica de Equipos"],
  visita_tecnica: ["Inspección Técnica de Lugar", "Prueba Técnica de Equipos"],
  reunion_cliente: [
    "Reunión de Cotización",
    "Presentación de Propuesta",
    "Firma de Contrato",
    "Seguimiento Comercial",
  ],
  otro: ["Otra actividad"],
}

export const ESTADOS_AGENDA: EstadoAgendamiento[] = [
  "Pendiente",
  "Confirmado",
  "Realizado",
  "Cancelado",
]
export const ESTADO_AGENDA_OPTIONS = toOptions(ESTADOS_AGENDA)

export const ESTADO_STYLES: Record<EstadoAgendamiento, { color: string; chip: string }> =
  {
    Pendiente: {
      color: "#F59E0B",
      chip: "bg-[#F59E0B]/20 text-[#FBBF24] border-l-[3px] border-l-[#F59E0B]",
    },
    Confirmado: {
      color: "#3B82F6",
      chip: "bg-[#3B82F6]/20 text-[#60A5FA] border-l-[3px] border-l-[#3B82F6]",
    },
    Realizado: {
      color: "#10B981",
      chip: "bg-[#10B981]/20 text-[#34D399] border-l-[3px] border-l-[#10B981]",
    },
    Cancelado: {
      color: "#EF4444",
      chip: "bg-[#EF4444]/20 text-[#F87171] border-l-[3px] border-l-[#EF4444]",
    },
  }

export const MODALIDAD_CITA_OPTIONS = toOptions([
  "Videollamada (Meet / Zoom)",
  "Oficina The High Events",
  "Punto externo acordado",
  "Llamada telefónica",
])

export const MESES = [
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

export const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
