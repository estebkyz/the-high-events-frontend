import { Plus } from "lucide-react"
import { getEntryStyle } from "../agenda"
import type { AgendaEntry } from "../types"
import { Skeleton } from "@/components/Skeleton"

const MAX_CHIPS = 2

interface CalendarCellProps {
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  events: AgendaEntry[]
  /** Silueta de una reunión mientras llega la agenda. */
  loading: boolean
  label: string
  onSelect: () => void
  /** Sin permiso para crear no se muestra el botón. */
  onCreate?: () => void
  onOpenEvent: (event: AgendaEntry) => void
}

export function CalendarCell({
  day,
  isCurrentMonth,
  isToday,
  isSelected,
  events,
  loading,
  label,
  onSelect,
  onCreate,
  onOpenEvent,
}: CalendarCellProps) {
  return (
    <div
      className={`group relative min-h-[66px] sm:min-h-[96px] p-1.5 transition-colors flex flex-col gap-1 ${
        isSelected ? "bg-brand-soft" : "bg-surface hover:bg-surface-2"
      }`}
    >
      {/* Botón que cubre la celda: seleccionar el día con teclado o ratón. */}
      <button
        type="button"
        onClick={onSelect}
        aria-label={label}
        aria-pressed={isSelected}
        aria-current={isToday ? "date" : undefined}
        className="absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
      />
      <div className="flex items-center justify-between pointer-events-none">
        <span
          className={`min-w-6 h-6 px-1 inline-flex items-center justify-center rounded-lg text-xs font-semibold tabular-nums ${
            isToday
              ? "bg-brand text-white"
              : isCurrentMonth
                ? "text-ink"
                : "text-ink-muted font-normal"
          }`}
        >
          {day}
        </span>
        {onCreate && (
          <button
            type="button"
            onClick={onCreate}
            aria-label={`Crear reunión: ${label}`}
            className="pointer-events-auto relative size-6 flex items-center justify-center rounded-lg bg-fill text-ink-soft hover:bg-brand hover:text-white cursor-pointer opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          >
            <Plus size={13} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="hidden sm:block space-y-1 relative pointer-events-none">
        {loading && <Skeleton className="h-4 w-full" />}
        {events.slice(0, MAX_CHIPS).map((event) => (
          <button
            key={event.id}
            type="button"
            onClick={() => onOpenEvent(event)}
            title={`${event.time} · ${event.title} · ${event.client}`}
            className={`pointer-events-auto w-full text-left px-1.5 py-0.5 rounded-md text-[11px] font-medium truncate cursor-pointer ${getEntryStyle(event).chip}`}
          >
            {event.time} {event.title}
          </button>
        ))}
        {events.length > MAX_CHIPS && (
          <span className="block text-xs text-ink-muted pl-1">
            +{events.length - MAX_CHIPS} más
          </span>
        )}
      </div>

      <div className="flex sm:hidden gap-1 flex-wrap pointer-events-none">
        {events.slice(0, 4).map((event) => (
          <span
            key={event.id}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: getEntryStyle(event).color }}
          />
        ))}
      </div>
    </div>
  )
}
