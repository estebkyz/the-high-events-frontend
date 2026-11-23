import type { UsuarioItem } from "./types"

export const INITIAL_USERS: UsuarioItem[] = []

export const ROL_OPTIONS: { label: string; value: string }[] = []

export const TIPO_DOC_OPTIONS = [
  { label: "CC", value: "CC" },
  { label: "CE", value: "CE" },
  { label: "NIT", value: "NIT" },
  { label: "Pasaporte", value: "PASAPORTE" },
]

export const ESTADO_OPTIONS = [
  { label: "Activo", value: "Activo" },
  { label: "Inactivo", value: "Inactivo" },
]

export const ROL_FILTER_OPTIONS = [
  { label: "Todos los Roles", value: "Todos" },
  ...ROL_OPTIONS,
]

export const ESTADO_FILTER_OPTIONS = [
  { label: "Todos los Estados", value: "Todos" },
  ...ESTADO_OPTIONS,
]
