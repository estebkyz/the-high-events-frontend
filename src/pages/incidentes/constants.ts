import type { EntityLabel } from "@/hooks/useCrudActions"
import { toOptions } from "@/utils/list"
import type { Criticidad, EstadoIncidente, TipoIncidente } from "./types"

export const INCIDENTE_LABEL: EntityLabel = {
  singular: "incidente",
  plural: "incidentes",
  gender: "m",
}

export const INCIDENTE_FILTERS = { criticidad: "Criticidad", estado: "Estado" }

export const TIPO_INCIDENTE_LABELS: Record<TipoIncidente, string> = {
  falla_electrica: "Falla eléctrica",
  corte_agua: "Corte de agua",
  dano_equipo: "Daño en equipo",
  inconveniente_proveedor: "Inconveniente con proveedor",
  retraso_montaje: "Retraso en montaje",
  seguridad_orden_publico: "Seguridad u orden público",
  emergencia_medica: "Emergencia médica",
  otro: "Otro",
}
export const TIPO_INCIDENTE_OPTIONS = Object.entries(TIPO_INCIDENTE_LABELS).map(
  ([value, label]) => ({ value, label }),
)

const CRITICIDADES: Criticidad[] = ["Baja", "Media", "Alta", "Crítica"]
export const CRITICIDAD_OPTIONS = toOptions(CRITICIDADES)

export const ESTADOS_INCIDENTE: EstadoIncidente[] = [
  "Reportado",
  "En Atención",
  "Solucionado",
  "Escalado",
]
export const ESTADO_INCIDENTE_OPTIONS = toOptions(ESTADOS_INCIDENTE)
export const ESTADO_INCIDENTE_TABS = [
  { id: "Reportado", label: "Reportados" },
  { id: "En Atención", label: "En atención" },
  { id: "Solucionado", label: "Solucionados" },
  { id: "Escalado", label: "Escalados" },
]
