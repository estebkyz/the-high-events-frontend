import React, { useState, useMemo, useEffect } from "react"
import { MapPin, ArrowUpRight, Clock, Plus, Info } from "lucide-react"
import type { RouteId, MultiEventCalendarDay, CalendarActivityItem } from "../types"
import { STATUS_META } from "../data"
import { pad } from "../utils"

interface AvailabilityMiniCalendarProps {
  year?: number
  monthIndex?: number
  monthName?: string
  calendarDays?: MultiEventCalendarDay[]
  onNavigate?: (route: RouteId) => void
  onAgendar: (isoDate: string) => void
}

export const AvailabilityMiniCalendar: React.FC<AvailabilityMiniCalendarProps> = ({
  year = 2026,
  monthIndex = 10,
  monthName = "noviembre",
  calendarDays = [],
  onNavigate,
  onAgendar,
}) => {
  const today = new Date()
  const todayDay =
    today.getFullYear() === year && today.getMonth() === monthIndex
      ? today.getDate()
      : null

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  // Semana que empieza en lunes
  const leadingEmpty = (new Date(year, monthIndex, 1).getDay() + 6) % 7

  const getDayActivities = (day: number): CalendarActivityItem[] =>
    calendarDays.find((d) => d.day === day)?.activities ?? []

  const [selectedDayNum, setSelectedDayNum] = useState<number>(() => {
    if (todayDay) return todayDay
    const firstWithEvents = calendarDays[0]?.day
    return firstWithEvents ?? 14
  })

  const [hoveredDayNum, setHoveredDayNum] = useState<number | null>(null)

  useEffect(() => {
    const firstWithMulti =
      calendarDays.find((d) => d.activities.length > 1)?.day ??
      calendarDays[0]?.day ??
      1
    setSelectedDayNum(todayDay ?? firstWithMulti)
  }, [year, monthIndex, calendarDays, todayDay])

  const counts = useMemo(() => {
    let booked = 0
    let own_event = 0
    let technical_visit = 0
    calendarDays.forEach((d) => {
      d.activities.forEach((act) => {
        if (act.type === "booked") booked++
        else if (act.type === "own_event") own_event++
        else if (act.type === "technical_visit") technical_visit++
      })
    })
    return { booked, own_event, technical_visit }
  }, [calendarDays])

  const selectedActivities = getDayActivities(selectedDayNum)
  const isoSelected = `${year}-${pad(monthIndex + 1)}-${pad(selectedDayNum)}`

  return (
    <div className="bg-[#181B22] border border-[#262D3D] rounded-2xl p-5 flex flex-col justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[15px] font-semibold text-[#F8FAFC]">
              Disponibilidad de agenda
            </h2>
            <p className="text-[11px] text-[#94A3B8] capitalize">
              {monthName} {year} 
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate?.("agendamiento")}
            className="text-[12px] text-[#A78BFA] hover:underline flex items-center gap-1 font-medium cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/60"
          >
            Abrir agenda <ArrowUpRight size={13} />
          </button>
        </div>

        {/* Guía clara de símbolos (Punto vs Cuadrado vs Triángulo) */}
        <div className="mb-3 p-2.5 rounded-xl bg-[#111318] border border-[#262D3D] space-y-1.5">
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            {(["booked", "own_event", "technical_visit"] as const).map((s) => (
              <div
                key={s}
                title={STATUS_META[s].description}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#181B22] border border-[#262D3D]/80"
              >
                <span
                  className={`inline-flex items-center justify-center w-4 h-4 rounded text-[10px] font-bold ${STATUS_META[s].badge}`}
                >
                  {STATUS_META[s].glyph}
                </span>
                <div className="min-w-0">
                  <p className="text-[10.5px] font-semibold text-[#F8FAFC] truncate">
                    {STATUS_META[s].legend}
                  </p>
                  <p className="text-[9.5px] text-[#94A3B8]">
                    {counts[s]} en el mes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#94A3B8] mb-2">
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5 relative">
          {Array.from({ length: leadingEmpty }, (_, i) => (
            <div key={`empty-${i}`} className="h-9" aria-hidden="true" />
          ))}

          {Array.from({ length: daysInMonth }, (_, idx) => idx + 1).map(
            (day) => {
              const acts = getDayActivities(day)
              const primaryStatus = acts[0]?.type ?? "free"
              const dayMeta = STATUS_META[primaryStatus]
              const isSelected = selectedDayNum === day
              const isHovered = hoveredDayNum === day
              const isToday = day === todayDay
              const hasMultiple = acts.length > 1

              const uniqueTypes = Array.from(new Set(acts.map((a) => a.type)))

              return (
                <div
                  key={day}
                  className="relative"
                  onMouseEnter={() => setHoveredDayNum(day)}
                  onMouseLeave={() =>
                    setHoveredDayNum((prev) => (prev === day ? null : prev))
                  }
                >
                  <button
                    type="button"
                    onClick={() => setSelectedDayNum(day)}
                    aria-pressed={isSelected}
                    aria-current={isToday ? "date" : undefined}
                    className={`w-full relative h-9 rounded-lg border text-[12px] flex flex-col items-center justify-center transition-all cursor-pointer tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/70 ${dayMeta.cell} ${
                      isSelected
                        ? "ring-2 ring-[#A78BFA] ring-offset-1 ring-offset-[#181B22]"
                        : "border-transparent"
                    } ${
                      isToday
                        ? "underline decoration-[#38BDF8] decoration-2 underline-offset-2"
                        : ""
                    }`}
                  >
                    <span className="leading-none">{day}</span>

                    {/* Indicadores claros de los tipos de actividad en ese día */}
                    {acts.length > 0 && (
                      <span
                        aria-hidden="true"
                        className="flex items-center gap-0.5 mt-0.5 leading-none"
                      >
                        {uniqueTypes.map((t) => (
                          <span
                            key={t}
                            className={`text-[8px] font-bold ${
                              t === "booked"
                                ? "text-[#C4B5FD]"
                                : t === "own_event"
                                  ? "text-[#34D399]"
                                  : "text-[#FBBF24]"
                            }`}
                          >
                            {STATUS_META[t].glyph}
                          </span>
                        ))}
                      </span>
                    )}

                    {/* Contador cuando hay más de 1 evento en la fecha */}
                    {hasMultiple && (
                      <span
                        aria-label={`${acts.length} actividades`}
                        className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-1 rounded-full bg-[#7C3AED] text-white text-[9px] font-bold flex items-center justify-center shadow"
                      >
                        {acts.length}
                      </span>
                    )}
                  </button>

                  {/* Tooltip flotante instantáneo al pasar el mouse (hover) */}
                  {isHovered && (
                    <div
                      role="tooltip"
                      className="absolute z-40 bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 p-2.5 rounded-xl bg-[#0F1117] border border-[#3B455A] shadow-2xl text-left pointer-events-none animate-fade-in"
                    >
                      <div className="flex items-center justify-between border-b border-[#262D3D] pb-1.5 mb-1.5">
                        <span className="text-[11px] font-bold text-[#F8FAFC] capitalize">
                          {day} de {monthName}
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#222734] text-[#CBD5E1]">
                          {acts.length === 0
                            ? "Fecha libre"
                            : `${acts.length} ${acts.length === 1 ? "actividad" : "actividades"}`}
                        </span>
                      </div>
                      {acts.length === 0 ? (
                        <p className="text-[11px] text-[#94A3B8]">
                          Sin reservas. Haz clic para agendar un evento o visita técnica.
                        </p>
                      ) : (
                        <ul className="space-y-1.5">
                          {acts.map((act) => {
                            const m = STATUS_META[act.type]
                            return (
                              <li key={act.id} className="text-[10.5px] space-y-0.5">
                                <div className="flex items-center gap-1">
                                  <span
                                    className={`px-1 py-0.2 rounded text-[9px] font-bold ${m.badge}`}
                                  >
                                    {m.glyph} {m.label}
                                  </span>
                                  <span className="text-[#94A3B8] font-mono text-[10px]">
                                    {act.time}
                                  </span>
                                </div>
                                <p className="text-[#F8FAFC] font-semibold truncate">
                                  {act.title}
                                </p>
                                <p className="text-[#94A3B8] text-[10px] truncate">
                                  📍 {act.locacion}
                                </p>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )
            },
          )}
        </div>
      </div>

      {/* Detalle del día seleccionado con soporte de N eventos por fecha */}
      <div
        className="mt-3 p-3 rounded-xl bg-[#111318] border border-[#262D3D] space-y-2.5"
        aria-live="polite"
      >
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-[#F8FAFC] capitalize">
            {selectedDayNum} de {monthName} de {year}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#222734] text-[#CBD5E1]">
            {selectedActivities.length === 0
              ? "Disponible"
              : `${selectedActivities.length} ${
                  selectedActivities.length === 1 ? "evento/cita" : "eventos/citas"
                }`}
          </span>
        </div>

        {selectedActivities.length === 0 ? (
          <p className="text-[12px] text-[#94A3B8]">
            Fecha libre disponible para agendar eventos o visitas técnicas.
          </p>
        ) : (
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {selectedActivities.map((act) => {
              const m = STATUS_META[act.type]
              return (
                <div
                  key={act.id}
                  className="p-2 rounded-lg bg-[#181B22] border border-[#262D3D] space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${m.badge}`}
                    >
                      {m.glyph} {m.label}
                    </span>
                    <span className="flex items-center gap-1 text-[10.5px] text-[#CBD5E1] font-mono">
                      <Clock size={10} className="text-[#A78BFA]" />
                      {act.time}
                    </span>
                  </div>
                  <p className="text-[12px] font-semibold text-[#F8FAFC] leading-snug">
                    {act.title}
                  </p>
                  <div className="flex items-center justify-between text-[10.5px] text-[#94A3B8]">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin size={10} className="text-[#94A3B8] shrink-0" />
                      {act.locacion}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <button
          type="button"
          onClick={() => onAgendar(isoSelected)}
          className="w-full px-3 py-2 rounded-lg text-[12px] font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition-colors cursor-pointer flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA]"
        >
          <Plus size={14} />
          <span>
            {selectedActivities.length > 0
              ? "Agendar otro evento este día"
              : "Agendar evento este día"}
          </span>
        </button>
      </div>
    </div>
  )
}
