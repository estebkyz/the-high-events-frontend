import { FormInput } from "@/components/FormInput"
import { FormSelect } from "@/components/form/FormSelect"
import { FormTextarea } from "@/components/form/FormTextarea"
import { ESTADO_EVENTO_OPTIONS, MAX_NOMBRE } from "../constants"
import type { EstadoEvento, EventoSectionProps } from "../types"
import { EventoLugarFields } from "./EventoLugarFields"

export function EventoPropioFields({ form, onChange }: EventoSectionProps) {
  return (
    <div className="space-y-4">
      <FormInput
        label="Nombre del evento"
        required
        maxLength={MAX_NOMBRE}
        placeholder="Ej. Festival Electrónico 360"
        value={form.nombre}
        onChange={(e) => onChange({ nombre: e.target.value })}
      />

      <FormTextarea
        label="Concepto del evento"
        required
        rows={2}
        placeholder="Ej. Show de visuales 360, láseres y música en vivo"
        value={form.concepto_espectaculo}
        onChange={(e) => onChange({ concepto_espectaculo: e.target.value })}
      />

      <EventoLugarFields form={form} onChange={onChange} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormInput
          label="Presupuesto estimado"
          type="number"
          min={0}
          required
          placeholder="0"
          value={form.presupuesto_estimado || ""}
          onChange={(e) => onChange({ presupuesto_estimado: Number(e.target.value) })}
        />
        <FormInput
          label="Aforo estimado"
          type="number"
          min={0}
          placeholder="Ej. 800"
          value={form.aforo_esperado}
          onChange={(e) => onChange({ aforo_esperado: e.target.value })}
        />
        <FormSelect
          label="Estado"
          options={ESTADO_EVENTO_OPTIONS}
          value={form.estado}
          onChange={(val) => onChange({ estado: val as EstadoEvento })}
        />
      </div>

      <FormTextarea
        label="Observaciones"
        maxLength={500}
        placeholder="Notas logísticas o requerimientos técnicos"
        value={form.observaciones}
        onChange={(e) => onChange({ observaciones: e.target.value })}
      />
    </div>
  )
}
