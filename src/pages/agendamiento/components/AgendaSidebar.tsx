import { useState } from "react"
import { CalendarPlus } from "lucide-react"
import { EmptyState } from "@/components/EmptyState"
import { SegmentedControl } from "@/components/SegmentedControl"
import type { AgendaEvent } from "../types"
import { compareAgenda, getEventISO, parseISO } from "../utils"
import { AgendaListItem } from "./AgendaListItem"

interface AgendaSidebarProps {
  monthLabel: string
  selectedDate: string
  /** Agendamientos del mes visible, ya filtrados. */
  events: AgendaEvent[]
  loading: boolean
  error: string | null
  onRetry: () => void
  onOpenEvent: (event: AgendaEvent) => void
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
  const [scope, setScope] = useState("month")
  const ofDay = events.filter((ev) => getEventISO(ev) === selectedDate)
  const visible = [...(scope === "day" ? ofDay : events)].sort(compareAgenda)
  const { day } = parseISO(selectedDate)

  return (
    <aside className="w-full lg:w-80 shrink-0 lg:border-l lg:border-[#262D3D] lg:pl-6 space-y-3">
      <h3 className="text-sm font-bold text-[#F8FAFC]">Agenda de {monthLabel}</h3>
      <SegmentedControl
        label="Alcance de la lista"
        value={scope}
        onChange={setScope}
        options={[
          { value: "month", label: `Mes (${events.length})` },
          { value: "day", label: `Día ${day} (${ofDay.length})` },
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
        <p role="status" className="py-8 text-center text-xs text-[#94A3B8]">
          Cargando agenda…
        </p>
      )}
      {!loading && !error && visible.length === 0 && (
        <EmptyState
          compact
          icon={CalendarPlus}
          title="Sin agendamientos"
          description="Crea un agendamiento o cambia de fecha."
          action={{ label: "Crear agendamiento", onClick: onCreate }}
        />
      )}
      <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
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
