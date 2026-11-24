import type { Dispatch, SetStateAction, SubmitEvent } from "react"
import { Drawer } from "@/components/Drawer"
import { FormActions } from "@/components/form/FormActions"
import { FormSection } from "@/components/form/FormSection"
import { FormSelect } from "@/components/form/FormSelect"
import { FormTextarea } from "@/components/form/FormTextarea"
import type { EmpleadoItem } from "@/pages/empleados/types"
import { getEmpleadoFullName } from "@/pages/empleados/utils"
import { ESTADO_ITEM_OPTIONS } from "../constants"
import { seleccionarResponsable } from "../form"
import type { DevolucionForm, EstadoItemRecepcion, Recepcion } from "../types"

interface RecepcionDevolucionDrawerProps {
  isOpen: boolean
  origen: Recepcion | null
  empleados: EmpleadoItem[]
  saving: boolean
  form: DevolucionForm
  setForm: Dispatch<SetStateAction<DevolucionForm>>
  onClose: () => void
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void
}

export function RecepcionDevolucionDrawer({
  isOpen,
  origen,
  empleados,
  saving,
  form,
  setForm,
  onClose,
  onSubmit,
}: RecepcionDevolucionDrawerProps) {
  if (!origen) return null

  const setEstado = (index: number, estado: EstadoItemRecepcion) =>
    setForm((f) => ({
      ...f,
      items: f.items.map((it, i) => (i === index ? { ...it, estado } : it)),
    }))

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title="Registrar devolución"
      subtitle={`${origen.codigo} · ${origen.evento} · ${origen.proveedor}`}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <FormSelect
          label="Empleado responsable"
          required
          searchable
          value={form.responsable}
          onChange={(val) =>
            setForm((f) => ({ ...f, ...seleccionarResponsable(val, empleados) }))
          }
          options={empleados.map((e) => ({
            label: getEmpleadoFullName(e),
            value: getEmpleadoFullName(e),
            sublabel: e.cargo,
          }))}
        />
        <FormSection title="Estado de los equipos al devolver">
          <div className="space-y-3">
            {form.items.map((item, index) => (
              <FormSelect
                key={`${item.nombre}-${index}`}
                label={`${item.nombre} (×${item.cantidad})`}
                value={item.estado}
                onChange={(val) => setEstado(index, val as EstadoItemRecepcion)}
                options={ESTADO_ITEM_OPTIONS}
              />
            ))}
          </div>
        </FormSection>
        <FormTextarea
          label="Observaciones"
          placeholder="Novedades al momento de la devolución"
          value={form.observaciones}
          onChange={(e) => setForm((f) => ({ ...f, observaciones: e.target.value }))}
        />
        <FormActions
          onCancel={onClose}
          saving={saving}
          submitLabel="Registrar devolución"
        />
      </form>
    </Drawer>
  )
}
