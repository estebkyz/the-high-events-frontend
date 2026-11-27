import type { EntityLabel } from "@/hooks/useCrudActions"
import { EMPRESA } from "@/constants/empresa"

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

/** Sugerencias: se puede escribir cualquier otro cargo. */
export const CARGOS_SUGERIDOS = [
  "Ingeniero de Audio",
  "Técnico de Luces",
  "Coordinadora Logística",
  "DJ Residente",
  "Fotógrafo / Fotógrafa",
  "Director de Escenografía",
  "Videógrafo / Videógrafa",
  "Auxiliar de Montaje",
]

export const VINCULACION_OPTIONS = [
  { label: `Fijo (Nómina ${EMPRESA.nombre})`, value: "Fijo" },
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
