import type { EntityLabel } from "@/hooks/useCrudActions"
import { toOptions } from "@/utils/list"
import type { EstadoItemRecepcion, EstadoRecepcion, TipoRecepcion } from "./types"

export const RECEPCION_LABEL: EntityLabel = {
  singular: "recepción",
  plural: "recepciones",
  gender: "f",
}

export const RECEPCION_FILTERS = { tipo: "Tipo", estado: "Estado" }

export const TIPOS_RECEPCION: TipoRecepcion[] = [
  "Recepción Montaje",
  "Recepción Desmontaje",
]
export const TIPO_RECEPCION_OPTIONS = toOptions(TIPOS_RECEPCION)

export const ESTADOS_RECEPCION: EstadoRecepcion[] = [
  "Pendiente",
  "Conforme",
  "Con Novedades",
  "Cerrada",
  "Anulada",
]
export const ESTADO_RECEPCION_OPTIONS = toOptions(ESTADOS_RECEPCION)
export const ESTADO_RECEPCION_TABS = [
  { id: "Pendiente", label: "Pendientes" },
  { id: "Conforme", label: "Conformes" },
  { id: "Con Novedades", label: "Con novedades" },
  { id: "Cerrada", label: "Cerradas" },
  { id: "Anulada", label: "Anuladas" },
]

const ESTADOS_ITEM: EstadoItemRecepcion[] = ["Excelente", "Bueno", "Regular", "Dañado"]
export const ESTADO_ITEM_OPTIONS = toOptions(ESTADOS_ITEM)
