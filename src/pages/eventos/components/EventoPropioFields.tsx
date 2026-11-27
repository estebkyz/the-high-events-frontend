import { FormInput } from "@/components/FormInput"
import { FormMoneyInput } from "@/components/form/FormMoneyInput"
import { FormSelect } from "@/components/form/FormSelect"
import { FormTextarea } from "@/components/form/FormTextarea"
import { ESTADO_EVENTO_OPTIONS, MAX_NOMBRE } from "../constants"
import type { EstadoEvento, EventoSectionProps } from "../types"
import { EventoLugarFields } from "./EventoLugarFields"

/** Datos del evento, iguales para eventos de cliente y propios. */
export function EventoPropioFields({ form, onChange }: EventoSectionProps) {
  const esCliente = form.modalidad === "Cliente"
  return (
    <div className="space-y-4">
      <FormInput
        label="Nombre del evento"
        required
        maxLength={MAX_NOMBRE}
        placeholder={
          esCliente ? "Ej. Grado Colegio Horizonte" : "Ej. Festival Electrónico 360"
        }
        value={form.nombre}
        onChange={(e) => onChange({ nombre: e.target.value })}
      />

      <FormTextarea
        label="Concepto del evento"
        required={!esCliente}
        rows={2}
        maxLength={255}
        placeholder="Ej. Show de visuales 360, láseres y música en vivo"
        value={form.concepto_evento}
        onChange={(e) => onChange({ concepto_evento: e.target.value })}
      />

      <EventoLugarFields form={form} onChange={onChange} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormMoneyInput
          label={esCliente ? "Valor del evento" : "Ventas esperadas"}
          hint={
            esCliente
              ? "Total de la cotización aceptada. Para cambiarlo, devuelve la cotización a borrador, ajusta sus precios y acéptala de nuevo"
              : "Lo que se espera vender (boletería, patrocinios)"
          }
          readOnly={esCliente}
          value={form.valor_total || undefined}
          onChange={(val) => onChange({ valor_total: val })}
        />
        <FormMoneyInput
          label="Presupuesto de gastos"
          hint="Lo que la empresa espera gastar"
          value={form.presupuesto_estimado || undefined}
          onChange={(val) => onChange({ presupuesto_estimado: val ?? 0 })}
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
        maxLength={2000}
        placeholder="Notas logísticas o requerimientos técnicos"
        value={form.observaciones}
        onChange={(e) => onChange({ observaciones: e.target.value })}
      />
    </div>
  )
}
