import { useCrudResource } from "@/hooks/useCrudResource"
import type { AbonoItem } from "@/pages/abonos/types"
import { buildAgenda } from "@/pages/agendamiento/agenda"
import type { AgendaEvent } from "@/pages/agendamiento/types"
import type { EquipoItem } from "@/pages/equipos/types"
import type { EventoItem } from "@/pages/eventos/types"
import type { IncidenteItem } from "@/pages/incidentes/types"
import type { Recepcion } from "@/pages/recepciones/types"
import type { TareaItem } from "@/pages/tareas/types"
import type { VentaItem } from "@/pages/ventas/types"
import { cobrosDe, type DashboardData } from "./metrics"
import type { ViewState } from "./types"
import { MODULE_ACCESS } from "@/constants/access"
import { useCan } from "@/hooks/useAccess"

interface ResourceStatus {
  loading: boolean
  error: string | null
}

function stateOf(...resources: ResourceStatus[]): ViewState {
  if (resources.some((r) => r.loading)) return "loading"
  return resources.some((r) => r.error) ? "error" : "ready"
}

export function useDashboardData() {
  const can = useCan()
  const access = {
    ventas: can(MODULE_ACCESS.ventas.view),
    abonos: can(MODULE_ACCESS.abonos.view),
  }
  const ventas = useCrudResource<VentaItem>({
    endpoint: "/ventas",
    enabled: access.ventas,
  })
  const abonos = useCrudResource<AbonoItem>({
    endpoint: "/abonos",
    enabled: access.abonos,
  })
  const eventos = useCrudResource<EventoItem>({ endpoint: "/eventos" })
  const equipos = useCrudResource<EquipoItem>({ endpoint: "/equipos" })
  const tareas = useCrudResource<TareaItem>({ endpoint: "/evento-tareas" })
  const recepciones = useCrudResource<Recepcion>({ endpoint: "/recepciones" })
  const incidentes = useCrudResource<IncidenteItem>({ endpoint: "/incidentes" })
  const agenda = useCrudResource<AgendaEvent>({ endpoint: "/agendamientos" })

  const resources = [
    ventas,
    abonos,
    eventos,
    equipos,
    tareas,
    recepciones,
    incidentes,
    agenda,
  ]

  const data: DashboardData = {
    ventas: ventas.items,
    abonos: abonos.items,
    cobros: cobrosDe(abonos.items),
    eventos: eventos.items,
    equipos: equipos.items,
    tareas: tareas.items,
    recepciones: recepciones.items,
    incidentes: incidentes.items,
  }

  return {
    /** Las cifras de un módulo que la persona no puede ver no se muestran. */
    access,
    data,
    agenda: buildAgenda(agenda.items, eventos.items),
    /** Por panel: una falla en incidentes no oculta las ventas. */
    state: {
      ventas: stateOf(ventas),
      cobros: stateOf(abonos),
      eventos: stateOf(eventos),
      porCobrar: stateOf(abonos, ventas),
      porPagar: stateOf(abonos, eventos),
      operacion: stateOf(equipos, tareas, recepciones, incidentes),
      agenda: stateOf(agenda, eventos),
    },
    loading: resources.some((r) => r.loading),
    /** Primer error: las cifras podrían estar incompletas. */
    error: resources.find((r) => r.error)?.error ?? null,
    refresh: () => Promise.all(resources.map((r) => r.refresh())),
  }
}
