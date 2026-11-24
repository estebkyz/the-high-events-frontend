import type { EntityLabel } from "@/hooks/useCrudActions"

export const CLIENTE_LABEL: EntityLabel = {
  singular: "cliente",
  plural: "clientes",
  gender: "m",
}

export const CLIENTE_FILTERS = { tipo: "Tipo", estado: "Estado" }

export const TIPO_CLIENTE_OPTIONS = [
  { label: "Empresa", value: "Empresa" },
  { label: "Persona", value: "Natural" },
]

export const TIPO_CLIENTE_TABS = [
  { id: "Empresa", label: "Empresas" },
  { id: "Natural", label: "Personas naturales" },
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
