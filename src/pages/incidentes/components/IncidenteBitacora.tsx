import { useState, type SubmitEvent } from "react"
import { Button } from "@/components/Button"
import { StatusBadge } from "@/components/StatusBadge"
import { FormInput } from "@/components/FormInput"
import { DetailEmptyNote, DetailList, DetailSection } from "@/components/detail"
import { FormSelect } from "@/components/form/FormSelect"
import { FormTextarea } from "@/components/form/FormTextarea"
import { fieldSetter } from "@/utils/form"
import { parseBitacora } from "../bitacora"
import { ESTADO_INCIDENTE_OPTIONS } from "../constants"
import { EMPTY_ACCION } from "../form"
import type { AccionForm, EstadoIncidente, IncidenteItem } from "../types"

interface IncidenteBitacoraProps {
  incidente: IncidenteItem
  saving: boolean
  /** Resuelve `true` si la acción quedó guardada. */
  onAddAccion: (incidente: IncidenteItem, form: AccionForm) => Promise<unknown>
}

/** Historial de acciones y formulario para registrar una nueva. */
export function IncidenteBitacora({
  incidente,
  saving,
  onAddAccion,
}: IncidenteBitacoraProps) {
  const [form, setForm] = useState<AccionForm>(EMPTY_ACCION)
  const set = fieldSetter(setForm)
  const acciones = parseBitacora(incidente.acciones_tomadas)

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (await onAddAccion(incidente, form)) setForm(EMPTY_ACCION)
  }

  return (
    <>
      <DetailSection title="Historial de acciones" count={acciones.length}>
        {acciones.length === 0 ? (
          <DetailEmptyNote text="Sin acciones registradas." />
        ) : (
          <DetailList>
            {acciones.map((accion, index) => (
              <div key={`${accion.fecha}-${index}`} className="py-2.5 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium text-ink">{accion.accion}</p>
                  <StatusBadge status={accion.estado} />
                </div>
                <p className="text-xs text-ink-muted">
                  {[accion.responsable, accion.fecha].filter(Boolean).join(" · ")}
                </p>
              </div>
            ))}
          </DetailList>
        )}
      </DetailSection>

      <DetailSection title="Registrar acción">
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
          <FormTextarea
            label="Acción tomada"
            maxLength={2000}
            required
            rows={2}
            value={form.accion}
            onChange={(e) => set({ accion: e.target.value })}
          />
          <FormInput
            label="Responsable"
            required
            value={form.responsable}
            onChange={(e) => set({ responsable: e.target.value })}
          />
          <FormSelect
            label="Nuevo estado"
            value={form.estado}
            onChange={(val) => set({ estado: val as EstadoIncidente })}
            options={ESTADO_INCIDENTE_OPTIONS}
          />
          <Button variant="primary" type="submit" className="w-full" disabled={saving}>
            Agregar acción
          </Button>
        </form>
      </DetailSection>
    </>
  )
}
