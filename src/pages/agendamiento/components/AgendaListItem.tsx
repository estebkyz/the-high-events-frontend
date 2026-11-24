import { Clock, MapPin } from "lucide-react"
import { StatusBadge } from "@/components/StatusBadge"
import { MESES, TIPO_LABELS } from "../constants"
import type { AgendaEvent } from "../types"

interface AgendaListItemProps {
  event: AgendaEvent
  onClick: () => void
}

export function AgendaListItem({ event, onClick }: AgendaListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left p-3 rounded-xl bg-[#111318] border border-[#262D3D] hover:border-[#7C3AED] focus-visible:border-[#7C3AED] focus:outline-none transition-colors cursor-pointer space-y-1.5"
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-[#A78BFA] tabular-nums">
          {event.day} {MESES[event.month].slice(0, 3)} · {event.time}
        </span>
        <StatusBadge status={event.estado} />
      </span>
      <span className="block text-xs font-semibold text-[#F8FAFC] truncate">
        {event.title}
      </span>
      <span className="flex items-center gap-3 text-[11px] text-[#94A3B8]">
        <span className="inline-flex items-center gap-1">
          <Clock size={11} aria-hidden="true" />
          {TIPO_LABELS[event.tipo_agendamiento] ?? "Evento"}
        </span>
        {event.venue && (
          <span className="inline-flex items-center gap-1 min-w-0">
            <MapPin size={11} className="shrink-0" aria-hidden="true" />
            <span className="truncate">{event.venue}</span>
          </span>
        )}
      </span>
    </button>
  )
}
