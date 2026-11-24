import { Plus } from "lucide-react"
import { ESTADO_STYLES } from "../constants"
import type { AgendaEvent } from "../types"

const MAX_CHIPS = 2

interface CalendarCellProps {
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  events: AgendaEvent[]
  label: string
  onSelect: () => void
  onCreate: () => void
  onOpenEvent: (event: AgendaEvent) => void
}

export function CalendarCell({
  day,
  isCurrentMonth,
  isToday,
  isSelected,
  events,
  label,
  onSelect,
  onCreate,
  onOpenEvent,
}: CalendarCellProps) {
  const border = isSelected
    ? "border-[#7C3AED] ring-2 ring-[#7C3AED]/25"
    : isToday
      ? "border-[#A78BFA]/70"
      : "border-[#262D3D] hover:border-[#3B475E]"

  return (
    <div
      className={`group relative min-h-[66px] sm:min-h-[92px] p-1.5 sm:p-2 rounded-xl bg-[#111318] border transition-colors flex flex-col gap-1 ${border} ${
        isCurrentMonth ? "" : "opacity-40"
      }`}
    >
      {/* Botón que cubre la celda: seleccionar el día con teclado o ratón. */}
      <button
        type="button"
        onClick={onSelect}
        aria-label={label}
        aria-pressed={isSelected}
        aria-current={isToday ? "date" : undefined}
        className="absolute inset-0 rounded-xl cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
      />
      <div className="flex items-center justify-between pointer-events-none">
        <span
          className={`text-xs font-semibold tabular-nums ${
            isSelected || isToday ? "text-[#A78BFA]" : "text-[#F8FAFC]"
          }`}
        >
          {day}
        </span>
        <button
          type="button"
          onClick={onCreate}
          aria-label={`Crear agendamiento: ${label}`}
          className="pointer-events-auto relative w-5 h-5 flex items-center justify-center rounded-md bg-[#222734] text-[#CBD5E1] hover:bg-[#7C3AED] hover:text-white cursor-pointer opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
        >
          <Plus size={11} aria-hidden="true" />
        </button>
      </div>

      <div className="hidden sm:block space-y-1 relative pointer-events-none">
        {events.slice(0, MAX_CHIPS).map((event) => (
          <button
            key={event.id}
            type="button"
            onClick={() => onOpenEvent(event)}
            title={`${event.time} · ${event.title} · ${event.client}`}
            className={`pointer-events-auto w-full text-left px-1.5 py-0.5 rounded text-[10px] font-semibold truncate cursor-pointer ${ESTADO_STYLES[event.estado].chip}`}
          >
            {event.time} {event.title}
          </button>
        ))}
        {events.length > MAX_CHIPS && (
          <span className="block text-[10px] text-[#94A3B8] pl-1">
            +{events.length - MAX_CHIPS} más
          </span>
        )}
      </div>

      <div className="flex sm:hidden gap-1 flex-wrap pointer-events-none">
        {events.slice(0, 4).map((event) => (
          <span
            key={event.id}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: ESTADO_STYLES[event.estado].color }}
          />
        ))}
      </div>
    </div>
  )
}
