import {
  AlertTriangle,
  CheckCircle,
  FileText,
  Send,
  XCircle,
  type LucideIcon,
} from "lucide-react"
import type { EntityLabel } from "@/hooks/useCrudActions"
import { toOptions } from "@/utils/list"
import type { EstadoCotizacion } from "./types"

export const COTIZACION_LABEL: EntityLabel = {
  singular: "cotización",
  plural: "cotizaciones",
  gender: "f",
}

export const COTIZACION_FILTERS = { estado: "Estado", cliente: "Cliente" }

export const ESTADOS_COTIZACION: EstadoCotizacion[] = [
  "Borrador",
  "Enviada",
  "Aceptada",
  "Rechazada",
  "Vencida",
]
export const ESTADO_COTIZACION_OPTIONS = toOptions(ESTADOS_COTIZACION)
export const ESTADO_COTIZACION_TABS = [
  { id: "Borrador", label: "Borrador" },
  { id: "Enviada", label: "Enviadas" },
  { id: "Aceptada", label: "Aceptadas" },
  { id: "Rechazada", label: "Rechazadas" },
  { id: "Vencida", label: "Vencidas" },
]

export const ESTADO_ICONS: Record<EstadoCotizacion, LucideIcon> = {
  Borrador: FileText,
  Enviada: Send,
  Aceptada: CheckCircle,
  Rechazada: XCircle,
  Vencida: AlertTriangle,
}

/** Transiciones permitidas desde el detalle. */
export const TRANSICIONES: Record<EstadoCotizacion, EstadoCotizacion[]> = {
  Borrador: ["Enviada"],
  Enviada: ["Aceptada", "Rechazada", "Vencida"],
  Aceptada: ["Borrador"],
  Rechazada: ["Borrador"],
  Vencida: ["Borrador"],
}
