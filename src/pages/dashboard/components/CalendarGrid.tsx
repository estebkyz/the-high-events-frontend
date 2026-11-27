import { useEffect, useRef, type KeyboardEvent } from "react"
import { DIAS_SEMANA } from "@/pages/agendamiento/constants"
import type { CalendarMonth } from "@/pages/agendamiento/types"
import { getCalendarDays, parseISO } from "@/pages/agendamiento/utils"
import { todayISO } from "@/utils/format"

interface CalendarGridProps {
  month: CalendarMonth
  selected: string
  countOn: (iso: string) => number
  onSelect: (iso: string) => void
}

/** Días que avanza cada tecla dentro del calendario. */
const KEY_STEP: Record<string, number> = {
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -7,
  ArrowDown: 7,
}

function formatDay(date: Date): string {
  return date.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

/** Mes navegable: una sola parada de Tab y flechas entre días. */
export function CalendarGrid({ month, selected, countOn, onSelect }: CalendarGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const moveFocus = useRef(false)
  const today = todayISO()
  const isInMonth = (date: Date) => date.getMonth() === month.month
  const days = getCalendarDays(month)
  // La última semana se omite si es toda del mes siguiente.
  const visible = days.slice(-7).some(isInMonth) ? days : days.slice(0, -7)
  const inMonth = visible.filter(isInMonth).map((date) => todayISO(date))
  const tabStop = inMonth.includes(selected) ? selected : inMonth[0]

  useEffect(() => {
    if (!moveFocus.current) return
    moveFocus.current = false
    gridRef.current?.querySelector<HTMLElement>(`[data-iso="${selected}"]`)?.focus()
  }, [selected])

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = KEY_STEP[e.key]
    const iso = e.currentTarget.dataset.iso
    if (!step || !iso) return
    e.preventDefault()
    const from = parseISO(iso)
    moveFocus.current = true
    onSelect(todayISO(new Date(from.year, from.month, from.day + step)))
  }

  return (
    <div
      ref={gridRef}
      role="group"
      aria-label="Días del mes"
      className="grid grid-cols-7 gap-1 text-center text-xs text-ink-muted"
    >
      {DIAS_SEMANA.map((dia) => (
        <span key={dia} aria-hidden="true">
          {dia}
        </span>
      ))}
      {visible.map((date) => {
        const iso = todayISO(date)
        if (!isInMonth(date)) return <span key={iso} aria-hidden="true" />
        const count = countOn(iso)
        const isSelected = iso === selected
        return (
          <button
            key={iso}
            type="button"
            data-iso={iso}
            tabIndex={iso === tabStop ? 0 : -1}
            aria-pressed={isSelected}
            aria-current={iso === today ? "date" : undefined}
            aria-label={`${formatDay(date)}: ${count} en la agenda`}
            onClick={() => onSelect(iso)}
            onKeyDown={handleKeyDown}
            className={`min-h-8 rounded-lg text-xs tabular-nums transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
              isSelected
                ? "bg-brand text-white font-semibold"
                : count > 0
                  ? "bg-brand-soft text-brand-ink font-semibold"
                  : "text-ink-soft hover:bg-hover"
            } ${iso === today ? "ring-1 ring-brand" : ""}`}
          >
            {date.getDate()}
          </button>
        )
      })}
    </div>
  )
}
