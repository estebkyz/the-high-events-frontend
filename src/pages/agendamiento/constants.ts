import type { EntityLabel } from "@/hooks/useCrudActions"
import { ESTADOS_EVENTO } from "@/pages/eventos/constants"
import { toOptions, uniqueValues } from "@/utils/list"
import type { EstadoAgendamiento, TipoAgendamiento, TipoEntrada } from "./types"

export const REUNION_LABEL: EntityLabel = {
  singular: "reunión",
  plural: "reuniones",
  gender: "f",
}

export const AGENDA_FILTERS = { tipo: "Tipo", estado: "Estado" }

export const TIPO_LABELS: Record<TipoEntrada, string> = {
  evento: "Evento",
  visita_tecnica: "Visita técnica",
  reunion_cliente: "Reunión con cliente",
  otro: "Otro",
}
/** Solo se agendan reuniones; los eventos llegan del módulo de Eventos. */
export const TIPO_FILTER_OPTIONS: { value: TipoEntrada; label: string }[] = [
  { value: "evento", label: "Eventos" },
  { value: "reunion_cliente", label: "Reuniones" },
  { value: "visita_tecnica", label: "Visitas técnicas" },
  { value: "otro", label: "Otros" },
]

/** Lo que se puede agendar desde aquí. */
export const TIPO_AGENDA_OPTIONS: { value: TipoAgendamiento; label: string }[] = [
  { value: "reunion_cliente", label: "Reunión con cliente" },
  { value: "visita_tecnica", label: "Visita técnica" },
  { value: "otro", label: "Otro" },
]

export const MOTIVO_OPTIONS = toOptions([
  "Reunión de Cotización",
  "Presentación de Propuesta",
  "Firma de Contrato",
  "Seguimiento Comercial",
])

export const ESTADOS_AGENDA: EstadoAgendamiento[] = [
  "Pendiente",
  "Confirmado",
  "Realizado",
  "Cancelado",
]
export const ESTADO_AGENDA_OPTIONS = toOptions(ESTADOS_AGENDA)
export const ESTADO_FILTER_OPTIONS = toOptions(
  uniqueValues([...ESTADOS_AGENDA, ...ESTADOS_EVENTO]),
)

export const ESTADO_STYLES: Record<EstadoAgendamiento, { color: string; chip: string }> =
  {
    Pendiente: {
      color: "var(--warn)",
      chip: "bg-warn-soft text-warn-ink border-l-[3px] border-l-warn",
    },
    Confirmado: {
      color: "var(--info)",
      chip: "bg-info-soft text-info-ink border-l-[3px] border-l-info",
    },
    Realizado: {
      color: "var(--ok)",
      chip: "bg-ok-soft text-ok-ink border-l-[3px] border-l-ok",
    },
    Cancelado: {
      color: "var(--danger)",
      chip: "bg-danger-soft text-danger-ink border-l-[3px] border-l-danger",
    },
  }

export const EVENTO_STYLE = {
  color: "var(--brand)",
  chip: "bg-brand-soft text-brand-ink border-l-[3px] border-l-brand",
}

export const LEYENDA = [
  { label: "Evento", color: EVENTO_STYLE.color },
  { label: "Reunión pendiente", color: ESTADO_STYLES.Pendiente.color },
  { label: "Reunión confirmada", color: ESTADO_STYLES.Confirmado.color },
  { label: "Reunión realizada", color: ESTADO_STYLES.Realizado.color },
  { label: "Cancelado", color: ESTADO_STYLES.Cancelado.color },
]

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
