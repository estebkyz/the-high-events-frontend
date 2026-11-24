import { useState } from "react"
import { ArrowUpRight, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { DetailEmptyNote } from "@/components/detail"
import { AgendaListItem } from "@/pages/agendamiento/components/AgendaListItem"
import { DIAS_SEMANA } from "@/pages/agendamiento/constants"
import type { AgendaEvent, CalendarMonth } from "@/pages/agendamiento/types"
import {
  compareAgenda,
  formatMonth,
  getCalendarDays,
  getEventISO,
  getToday,
  shiftMonth,
} from "@/pages/agendamiento/utils"
import { todayISO } from "@/utils/format"
import { PANEL } from "../constants"

interface AvailabilityMiniCalendarProps {
  agenda: AgendaEvent[]
  onOpenAgenda: () => void
  onCreateEvento: (iso: string) => void
}

const ARROW =
  "p-1 rounded text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#222734] cursor-pointer transition-colors"

/** Mes compacto con la ocupación de la agenda y el detalle del día elegido. */
export function AvailabilityMiniCalendar({
  agenda,
  onOpenAgenda,
  onCreateEvento,
}: AvailabilityMiniCalendarProps) {
  const today = todayISO()
  const [month, setMonth] = useState<CalendarMonth>(getToday)
  const [selected, setSelected] = useState(today)
  const eventsOn = (iso: string) => agenda.filter((ev) => getEventISO(ev) === iso)
  const ofDay = eventsOn(selected).sort(compareAgenda)

  return (
    <section className={`${PANEL} space-y-3`}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-semibold text-[#F8FAFC]">Agenda</h2>
        <button
          type="button"
          onClick={onOpenAgenda}
          className="text-[12px] text-[#A78BFA] hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
        >
          Abrir agenda <ArrowUpRight size={13} aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Mes anterior"
          onClick={() => setMonth(shiftMonth(month, -1))}
          className={ARROW}
        >
          <ChevronLeft size={14} aria-hidden="true" />
        </button>
        <p aria-live="polite" className="text-xs font-medium text-[#CBD5E1]">
          {formatMonth(month)}
        </p>
        <button
          type="button"
          aria-label="Mes siguiente"
          onClick={() => setMonth(shiftMonth(month, 1))}
          className={ARROW}
        >
          <ChevronRight size={14} aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-[#94A3B8]">
        {DIAS_SEMANA.map((dia) => (
          <span key={dia} aria-hidden="true">
            {dia}
          </span>
        ))}
        {getCalendarDays(month).map((date) => {
          const iso = todayISO(date)
          const count = eventsOn(iso).length
          const isSelected = iso === selected
          return (
            <button
              key={iso}
              type="button"
              aria-pressed={isSelected}
              aria-current={iso === today ? "date" : undefined}
              aria-label={`${date.getDate()}: ${count} agendamientos`}
              onClick={() => setSelected(iso)}
              className={`relative h-8 rounded-lg text-[12px] tabular-nums transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] ${
                isSelected
                  ? "bg-[#7C3AED] text-white font-semibold"
                  : count > 0
                    ? "bg-[#7C3AED]/20 text-[#C4B5FD] font-semibold"
                    : "text-[#CBD5E1] hover:bg-[#222734]"
              } ${date.getMonth() === month.month ? "" : "opacity-40"} ${
                iso === today ? "ring-1 ring-[#A78BFA]" : ""
              }`}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>

      <div className="space-y-2 pt-3 border-t border-[#262D3D]" aria-live="polite">
        {ofDay.length === 0 && <DetailEmptyNote text="Fecha disponible." />}
        {ofDay.slice(0, 3).map((event) => (
          <AgendaListItem key={event.id} event={event} onClick={onOpenAgenda} />
        ))}
        <button
          type="button"
          onClick={() => onCreateEvento(selected)}
          className="w-full px-3 py-2 rounded-xl text-[12px] font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Plus size={14} aria-hidden="true" />
          Crear evento este día
        </button>
      </div>
    </section>
  )
}
