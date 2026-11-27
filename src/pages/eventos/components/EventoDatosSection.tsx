import { useRef } from "react"
import { FormSelect } from "@/components/form/FormSelect"
import { SegmentedControl } from "@/components/SegmentedControl"
import type { CotizacionItem } from "@/pages/cotizaciones/types"
import type { EmpleadoItem } from "@/pages/empleados/types"
import { getEmpleadoFullName } from "@/pages/empleados/utils"
import { MODALIDAD_OPTIONS } from "../constants"
import { cambiarModalidad } from "../form"
import type {
  EventoForm,
  EventoItem,
  EventoSectionProps,
  ModalidadEvento,
} from "../types"
import { EventoClienteFields } from "./EventoClienteFields"
import { EventoPropioFields } from "./EventoPropioFields"
import { MODULE_ACCESS } from "@/constants/access"

interface EventoDatosSectionProps extends EventoSectionProps {
  /** Al editar la modalidad ya no cambia: un evento de cliente no pasa a propio ni al revés. */
  editing: boolean
  eventos: EventoItem[]
  cotizaciones: CotizacionItem[]
  empleados: EmpleadoItem[]
  onCreateEmpleado: (nombre: string) => void
}

export function EventoDatosSection({
  form,
  onChange,
  editing,
  eventos,
  cotizaciones,
  empleados,
  onCreateEmpleado,
}: EventoDatosSectionProps) {
  // Conserva lo digitado en cada modalidad al alternar entre ellas.
  const drafts = useRef<Partial<Record<ModalidadEvento, EventoForm>>>({})

  const handleModalidad = (next: ModalidadEvento) => {
    if (next === form.modalidad) return
    drafts.current[form.modalidad] = form
    const draft = drafts.current[next]
    if (draft) onChange({ ...draft, responsable_id: form.responsable_id })
    else {
      // El personal y los equipos de un evento cargado desde su cotización se quedan con él
      const deOtroEvento = form.id ? { equiposAsignados: [], empleadosAsignados: [] } : {}
      onChange({ ...cambiarModalidad(next), ...deOtroEvento })
    }
  }

  return (
    <section className="bg-surface rounded-xl shadow-card p-4 sm:p-5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-[14px] font-semibold text-ink">Datos generales</h2>
        {editing ? (
          <span className="text-xs text-ink-muted">
            {form.modalidad === "Cliente" ? "Evento para cliente" : "Evento propio"}
          </span>
        ) : (
          <SegmentedControl
            label="Modalidad del evento"
            value={form.modalidad}
            options={MODALIDAD_OPTIONS}
            onChange={(val) => handleModalidad(val as ModalidadEvento)}
          />
        )}
      </div>
      {form.modalidad === "Cliente" ? (
        <EventoClienteFields
          form={form}
          onChange={onChange}
          editing={editing}
          eventos={eventos}
          cotizaciones={cotizaciones}
        />
      ) : (
        <EventoPropioFields form={form} onChange={onChange} />
      )}
      <div className="pt-5 border-t border-line-soft">
        <FormSelect
          label="Responsable del evento"
          required
          searchable
          placeholder="Selecciona un empleado"
          hint="Encargado de los préstamos, recepciones y pagos de este evento"
          options={empleados
            .filter((e) => e.estado === "Activo" || e.id === form.responsable_id)
            .map((e) => ({
              label: getEmpleadoFullName(e),
              value: e.id,
              sublabel: e.cargo,
            }))}
          value={form.responsable_id}
          onChange={(val) => onChange({ responsable_id: val })}
          allowCreate
          createLabel="Crear empleado"
          onCreate={onCreateEmpleado}
          createNeeds={MODULE_ACCESS.empleados.create}
        />
      </div>
    </section>
  )
}
