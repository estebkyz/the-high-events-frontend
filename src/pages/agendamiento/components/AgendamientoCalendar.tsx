import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react"
import { todayISO } from "@/utils/format"
import { DIAS_SEMANA, LEYENDA, MESES } from "../constants"
import type { AgendaEntry, CalendarMonth } from "../types"
import { compareAgenda, formatMonth, getCalendarDays, getEventISO } from "../utils"
import { CalendarCell } from "./CalendarCell"
import { useModuleAccess } from "@/hooks/useAccess"

interface AgendamientoCalendarProps {
  month: CalendarMonth
  selectedDate: string
  events: AgendaEntry[]
  loading: boolean
  onShiftMonth: (delta: number) => void
  onToday: () => void
  onSelectDate: (iso: string) => void
  onCreate: (iso: string) => void
  onOpenEvent: (event: AgendaEntry) => void
}

export function AgendamientoCalendar({
  month,
  selectedDate,
  events,
  loading,
  onShiftMonth,
  onToday,
  onSelectDate,
  onCreate,
  onOpenEvent,
}: AgendamientoCalendarProps) {
  const { canCreate } = useModuleAccess()
  const today = todayISO()

  return (
    <div className="flex-1 min-w-0 space-y-4">
      <div className="flex items-center justify-between">
        <MonthButton
          icon={ChevronLeft}
          label="Mes anterior"
          onClick={() => onShiftMonth(-1)}
        />
        <div className="flex items-center gap-3">
          <h2 className="text-[16px] font-semibold text-ink" aria-live="polite">
            {formatMonth(month)}
          </h2>
          {selectedDate !== today && (
            <button
              type="button"
              onClick={onToday}
              className="btn btn-secondary !text-xs"
            >
              Hoy
            </button>
          )}
        </div>
        <MonthButton
          icon={ChevronRight}
          label="Mes siguiente"
          onClick={() => onShiftMonth(1)}
        />
      </div>

      <div
        aria-hidden="true"
        className="grid grid-cols-7 text-center text-xs font-medium text-ink-muted"
      >
        {DIAS_SEMANA.map((dia) => (
          <span key={dia}>{dia}</span>
        ))}
      </div>

      <div
        role="group"
        aria-busy={loading}
        aria-label={`Calendario de ${formatMonth(month)}`}
        className="grid grid-cols-7 gap-px bg-line-soft rounded-xl shadow-card overflow-hidden"
      >
        {getCalendarDays(month).map((date) => {
          const iso = todayISO(date)
          return (
            <CalendarCell
              key={iso}
              day={date.getDate()}
              label={`${date.getDate()} de ${MESES[date.getMonth()]}`}
              isCurrentMonth={date.getMonth() === month.month}
              isToday={iso === today}
              isSelected={iso === selectedDate}
              loading={loading && date.getDate() % 3 === 0}
              events={events.filter((ev) => getEventISO(ev) === iso).sort(compareAgenda)}
              onSelect={() => onSelectDate(iso)}
              onCreate={canCreate ? () => onCreate(iso) : undefined}
              onOpenEvent={onOpenEvent}
            />
          )
        })}
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-1.5 pt-3 border-t border-line text-xs text-ink-soft">
        {LEYENDA.map(({ label, color }) => (
          <li key={label} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}

interface MonthButtonProps {
  icon: LucideIcon
  label: string
  onClick: () => void
}

function MonthButton({ icon: Icon, label, onClick }: MonthButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="btn btn-secondary !px-2"
    >
      <Icon size={17} aria-hidden="true" />
    </button>
  )
}
