import { CalendarCheck, LayoutGrid, List, Ticket, Users } from "lucide-react"
import type { SegmentedOption } from "@/components/SegmentedControl"
import type { EntityLabel } from "@/hooks/useCrudActions"
import { toOptions } from "@/utils/list"
import type { EstadoEvento } from "./types"

export const EVENTO_LABEL: EntityLabel = {
  singular: "evento",
  plural: "eventos",
  gender: "m",
}

export const EVENTO_FILTERS = { modalidad: "Modalidad", estado: "Estado" }

export const ESTADOS_EVENTO: EstadoEvento[] = [
  "Planificación",
  "Confirmado",
  "Montaje",
  "En ejecución",
  "Desmontaje",
  "Finalizado",
  "Cerrado financiero",
  "Cancelado",
]
export const ESTADO_EVENTO_OPTIONS = toOptions(ESTADOS_EVENTO)

export const MODALIDAD_TABS = [
  { id: "Propio", label: "Propios" },
  { id: "Cliente", label: "Clientes" },
]

export const MODALIDAD_FILTER_OPTIONS = [
  { label: "Propios", value: "Propio" },
  { label: "Clientes", value: "Cliente" },
]

export const MODALIDAD_OPTIONS: SegmentedOption[] = [
  { label: "Evento para cliente", value: "Cliente", icon: Users },
  { label: "Evento propio", value: "Propio", icon: Ticket },
]

export const EVENTO_VIEWS: SegmentedOption[] = [
  { label: "Tarjetas", value: "grid", icon: LayoutGrid },
  { label: "Tabla", value: "table", icon: List },
]

export const EMPTY_EVENTOS = {
  icon: CalendarCheck,
  title: "Aún no tienes eventos programados",
  description: "Crea eventos propios o de clientes para coordinar servicios y personal.",
  createLabel: "Crear evento",
}

export const MAX_NOMBRE = 45
export const PRODUCTORA = "The High Events"
