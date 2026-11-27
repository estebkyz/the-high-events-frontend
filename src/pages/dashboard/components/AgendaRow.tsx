import { CalendarCheck, Clock } from "lucide-react"
import { StatusBadge } from "@/components/StatusBadge"
import { TIPO_LABELS } from "@/pages/agendamiento/constants"
import type { AgendaEntry } from "@/pages/agendamiento/types"

interface AgendaRowProps {
  event: AgendaEntry
  onClick: () => void
}

/** Un evento o reunión del día en una sola línea. */
export function AgendaRow({ event, onClick }: AgendaRowProps) {
  const TipoIcon = event.tipo_agendamiento === "evento" ? CalendarCheck : Clock
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full min-h-9 px-2 py-1.5 rounded-lg flex items-center gap-2.5 text-left text-xs hover:bg-hover transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <span className="shrink-0 font-semibold text-brand-ink tabular-nums">
        {event.time}
      </span>
      <TipoIcon size={12} aria-hidden="true" className="shrink-0 text-ink-muted" />
      <span className="sr-only">{TIPO_LABELS[event.tipo_agendamiento]}:</span>
      <span className="flex-1 min-w-0 font-medium text-ink break-words">
        {event.title}
      </span>
      <StatusBadge status={event.estado} className="shrink-0" />
    </button>
  )
}
