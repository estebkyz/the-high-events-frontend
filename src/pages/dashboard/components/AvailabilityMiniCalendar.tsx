import { useState } from "react"
import { ArrowUpRight, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/Button"
import { DetailEmptyNote } from "@/components/detail"
import type { AgendaEntry, CalendarMonth } from "@/pages/agendamiento/types"
import {
  compareAgenda,
  formatMonth,
  getEventISO,
  getToday,
  parseISO,
  shiftMonth,
} from "@/pages/agendamiento/utils"
import { todayISO } from "@/utils/format"
import { ARROW_BUTTON, PANEL } from "../constants"
import type { ViewState } from "../types"
import { AgendaRow } from "./AgendaRow"
import { CalendarGrid } from "./CalendarGrid"
import { PanelBody } from "./PanelBody"

interface AvailabilityMiniCalendarProps {
  agenda: AgendaEntry[]
  state: ViewState
  /** Sin fecha, abre la agenda en el mes actual; ausente si no puede verla. */
  onOpenAgenda?: (iso?: string) => void
  onCreateEvento?: (iso: string) => void
}

const MAX_EVENTOS = 5
const LINK =
  "text-xs text-brand-ink hover:underline inline-flex items-center gap-1 py-1 font-medium cursor-pointer"

/** Mes compacto con la ocupación de la agenda y el detalle del día elegido. */
export function AvailabilityMiniCalendar({
  agenda,
  state,
  onOpenAgenda,
  onCreateEvento,
}: AvailabilityMiniCalendarProps) {
  const [month, setMonth] = useState<CalendarMonth>(getToday)
  const [selected, setSelected] = useState(() => todayISO())
  const eventsOn = (iso: string) => agenda.filter((ev) => getEventISO(ev) === iso)
  const ofDay = eventsOn(selected).sort(compareAgenda)
  const hidden = ofDay.length - MAX_EVENTOS
  const { year, month: monthIndex, day } = parseISO(selected)
  const dayLabel = new Date(year, monthIndex, day).toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  const handleSelect = (iso: string) => {
    const date = parseISO(iso)
    setSelected(iso)
    setMonth({ year: date.year, month: date.month })
  }

  return (
    <section className={`${PANEL} @container space-y-3`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[14px] font-semibold text-ink">Agenda</h2>
        {onOpenAgenda && (
          <button type="button" onClick={() => onOpenAgenda()} className={LINK}>
            Abrir agenda <ArrowUpRight size={13} aria-hidden="true" />
          </button>
        )}
      </div>

      <PanelBody state={state} skeleton="h-[420px]">
        <div className="grid gap-4 @2xl:grid-cols-2 @2xl:gap-6">
          <div className="space-y-3 min-w-0">
            <div className="flex items-center justify-between">
              <button
                type="button"
                aria-label="Mes anterior"
                onClick={() => setMonth(shiftMonth(month, -1))}
                className={ARROW_BUTTON}
              >
                <ChevronLeft size={14} aria-hidden="true" />
              </button>
              <p aria-live="polite" className="text-xs font-medium text-ink-soft">
                {formatMonth(month)}
              </p>
              <button
                type="button"
                aria-label="Mes siguiente"
                onClick={() => setMonth(shiftMonth(month, 1))}
                className={ARROW_BUTTON}
              >
                <ChevronRight size={14} aria-hidden="true" />
              </button>
            </div>
            <CalendarGrid
              month={month}
              selected={selected}
              countOn={(iso) => eventsOn(iso).length}
              onSelect={handleSelect}
            />
          </div>

          <div
            className="space-y-2 min-w-0 pt-3 border-t border-line @2xl:pt-0 @2xl:border-t-0"
            aria-live="polite"
          >
            <p className="flex flex-wrap items-baseline justify-between gap-x-2 text-xs">
              <span className="font-semibold text-ink first-letter:uppercase inline-block">
                {dayLabel}
              </span>
              <span className="text-xs text-ink-muted tabular-nums">
                {ofDay.length} en la agenda
              </span>
            </p>
            {ofDay.length === 0 && <DetailEmptyNote text="Fecha disponible." />}
            {ofDay.length > 0 && (
              <ul className="-mx-2">
                {ofDay.slice(0, MAX_EVENTOS).map((event) => (
                  <li key={event.id}>
                    <AgendaRow event={event} onClick={() => onOpenAgenda?.(selected)} />
                  </li>
                ))}
              </ul>
            )}
            {onOpenAgenda && hidden > 0 && (
              <button
                type="button"
                onClick={() => onOpenAgenda?.(selected)}
                className={LINK}
              >
                Ver {hidden} más este día
              </button>
            )}
            {onCreateEvento && (
              <Button
                icon={Plus}
                className="w-full"
                onClick={() => onCreateEvento(selected)}
              >
                Crear evento este día
              </Button>
            )}
          </div>
        </div>
      </PanelBody>
    </section>
  )
}
