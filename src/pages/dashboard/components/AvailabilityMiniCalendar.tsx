import React, { useState, useMemo } from "react"
import { MapPin, ArrowUpRight } from "lucide-react"
import { OCTOBER_2026_CALENDAR, type CalendarDayStatus } from "../../../data"
import type { RouteId } from "../types"
import { CAL_YEAR, CAL_MONTH, CAL_MONTH_NAME, STATUS_META } from "../data"
import { pad } from "../utils"

interface AvailabilityMiniCalendarProps {
  onNavigate?: (route: RouteId) => void
  onAgendar: (isoDate: string) => void
}

export const AvailabilityMiniCalendar: React.FC<AvailabilityMiniCalendarProps> =
  ({ onNavigate, onAgendar }) => {
    const today = new Date()
    const todayDay =
      today.getFullYear() === CAL_YEAR && today.getMonth() === CAL_MONTH
        ? today.getDate()
        : null

    const daysInMonth = new Date(CAL_YEAR, CAL_MONTH + 1, 0).getDate()
    // Semana que empieza en lunes
    const leadingEmpty = (new Date(CAL_YEAR, CAL_MONTH, 1).getDay() + 6) % 7

    const getDayConfig = (day: number): CalendarDayStatus | undefined =>
      OCTOBER_2026_CALENDAR.find((d) => d.day === day)

    const freeDay = (day: number): CalendarDayStatus => ({
      day,
      status: "free",
      label: "Fecha libre disponible para agendar evento",
      locacion: "Sin reserva registrada",
    })

    const [selectedDay, setSelectedDay] = useState<CalendarDayStatus>(
      () => getDayConfig(todayDay ?? 1) ?? freeDay(todayDay ?? 1),
    )

    const counts = useMemo(
      () => ({
        booked: OCTOBER_2026_CALENDAR.filter((d) => d.status === "booked")
          .length,
        own_event: OCTOBER_2026_CALENDAR.filter((d) => d.status === "own_event")
          .length,
        technical_visit: OCTOBER_2026_CALENDAR.filter(
          (d) => d.status === "technical_visit",
        ).length,
      }),
      [],
    )

    const meta = STATUS_META[selectedDay.status]
    const isoSelected = `${CAL_YEAR}-${pad(CAL_MONTH + 1)}-${pad(selectedDay.day)}`

    return (
      <div className="bg-[#181B22] border border-[#262D3D] rounded-2xl p-5 flex flex-col justify-between shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] h-full">
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[15px] font-semibold text-[#F8FAFC]">
              Disponibilidad de agenda
            </h2>
            <button
              onClick={() => onNavigate?.("agendamiento")}
              className="text-[12px] text-[#A78BFA] hover:underline flex items-center gap-1 font-medium cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/60"
            >
              Abrir agenda <ArrowUpRight size={13} />
            </button>
          </div>

          <p className="text-[12px] font-medium text-[#CBD5E1] mb-2 capitalize">
            {CAL_MONTH_NAME} {CAL_YEAR}
          </p>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#94A3B8] mb-3">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: leadingEmpty }, (_, i) => (
              <div key={`empty-${i}`} className="h-8" aria-hidden="true" />
            ))}

            {Array.from({ length: daysInMonth }, (_, idx) => idx + 1).map(
              (day) => {
                const info = getDayConfig(day)
                const status = info?.status ?? "free"
                const dayMeta = STATUS_META[status]
                const isSelected = selectedDay.day === day
                const isToday = day === todayDay

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(info ?? freeDay(day))}
                    aria-pressed={isSelected}
                    aria-current={isToday ? "date" : undefined}
                    aria-label={`${day} de ${CAL_MONTH_NAME}: ${dayMeta.label}${
                      isToday ? " (hoy)" : ""
                    }`}
                    title={
                      info?.label || `${day} de ${CAL_MONTH_NAME}: disponible`
                    }
                    className={`relative h-8 rounded-lg border border-transparent text-[12px] flex items-center justify-center transition-colors cursor-pointer tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/70 ${dayMeta.cell} ${
                      isSelected
                        ? "ring-2 ring-[#A78BFA] ring-offset-1 ring-offset-[#181B22]"
                        : ""
                    } ${
                      isToday
                        ? "underline decoration-[#38BDF8] decoration-2 underline-offset-2"
                        : ""
                    }`}
                  >
                    {day}
                    {dayMeta.glyph && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 right-1 text-[7px] leading-none opacity-80"
                      >
                        {dayMeta.glyph}
                      </span>
                    )}
                  </button>
                )
              },
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-3.5 pt-3 border-t border-[#262D3D] text-[11px] text-[#CBD5E1]">
            {(["booked", "own_event", "technical_visit"] as const).map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span
                  className={`w-2.5 h-2.5 rounded-sm ${STATUS_META[s].swatch}`}
                />
                <span aria-hidden="true" className="text-[8px]">
                  {STATUS_META[s].glyph}
                </span>
                {STATUS_META[s].legend} ({counts[s]})
              </span>
            ))}
          </div>
        </div>

        {/* Detalle del día seleccionado */}
        <div
          className="mt-3 p-3 rounded-xl bg-[#111318] border border-[#262D3D]"
          aria-live="polite"
        >
          <div className="flex items-center justify-between text-[11px] text-[#94A3B8] mb-1">
            <span className="font-semibold text-[#F8FAFC]">
              {selectedDay.day} de {CAL_MONTH_NAME} de {CAL_YEAR}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${meta.badge}`}
            >
              {meta.label}
            </span>
          </div>
          <p className="text-[12px] font-medium text-[#F8FAFC] leading-snug">
            {selectedDay.label}
          </p>
          <div className="flex items-center justify-between text-[11px] text-[#94A3B8] mt-1">
            <span className="flex items-center gap-1">
              <MapPin size={11} className="text-[#94A3B8]" />
              {selectedDay.locacion}
            </span>
            {selectedDay.responsable && (
              <span>Resp: {selectedDay.responsable}</span>
            )}
          </div>

          {selectedDay.status === "free" && (
            <button
              type="button"
              onClick={() => onAgendar(isoSelected)}
              className="mt-3 w-full px-3 py-2 rounded-lg text-[12px] font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA]"
            >
              Agendar evento este día
            </button>
          )}
        </div>
      </div>
    )
  }
