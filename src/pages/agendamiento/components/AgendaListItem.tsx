import { CalendarCheck, Clock, MapPin } from "lucide-react"
import { StatusBadge } from "@/components/StatusBadge"
import { MESES, TIPO_LABELS } from "../constants"
import type { AgendaEntry } from "../types"

interface AgendaListItemProps {
  event: AgendaEntry
  onClick: () => void
}

export function AgendaListItem({ event, onClick }: AgendaListItemProps) {
  const TipoIcon = event.tipo_agendamiento === "evento" ? CalendarCheck : Clock
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left p-3 rounded-lg hover:bg-hover transition-colors cursor-pointer space-y-1.5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
    >
      <span className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-ink-muted tabular-nums">
          {event.day} {MESES[event.month].slice(0, 3)} · {event.time}
        </span>
        <StatusBadge status={event.estado} />
      </span>
      <span className="block text-[13px] font-semibold text-ink break-words">
        {event.title}
      </span>
      <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
        <span className="inline-flex items-center gap-1">
          <TipoIcon size={11} aria-hidden="true" />
          {TIPO_LABELS[event.tipo_agendamiento]}
        </span>
        {event.venue && (
          <span className="inline-flex items-center gap-1 min-w-0">
            <MapPin size={11} className="shrink-0" aria-hidden="true" />
            <span className="min-w-0 break-words">{event.venue}</span>
          </span>
        )}
      </span>
    </button>
  )
}
