import { toOptions } from "@/utils/list"

export const ESTADOS_ACTIVO = ["Activo", "Inactivo"] as const
export type EstadoActivo = (typeof ESTADOS_ACTIVO)[number]
export const ESTADO_ACTIVO_OPTIONS = toOptions(ESTADOS_ACTIVO)
export const ESTADO_ACTIVO_TABS = [
  { id: "Activo", label: "Activos" },
  { id: "Inactivo", label: "Inactivos" },
]

export type TipoDocumento = "CC" | "CE" | "NIT" | "PASAPORTE"
export const TIPO_DOCUMENTO_OPTIONS: { label: string; value: TipoDocumento }[] = [
  { label: "CC", value: "CC" },
  { label: "CE", value: "CE" },
  { label: "NIT", value: "NIT" },
  { label: "Pasaporte", value: "PASAPORTE" },
]
