import type { ClienteItem, HistorialItem } from "./types"

export const HISTORIAL: Record<string, HistorialItem[]> = {}

export const INITIAL_CLIENTS: ClienteItem[] = []

export const TIPO_CLIENTE_OPTIONS = [
  { label: "Empresa", value: "Empresa" },
  { label: "Persona", value: "Natural" },
]

export const TIPO_DOC_EMPRESA_OPTIONS = [
  { label: "NIT", value: "NIT" },
  { label: "CE", value: "CE" },
  { label: "Pasaporte", value: "PASAPORTE" },
]

export const TIPO_DOC_NATURAL_OPTIONS = [
  { label: "CC", value: "CC" },
  { label: "CE", value: "CE" },
  { label: "Pasaporte", value: "PASAPORTE" },
]

export const ESTADO_OPTIONS = [
  { label: "Activo", value: "Activo" },
  { label: "Inactivo", value: "Inactivo" },
]

export const ESTADO_FILTER_OPTIONS = [
  { label: "Todos los Estados", value: "Todos" },
  ...ESTADO_OPTIONS,
]
