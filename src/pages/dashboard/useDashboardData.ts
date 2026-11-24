import { useCrudResource } from "@/hooks/useCrudResource"
import type { AbonoItem } from "@/pages/abonos/types"
import type { AgendaEvent } from "@/pages/agendamiento/types"
import type { EquipoItem } from "@/pages/equipos/types"
import type { EventoItem } from "@/pages/eventos/types"
import type { IncidenteItem } from "@/pages/incidentes/types"
import type { Recepcion } from "@/pages/recepciones/types"
import type { TareaItem } from "@/pages/tareas/types"
import type { VentaItem } from "@/pages/ventas/types"
import { cobrosDe, type DashboardData } from "./metrics"

export function useDashboardData() {
  const ventas = useCrudResource<VentaItem>({ endpoint: "/ventas" })
  const abonos = useCrudResource<AbonoItem>({ endpoint: "/abonos" })
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
    data,
    agenda: agenda.items,
    loading: resources.some((r) => r.loading),
    /** Primer error: las cifras podrían estar incompletas. */
    error: resources.find((r) => r.error)?.error ?? null,
    refresh: () => Promise.all(resources.map((r) => r.refresh())),
  }
}
