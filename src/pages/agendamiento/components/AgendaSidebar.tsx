import { useState } from "react"
import { CalendarPlus } from "lucide-react"
import { EmptyState } from "@/components/EmptyState"
import { SegmentedControl } from "@/components/SegmentedControl"
import type { AgendaEntry } from "../types"
import { compareAgenda, getEventISO, parseISO } from "../utils"
import { AgendaListItem } from "./AgendaListItem"
import { useModuleAccess } from "@/hooks/useAccess"
import { Skeleton } from "@/components/Skeleton"

interface AgendaSidebarProps {
  monthLabel: string
  selectedDate: string
  /** Agendamientos del mes visible, ya filtrados. */
  events: AgendaEntry[]
  loading: boolean
  error: string | null
  onRetry: () => void
  onOpenEvent: (event: AgendaEntry) => void
  onCreate: () => void
}

export function AgendaSidebar({
  monthLabel,
  selectedDate,
  events,
  loading,
  error,
  onRetry,
  onOpenEvent,
  onCreate,
}: AgendaSidebarProps) {
  const { canCreate } = useModuleAccess()
  const [scope, setScope] = useState("month")
  const ofDay = events.filter((ev) => getEventISO(ev) === selectedDate)
  const visible = [...(scope === "day" ? ofDay : events)].sort(compareAgenda)
  const { day } = parseISO(selectedDate)

  return (
    <aside className="w-full lg:w-80 shrink-0 lg:border-l lg:border-line lg:pl-6 space-y-3">
      <h3 className="text-[14px] font-semibold text-ink">Agenda de {monthLabel}</h3>
      <SegmentedControl
        label="Alcance de la lista"
        value={scope}
        onChange={setScope}
        options={[
          { value: "month", label: loading ? "Mes" : `Mes (${events.length})` },
          {
            value: "day",
            label: loading ? `Día ${day}` : `Día ${day} (${ofDay.length})`,
          },
        ]}
      />
      {error && (
        <div role="alert">
          <EmptyState
            compact
            title="No se pudo cargar la agenda"
            description={error}
            action={{ label: "Reintentar", onClick: onRetry }}
          />
        </div>
      )}
      {loading && (
        <div role="status" className="space-y-4 py-2">
          <span className="sr-only">Cargando agenda…</span>
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="space-y-2">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      )}
      {!loading && !error && visible.length === 0 && (
        <EmptyState
          compact
          icon={CalendarPlus}
          title="Nada agendado"
          description="Crea una reunión o cambia de fecha. Los eventos aparecen aquí al crearlos."
          action={canCreate ? { label: "Crear reunión", onClick: onCreate } : undefined}
        />
      )}
      <div className="divide-y divide-line-soft max-h-[560px] overflow-y-auto -mx-3">
        {visible.map((event) => (
          <AgendaListItem
            key={event.id}
            event={event}
            onClick={() => onOpenEvent(event)}
          />
        ))}
      </div>
    </aside>
  )
}
