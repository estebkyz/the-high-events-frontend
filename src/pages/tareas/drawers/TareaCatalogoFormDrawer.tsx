import { Drawer } from "@/components/Drawer"
import { FormInput } from "@/components/FormInput"
import { FormActions } from "@/components/form/FormActions"
import { FormSelect } from "@/components/form/FormSelect"
import { FormTextarea } from "@/components/form/FormTextarea"
import type { FormDrawerProps } from "@/components/form/types"
import { fieldSetter } from "@/utils/form"
import { FASE_OPTIONS } from "../constants"
import type { Fase, TareaCatalogoForm } from "../types"

export function TareaCatalogoFormDrawer({
  isOpen,
  isEditing,
  saving,
  form,
  setForm,
  onClose,
  onSubmit,
}: FormDrawerProps<TareaCatalogoForm>) {
  const set = fieldSetter(setForm)

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title={isEditing ? "Editar tarea" : "Crear tarea"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <FormInput
          label="Nombre de la tarea"
          placeholder="Ej. Montaje de Line Array"
          required
          value={form.nombre_tarea}
          onChange={(e) => set({ nombre_tarea: e.target.value })}
        />
        <FormSelect
          label="Fase sugerida"
          value={form.fase_sugerida}
          onChange={(val) => set({ fase_sugerida: val as Fase })}
          options={FASE_OPTIONS}
          hint="Se preselecciona al asignar la tarea en un evento"
        />
        <FormTextarea
          label="Descripción"
          required
          rows={4}
          placeholder="Protocolo técnico que el empleado debe cumplir"
          value={form.descripcion}
          onChange={(e) => set({ descripcion: e.target.value })}
        />
        <FormActions
          onCancel={onClose}
          saving={saving}
          submitLabel={isEditing ? "Guardar cambios" : "Crear tarea"}
        />
      </form>
    </Drawer>
  )
}
