import { useState, type SubmitEvent } from "react"
import { useToast } from "@/components/Toast"
import { FormActions } from "@/components/form/FormActions"
import { useCrudActions } from "@/hooks/useCrudActions"
import { useRecordModal } from "@/hooks/useRecordModal"
import { EMPLEADO_LABEL } from "@/pages/empleados/constants"
import { EmpleadoFormDrawer } from "@/pages/empleados/drawers/EmpleadoFormDrawer"
import {
  EMPTY_EMPLEADO,
  normalizeEmpleado,
  validateEmpleado,
} from "@/pages/empleados/form"
import type { EmpleadoForm, EmpleadoItem } from "@/pages/empleados/types"
import { getEmpleadoFullName } from "@/pages/empleados/utils"
import { ServicioFormDrawer } from "@/pages/servicios/drawers/ServicioFormDrawer"
import { useCrearServicio } from "@/pages/servicios/useCrearServicio"
import { eventoToPayload } from "../form"
import type { EventoForm, EventoItem } from "../types"
import type { EventoCatalogs } from "../useEventoCatalogs"
import { validateEvento } from "../validation"
import { EventoDatosSection } from "./EventoDatosSection"
import { EventoRecursos } from "./EventoRecursos"

interface EventoFormContentProps {
  /** Solo al editar. */
  eventoId?: string
  initialForm: EventoForm
  /** Para cargar el evento de una cotización aceptada. */
  eventos: EventoItem[]
  catalogs: EventoCatalogs
  submitLabel: string
  saving: boolean
  onSave: (form: EventoForm) => void
  onCancel: () => void
}

/** Formulario del evento y alta rápida de servicios y empleados. */
export function EventoFormContent({
  eventoId,
  initialForm,
  eventos,
  catalogs,
  submitLabel,
  saving,
  onSave,
  onCancel,
}: EventoFormContentProps) {
  const toast = useToast()
  const [form, setForm] = useState(initialForm)
  const onChange = (changes: Partial<EventoForm>) =>
    setForm((current) => ({ ...current, ...changes }))

  const crearServicio = useCrearServicio(
    catalogs.servicios,
    catalogs.categorias,
    (nombre) => setForm((f) => ({ ...f, servicios: [...f.servicios, nombre] })),
  )
  const empleadoActions = useCrudActions(
    catalogs.empleados,
    EMPLEADO_LABEL,
    getEmpleadoFullName,
  )
  const empleadoModal = useRecordModal<EmpleadoItem, EmpleadoForm>(
    catalogs.empleados.items,
    EMPTY_EMPLEADO,
  )

  const openCreateEmpleado = (nombre: string) =>
    empleadoModal.openCreate({ primer_nombre: nombre })

  const handleCreateEmpleado = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const error = validateEmpleado(empleadoModal.editForm)
    if (error) {
      toast.error(error)
      return
    }
    const data = normalizeEmpleado(empleadoModal.editForm)
    if (await empleadoActions.create(data)) empleadoModal.close()
  }

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const error = validateEvento(form)
    if (error) {
      toast.error(error)
      return
    }
    onSave(eventoToPayload(form, catalogs.servicios.items))
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <EventoDatosSection
          form={form}
          onChange={onChange}
          editing={Boolean(eventoId)}
          eventos={eventos}
          cotizaciones={catalogs.cotizaciones.items}
          empleados={catalogs.empleados.items}
          onCreateEmpleado={openCreateEmpleado}
        />
        <EventoRecursos
          eventoId={eventoId}
          form={form}
          onChange={onChange}
          catalogs={catalogs}
          onCreateServicio={crearServicio.open}
          onCreateEmpleado={openCreateEmpleado}
        />
        <FormActions onCancel={onCancel} saving={saving} submitLabel={submitLabel} />
      </form>

      <ServicioFormDrawer {...crearServicio.drawer} />
      <EmpleadoFormDrawer
        isOpen={empleadoModal.mode === "form"}
        isEditing={false}
        saving={empleadoActions.saving}
        form={empleadoModal.editForm}
        setForm={empleadoModal.setEditForm}
        onClose={empleadoModal.close}
        onSubmit={(e) => void handleCreateEmpleado(e)}
      />
    </>
  )
}
