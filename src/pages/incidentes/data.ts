import type { EstadoIncidente, IncidenteItem, HistoryEntry, TipoIncidente, Criticidad } from "./types"

export const TIPO_INCIDENTE_OPTIONS: { label: string; value: TipoIncidente }[] = [
  { label: "Falla Eléctrica", value: "falla_electrica" },
  { label: "Corte de Agua", value: "corte_agua" },
  { label: "Daño en Equipo", value: "dano_equipo" },
  { label: "Inconveniente con Proveedor", value: "inconveniente_proveedor" },
  { label: "Retraso en Montaje", value: "retraso_montaje" },
  { label: "Seguridad u Orden Público", value: "seguridad_orden_publico" },
  { label: "Emergencia Médica", value: "emergencia_medica" },
  { label: "Otro", value: "otro" },
]

export const CRITICIDAD_OPTIONS: { label: string; value: Criticidad }[] = [
  { label: "Baja", value: "Baja" },
  { label: "Media", value: "Media" },
  { label: "Alta", value: "Alta" },
  { label: "Crítica", value: "Crítica" },
]

export const ESTADO_INCIDENTE_OPTIONS: { label: string; value: EstadoIncidente }[] = [
  { label: "Reportado", value: "Reportado" },
  { label: "En Atención", value: "En Atención" },
  { label: "Solucionado", value: "Solucionado" },
  { label: "Escalado", value: "Escalado" },
]

export const ESTADO_FILTER_OPTIONS = [
  { label: "Todos los Estados", value: "Todos" },
  ...ESTADO_INCIDENTE_OPTIONS,
]

export const INITIAL_INCIDENTS: IncidenteItem[] = []

export const INITIAL_HISTORY: Record<string, HistoryEntry[]> = {}
