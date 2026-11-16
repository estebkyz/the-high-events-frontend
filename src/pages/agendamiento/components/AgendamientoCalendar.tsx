import React, { useMemo } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react"
import { MESES_NOMBRES, TODAY_YEAR, TODAY_MONTH, TODAY_DAY } from "../data"
import {
  GRUPO_META,
  compareAgenda,
  esPorConfirmar,
  getEstadoMeta,
  getDaysInMonth,
} from "../utils"
import type { AgendaEvent } from "../types"

interface AgendamientoCalendarProps {
  currentYear: number
  currentMonth: number
  selectedDay: number
  days: number[]
  startDayOfWeek: number
  eventsByDay: Record<number, AgendaEvent[]>
  onPrevMonth: () => void
  onNextMonth: () => void
  onGoToday: () => void
  onSelectDay: (day: number) => void
  onOpenEvent: (event: AgendaEvent) => void
  onQuickCreate: (day: number) => void
  sidebarContent?: React.ReactNode
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/70"

const DIAS_SEMANA = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"]

interface CalendarCell {
  day: number
  month: number
  year: number
  isCurrentMonth: boolean
  isPrevMonth: boolean
  isNextMonth: boolean
}

export function AgendamientoCalendar({
  currentYear,
  currentMonth,
  selectedDay,
  days,
  startDayOfWeek,
  eventsByDay,
  onPrevMonth,
  onNextMonth,
  onGoToday,
  onSelectDay,
  onOpenEvent,
  onQuickCreate,
  sidebarContent,
}: AgendamientoCalendarProps) {
  const monthName = MESES_NOMBRES[currentMonth]

  const yaEnHoy =
    currentYear === TODAY_YEAR &&
    currentMonth === TODAY_MONTH &&
    selectedDay === TODAY_DAY

  // Día de la semana del día seleccionado (0 = DOM, 1 = LUN, etc.)
  const selectedDayOfWeek = useMemo(() => {
    return new Date(currentYear, currentMonth, selectedDay).getDay()
  }, [currentYear, currentMonth, selectedDay])

  // Generación de cuadrícula completa de 42 celdas (6 semanas fijas de 7 días)
  // Idéntica a la estética de la referencia con días de relleno previo y posterior
  const calendarCells = useMemo<CalendarCell[]>(() => {
    const daysInCurrentMonth = days.length
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth)
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear

    const cells: CalendarCell[] = []

    // 1. Días finales del mes anterior
    for (let i = 0; i < startDayOfWeek; i++) {
      const dayNum = daysInPrevMonth - startDayOfWeek + 1 + i
      cells.push({
        day: dayNum,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
        isPrevMonth: true,
        isNextMonth: false,
      })
    }

    // 2. Días del mes actual
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      cells.push({
        day: d,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
        isPrevMonth: false,
        isNextMonth: false,
      })
    }

    // 3. Días iniciales del mes siguiente para completar 42 celdas
    const remaining = 42 - cells.length
    for (let d = 1; d <= remaining; d++) {
      cells.push({
        day: d,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        isPrevMonth: false,
        isNextMonth: true,
      })
    }

    return cells
  }, [currentYear, currentMonth, days.length, startDayOfWeek])

  return (
    <div className="bg-white dark:bg-[#181B22] border border-slate-200 dark:border-[#262D3D] rounded-3xl p-5 sm:p-7 shadow-sm">
      {/* ── Barra Superior Unificada: < Mes Año > ── */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-[#262D3D]/60">
        <button
          type="button"
          onClick={onPrevMonth}
          aria-label="Mes anterior"
          className={`w-10 h-10 rounded-2xl bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#262D3D] text-slate-700 dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#222734] shadow-xs flex items-center justify-center transition-all cursor-pointer ${focusRing}`}
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          <h2
            className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F8FAFC] tracking-tight"
            aria-live="polite"
          >
            {monthName} {currentYear}
          </h2>
          {!yaEnHoy && (
            <button
              type="button"
              onClick={onGoToday}
              className={`text-[11px] font-semibold text-[#7C3AED] dark:text-[#A78BFA] px-2.5 py-0.5 rounded-full bg-[#7C3AED]/10 dark:bg-[#7C3AED]/15 hover:bg-[#7C3AED]/20 dark:hover:bg-[#7C3AED]/25 transition-colors cursor-pointer ${focusRing}`}
            >
              Hoy
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onNextMonth}
          aria-label="Mes siguiente"
          className={`w-10 h-10 rounded-2xl bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#262D3D] text-slate-700 dark:text-[#CBD5E1] hover:bg-slate-50 dark:hover:bg-[#222734] shadow-xs flex items-center justify-center transition-all cursor-pointer ${focusRing}`}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ── Cuerpo Principal: Calendario (Izquierda) + Panel Lateral (Derecha) ── */}
      <div className="flex flex-col lg:flex-row pt-5 gap-6 items-stretch">
        <div className="flex-1 min-w-0 space-y-4">
          {/* ── Encabezado de Días de la Semana (DOM, LUN, MAR, etc.) ── */}
          <div
            aria-hidden="true"
            className="grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wider py-1.5"
          >
        {DIAS_SEMANA.map((d, idx) => {
          const isHighlighted = idx === selectedDayOfWeek
          return (
            <span
              key={d}
              className={
                isHighlighted
                  ? "text-[#7C3AED] dark:text-[#A78BFA] font-bold transition-colors"
                  : "text-slate-400 dark:text-[#64748B] transition-colors"
              }
            >
              {d}
            </span>
          )
        })}
      </div>

      {/* ── Cuadrícula de 42 celdas con estética redondeada e individual ── */}
      <div
        role="group"
        aria-label={`Calendario de ${monthName.toLowerCase()} de ${currentYear}`}
        className="grid grid-cols-7 gap-2 sm:gap-3"
      >
        {calendarCells.map((cell, idx) => {
          const isSelected = cell.isCurrentMonth && selectedDay === cell.day
          const isToday =
            cell.isCurrentMonth &&
            currentYear === TODAY_YEAR &&
            currentMonth === TODAY_MONTH &&
            cell.day === TODAY_DAY

          const dayEvents = cell.isCurrentMonth
            ? eventsByDay[cell.day] || []
            : []
          const sortedEvents = [...dayEvents].sort(compareAgenda)
          const hasPending = sortedEvents.some(esPorConfirmar)

          const handleCellClick = () => {
            if (cell.isCurrentMonth) {
              onSelectDay(cell.day)
            } else if (cell.isPrevMonth) {
              onPrevMonth()
              onSelectDay(cell.day)
            } else if (cell.isNextMonth) {
              onNextMonth()
              onSelectDay(cell.day)
            }
          }

          return (
            <div
              key={`${cell.year}-${cell.month}-${cell.day}-${idx}`}
              onClick={handleCellClick}
              className={`group relative min-h-[66px] sm:min-h-[86px] md:min-h-[96px] p-2 sm:p-2.5 rounded-2xl flex flex-col justify-between transition-all cursor-pointer ${
                isSelected
                  ? "bg-white dark:bg-[#1A1D25] border-2 border-[#7C3AED] shadow-sm ring-2 ring-[#7C3AED]/25"
                  : cell.isCurrentMonth
                    ? isToday
                      ? "bg-white dark:bg-[#111318] border border-[#7C3AED]/70 dark:border-[#A78BFA]/70 shadow-xs hover:border-[#7C3AED] dark:hover:border-[#A78BFA]"
                      : "bg-white dark:bg-[#111318] border border-slate-200/90 dark:border-[#262D3D] shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-slate-300 dark:hover:border-[#3B475E]"
                    : "bg-slate-50/70 dark:bg-[#111318]/40 border border-slate-200/60 dark:border-[#262D3D]/40 text-slate-400 dark:text-[#64748B] opacity-75 hover:opacity-100"
              }`}
            >
              {/* Parte superior de la celda: Número de día + botón rápido */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs sm:text-sm font-semibold select-none ${
                    isSelected
                      ? "text-[#7C3AED] dark:text-[#C4B5FD] font-bold"
                      : cell.isCurrentMonth
                        ? isToday
                          ? "text-[#7C3AED] dark:text-[#A78BFA] font-bold"
                          : "text-slate-800 dark:text-[#F8FAFC]"
                        : "text-slate-400 dark:text-[#64748B]"
                  }`}
                >
                  {cell.day}
                </span>

                <div className="flex items-center gap-1">
                  {hasPending && (
                    <span
                      aria-hidden="true"
                      className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"
                      title="Tiene registros por confirmar"
                    />
                  )}
                  {cell.isCurrentMonth && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onQuickCreate(cell.day)
                      }}
                      title={`Agendar el ${cell.day} de ${monthName}`}
                      aria-label={`Agendar el ${cell.day} de ${monthName}`}
                      className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-[#222734] text-slate-500 dark:text-[#CBD5E1] hover:text-white hover:bg-[#7C3AED] transition-colors cursor-pointer opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100 ${
                        isSelected ? "opacity-100" : ""
                      } ${focusRing}`}
                    >
                      <Plus size={11} />
                    </button>
                  )}
                </div>
              </div>

              {/* Eventos dentro de la celda: Chips en desktop, Puntos en móvil */}
              {sortedEvents.length > 0 && (
                <div className="mt-1 w-full flex-1 flex flex-col justify-end">
                  {/* Vista Desktop (sm y superior): Chips con hora y título */}
                  <div className="hidden sm:block space-y-1 w-full">
                    {sortedEvents.slice(0, 2).map((ev) => {
                      const meta = getEstadoMeta(ev.estado)
                      return (
                        <div
                          key={ev.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            onOpenEvent(ev)
                          }}
                          className="w-full text-left px-1.5 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1 truncate shadow-2xs hover:opacity-90 transition-opacity"
                          style={{
                            backgroundColor: `${meta.color}1A`,
                            color: meta.text,
                            borderLeft: `2px solid ${meta.color}`,
                          }}
                          title={`${ev.time} · ${ev.title} · ${ev.client} (${ev.estado})`}
                        >
                          <span className="tabular-nums opacity-85 shrink-0 text-[9px]">
                            {ev.time}
                          </span>
                          <span className="truncate flex-1 font-semibold">
                            {ev.title}
                          </span>
                        </div>
                      )
                    })}
                    {sortedEvents.length > 2 && (
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-[#94A3B8] pl-1 block leading-none">
                        +{sortedEvents.length - 2} más
                      </span>
                    )}
                  </div>

                  {/* Vista Móvil (< sm): Puntos coloreados */}
                  <div className="flex sm:hidden items-center gap-1 pt-1 flex-wrap">
                    {sortedEvents.slice(0, 3).map((ev) => {
                      const meta = getEstadoMeta(ev.estado)
                      return (
                        <span
                          key={ev.id}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: meta.color }}
                        />
                      )
                    })}
                    {sortedEvents.length > 3 && (
                      <span className="text-[9px] text-slate-400 font-bold leading-none">
                        +{sortedEvents.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Leyenda del Calendario ── */}
      <div className="pt-3 border-t border-slate-200 dark:border-[#262D3D] flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-[#CBD5E1]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="font-semibold text-slate-700 dark:text-[#94A3B8]">
            Estados:
          </span>
          {Object.values(GRUPO_META).map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-[11px]">
              <span
                aria-hidden="true"
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              {label}
            </span>
          ))}
        </div>
        <span className="text-[11px] text-slate-400 dark:text-[#94A3B8]">
          Haz clic en cualquier día para ver sus agendamientos
        </span>
      </div>
    </div>

    {/* ── Panel Lateral Derecho (Agenda / Métricas) con divisor vertical en desktop ── */}
    {sidebarContent && (
      <div className="w-full lg:w-80 xl:w-96 shrink-0 lg:border-l lg:border-slate-200 lg:dark:border-[#262D3D]/60 lg:pl-6 border-t border-slate-200 dark:border-[#262D3D]/60 pt-6 lg:pt-0 space-y-5">
        {sidebarContent}
      </div>
    )}
  </div>
</div>
  )
}
