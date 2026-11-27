import { Drawer } from "@/components/Drawer"
import { FormInput } from "@/components/FormInput"
import { FormActions } from "@/components/form/FormActions"

import { FormSelect } from "@/components/form/FormSelect"
import { FormTextarea } from "@/components/form/FormTextarea"
import type { FormDrawerProps } from "@/components/form/types"
import type { EmpleadoItem } from "@/pages/empleados/types"
import { getEmpleadoFullName } from "@/pages/empleados/utils"
import type { EventoItem } from "@/pages/eventos/types"
import { fieldSetter } from "@/utils/form"
import { CRITICIDAD_OPTIONS, TIPO_INCIDENTE_OPTIONS } from "../constants"
import type { Criticidad, IncidenteForm, TipoIncidente } from "../types"

interface IncidenteFormDrawerProps extends FormDrawerProps<IncidenteForm> {
  eventos: EventoItem[]
  empleados: EmpleadoItem[]
}

export function IncidenteFormDrawer({
  isOpen,
  isEditing,
  saving,
  form,
  setForm,
  onClose,
  onSubmit,
  eventos,
  empleados,
}: IncidenteFormDrawerProps) {
  const set = fieldSetter(setForm)

  const handleEvento = (id: string) => {
    const evento = eventos.find((ev) => ev.id === id)
    if (evento) set({ evento: evento.nombre, evento_id: Number(id) })
  }

  const handleEmpleado = (id: string) => {
    const empleado = empleados.find((emp) => emp.id === id)
    if (empleado) {
      set({ reporta: getEmpleadoFullName(empleado), reportado_por_id: Number(id) })
    }
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title={isEditing ? "Editar incidente" : "Crear incidente"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <FormInput
          label="Título"
          required
          placeholder="Ej. Falla en pantalla LED durante prueba"
          value={form.titulo}
          onChange={(e) => set({ titulo: e.target.value })}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormSelect
            label="Evento"
            required
            searchable
            placeholder="Seleccionar evento"
            options={eventos.map((ev) => ({ label: ev.nombre, value: ev.id }))}
            value={String(form.evento_id ?? "")}
            onChange={handleEvento}
          />
          <FormSelect
            label="Empleado que reporta"
            required
            searchable
            placeholder="Seleccionar empleado"
            options={empleados.map((emp) => ({
              label: getEmpleadoFullName(emp),
              value: emp.id,
              sublabel: emp.cargo,
            }))}
            value={String(form.reportado_por_id ?? "")}
            onChange={handleEmpleado}
          />
          <FormSelect
            label="Tipo de incidente"
            value={form.tipo_incidente}
            onChange={(val) => set({ tipo_incidente: val as TipoIncidente })}
            options={TIPO_INCIDENTE_OPTIONS}
          />
          <FormSelect
            label="Criticidad"
            value={form.criticidad}
            onChange={(val) => set({ criticidad: val as Criticidad })}
            options={CRITICIDAD_OPTIONS}
          />
        </div>
        <FormTextarea
          label="Descripción"
          maxLength={2000}
          required
          placeholder="Describe la novedad presentada"
          value={form.descripcion}
          onChange={(e) => set({ descripcion: e.target.value })}
        />
        <FormActions
          onCancel={onClose}
          saving={saving}
          submitLabel={isEditing ? "Guardar cambios" : "Crear incidente"}
        />
      </form>
    </Drawer>
  )
}
