import { FormInput } from "@/components/FormInput"
import {
  durationMinutes,
  formatDuration,
  joinDateTime,
  moveEndTime,
  moveStart,
  splitDateTime,
} from "../schedule"
import type { EventoSectionProps } from "../types"

/** Ubicación y horario: comunes a las dos modalidades. */
export function EventoLugarFields({ form, onChange }: EventoSectionProps) {
  const [startDate, startTime] = splitDateTime(form.hora_inicio)
  const [endDate, endTime] = splitDateTime(form.hora_fin)
  const minutes = durationMinutes(form)
  const isInvalidRange = minutes !== null && minutes <= 0

  return (
    <>
      <FormInput
        label="Ubicación"
        required
        maxLength={150}
        placeholder="Ej. Discoteca 360 Club, Medellín"
        value={form.direccion}
        onChange={(e) => onChange({ direccion: e.target.value })}
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <FormInput
          label="Fecha de inicio"
          type="date"
          required
          value={startDate}
          onChange={(e) => onChange(moveStart(form, e.target.value, startTime))}
        />
        <FormInput
          label="Hora de inicio"
          type="time"
          required
          value={startTime}
          onChange={(e) => onChange(moveStart(form, startDate, e.target.value))}
        />
        <FormInput
          label="Fecha de fin"
          type="date"
          required
          min={startDate}
          value={endDate}
          onChange={(e) => onChange({ hora_fin: joinDateTime(e.target.value, endTime) })}
        />
        <FormInput
          label="Hora de fin"
          type="time"
          required
          value={endTime}
          onChange={(e) => onChange({ hora_fin: moveEndTime(form, e.target.value) })}
          error={isInvalidRange ? "El fin debe ser posterior al inicio" : undefined}
          hint={
            minutes !== null && !isInvalidRange
              ? `Duración: ${formatDuration(minutes)}`
              : undefined
          }
        />
      </div>
    </>
  )
}
