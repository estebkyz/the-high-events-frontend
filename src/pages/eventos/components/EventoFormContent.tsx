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
import { SERVICIO_LABEL } from "@/pages/servicios/constants"
import { ServicioFormDrawer } from "@/pages/servicios/drawers/ServicioFormDrawer"
import {
  EMPTY_SERVICIO,
  normalizeServicio,
  validateServicio,
} from "@/pages/servicios/form"
import type { ServicioForm, ServicioItem } from "@/pages/servicios/types"
import { eventoToPayload } from "../form"
import type { EventoForm } from "../types"
import type { EventoCatalogs } from "../useEventoCatalogs"
import { validateEvento } from "../validation"
import { EventoDatosSection } from "./EventoDatosSection"
import { EventoRecursos } from "./EventoRecursos"

interface EventoFormContentProps {
  initialForm: EventoForm
  catalogs: EventoCatalogs
  submitLabel: string
  saving: boolean
  onSave: (form: EventoForm) => void
  onCancel: () => void
  onCreateCotizacion: () => void
}

/** Formulario del evento y alta rápida de servicios y empleados. */
export function EventoFormContent({
  initialForm,
  catalogs,
  submitLabel,
  saving,
  onSave,
  onCancel,
  onCreateCotizacion,
}: EventoFormContentProps) {
  const toast = useToast()
  const [form, setForm] = useState(initialForm)
  const onChange = (changes: Partial<EventoForm>) =>
    setForm((current) => ({ ...current, ...changes }))

  const servicioActions = useCrudActions(
    catalogs.servicios,
    SERVICIO_LABEL,
    (s) => s.nombre,
  )
  const servicioModal = useRecordModal<ServicioItem, ServicioForm>(
    catalogs.servicios.items,
    EMPTY_SERVICIO,
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

  const handleCreateServicio = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const error = validateServicio(servicioModal.editForm)
    if (error) {
      toast.error(error)
      return
    }
    const data = normalizeServicio(servicioModal.editForm)
    if (!(await servicioActions.create(data))) return
    setForm((f) => ({ ...f, servicios: [...f.servicios, data.nombre] }))
    servicioModal.close()
  }

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
      <form onSubmit={handleSubmit} className="space-y-6">
        <EventoDatosSection
          form={form}
          onChange={onChange}
          clientes={catalogs.clientes.items}
          cotizaciones={catalogs.cotizaciones.items}
          onCreateCotizacion={onCreateCotizacion}
        />
        <EventoRecursos
          form={form}
          onChange={onChange}
          catalogs={catalogs}
          onCreateServicio={(nombre) =>
            servicioModal.openCreate({
              nombre,
              categoria: catalogs.categorias.names[0] ?? "",
            })
          }
          onCreateEmpleado={(nombre) =>
            empleadoModal.openCreate({ primer_nombre: nombre })
          }
        />
        <FormActions onCancel={onCancel} saving={saving} submitLabel={submitLabel} />
      </form>

      <ServicioFormDrawer
        isOpen={servicioModal.mode === "form"}
        isEditing={false}
        saving={servicioActions.saving}
        form={servicioModal.editForm}
        setForm={servicioModal.setEditForm}
        onClose={servicioModal.close}
        onSubmit={(e) => void handleCreateServicio(e)}
        categorias={catalogs.categorias.names}
        onCreateCategoria={catalogs.categorias.quickCreate}
      />
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
