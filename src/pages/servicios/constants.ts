import type { EntityLabel } from "@/hooks/useCrudActions"
import type { TipoCobroServicio } from "./types"

export const SERVICIO_LABEL: EntityLabel = {
  singular: "servicio",
  plural: "servicios",
  gender: "m",
}

export const SERVICIO_FILTERS = { categoria: "Categoría", estado: "Estado" }

export const TIPO_COBRO_LABELS: Record<TipoCobroServicio, string> = {
  por_evento: "Por evento",
  por_hora: "Por hora",
  por_dia: "Por día",
  por_persona: "Por persona",
  tarifa_fija: "Tarifa fija",
}

export const TIPO_COBRO_OPTIONS = Object.entries(TIPO_COBRO_LABELS).map(
  ([value, label]) => ({ value, label }),
)
