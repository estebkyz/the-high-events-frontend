import type { SelectOption } from "../../components/CustomSelect"
import type { EmpleadoItem } from "./types"

export const CARGOS: string[] = [
  "Ingeniero de Audio",
  "Técnico de Luces",
  "Coordinadora Logística",
  "DJ Residente",
  "Fotógrafo / Fotógrafa",
  "Director de Escenografía",
  "Videógrafo / Videógrafa",
  "Auxiliar de Montaje",
]

export const CARGOS_OPTIONS: SelectOption[] = CARGOS.map((c) => ({
  label: c,
  value: c,
}))

export const TIPOS_DOCUMENTO_OPTIONS: SelectOption[] = [
  { label: "CC", value: "CC" },
  { label: "CE", value: "CE" },
  { label: "NIT", value: "NIT" },
  { label: "Pasaporte", value: "PASAPORTE" },
]

export const VINCULACION_OPTIONS: SelectOption[] = [
  { label: "Fijo (Nómina The High Events)", value: "Fijo" },
  { label: "Por Evento (Freelance / Honorarios)", value: "Por Evento" },
]

export const ESTADOS_OPTIONS: SelectOption[] = [
  { label: "Activo", value: "Activo" },
  { label: "Inactivo", value: "Inactivo" },
]

export const INITIAL_EMPLOYEES: EmpleadoItem[] = []
