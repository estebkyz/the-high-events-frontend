import { Drawer } from "@/components/Drawer"
import { FormInput } from "@/components/FormInput"
import { FormActions } from "@/components/form/FormActions"
import { FormSection } from "@/components/form/FormSection"
import { FormSelect } from "@/components/form/FormSelect"
import type { FormDrawerProps } from "@/components/form/types"
import { ESTADO_ACTIVO_OPTIONS, type EstadoActivo } from "@/constants/common"
import { fieldSetter } from "@/utils/form"
import { PermissionPicker } from "../components/PermissionPicker"
import type { RolForm } from "../types"

export function RolFormDrawer({
  isOpen,
  isEditing,
  saving,
  form,
  setForm,
  onClose,
  onSubmit,
}: FormDrawerProps<RolForm>) {
  const set = fieldSetter(setForm)

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title={isEditing ? "Editar rol" : "Crear rol"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormInput
            label="Nombre"
            placeholder="Ej. Coordinador de producción"
            value={form.nombre}
            onChange={(e) => set({ nombre: e.target.value })}
            required
          />
          <FormInput
            label="Descripción"
            placeholder="Responsabilidades del perfil"
            value={form.descripcion}
            onChange={(e) => set({ descripcion: e.target.value })}
          />
          {isEditing && (
            <FormSelect
              label="Estado"
              value={form.estado}
              onChange={(val) => set({ estado: val as EstadoActivo })}
              options={ESTADO_ACTIVO_OPTIONS}
            />
          )}
        </div>
        <FormSection title="Permisos y privilegios">
          <PermissionPicker
            permisos={form.permisos}
            onChange={(permisos) => set({ permisos })}
          />
        </FormSection>
        <FormActions
          onCancel={onClose}
          saving={saving}
          submitLabel={isEditing ? "Guardar cambios" : "Crear rol"}
        />
      </form>
    </Drawer>
  )
}
