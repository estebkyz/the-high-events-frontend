import type { EntityLabel } from "@/hooks/useCrudActions"
import { toOptions } from "@/utils/list"

export const EMPLEADO_LABEL: EntityLabel = {
  singular: "empleado",
  plural: "empleados",
  gender: "m",
}

export const EMPLEADO_FILTERS = {
  cargo: "Cargo",
  vinculacion: "Vinculación",
  estado: "Estado",
}

export const CARGOS = [
  "Ingeniero de Audio",
  "Técnico de Luces",
  "Coordinadora Logística",
  "DJ Residente",
  "Fotógrafo / Fotógrafa",
  "Director de Escenografía",
  "Videógrafo / Videógrafa",
  "Auxiliar de Montaje",
]

export const CARGO_OPTIONS = toOptions(CARGOS)

export const VINCULACION_OPTIONS = [
  { label: "Fijo (Nómina The High Events)", value: "Fijo" },
  { label: "Por Evento (Freelance / Honorarios)", value: "Por Evento" },
]

export const VINCULACION_FILTER_OPTIONS = [
  { label: "Fijo", value: "Fijo" },
  { label: "Evento", value: "Por Evento" },
]

export const VINCULACION_TABS = [
  { id: "Fijo", label: "Vinculación fija" },
  { id: "Por Evento", label: "Por evento" },
]
