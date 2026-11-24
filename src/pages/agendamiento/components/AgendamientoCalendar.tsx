import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react"
import { todayISO } from "@/utils/format"
import { DIAS_SEMANA, ESTADO_STYLES, ESTADOS_AGENDA, MESES } from "../constants"
import type { AgendaEvent, CalendarMonth } from "../types"
import { compareAgenda, formatMonth, getCalendarDays, getEventISO } from "../utils"
import { CalendarCell } from "./CalendarCell"

interface AgendamientoCalendarProps {
  month: CalendarMonth
  selectedDate: string
  events: AgendaEvent[]
  onShiftMonth: (delta: number) => void
  onToday: () => void
  onSelectDate: (iso: string) => void
  onCreate: (iso: string) => void
  onOpenEvent: (event: AgendaEvent) => void
}

export function AgendamientoCalendar({
  month,
  selectedDate,
  events,
  onShiftMonth,
  onToday,
  onSelectDate,
  onCreate,
  onOpenEvent,
}: AgendamientoCalendarProps) {
  const today = todayISO()

  return (
    <div className="flex-1 min-w-0 space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-[#262D3D]">
        <MonthButton
          icon={ChevronLeft}
          label="Mes anterior"
          onClick={() => onShiftMonth(-1)}
        />
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-[#F8FAFC]" aria-live="polite">
            {formatMonth(month)}
          </h2>
          {selectedDate !== today && (
            <button
              type="button"
              onClick={onToday}
              className="text-[11px] font-semibold text-[#A78BFA] hover:text-[#C4B5FD] cursor-pointer"
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
        className="grid grid-cols-7 text-center text-[11px] font-semibold text-[#94A3B8]"
      >
        {DIAS_SEMANA.map((dia) => (
          <span key={dia}>{dia}</span>
        ))}
      </div>

      <div
        role="group"
        aria-label={`Calendario de ${formatMonth(month)}`}
        className="grid grid-cols-7 gap-1.5 sm:gap-2"
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
              events={events.filter((ev) => getEventISO(ev) === iso).sort(compareAgenda)}
              onSelect={() => onSelectDate(iso)}
              onCreate={() => onCreate(iso)}
              onOpenEvent={onOpenEvent}
            />
          )
        })}
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-1.5 pt-3 border-t border-[#262D3D] text-[11px] text-[#CBD5E1]">
        {ESTADOS_AGENDA.map((estado) => (
          <li key={estado} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: ESTADO_STYLES[estado].color }}
            />
            {estado}
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
      className="w-9 h-9 rounded-xl bg-[#111318] border border-[#262D3D] text-[#CBD5E1] hover:bg-[#222734] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/70"
    >
      <Icon size={17} aria-hidden="true" />
    </button>
  )
}
