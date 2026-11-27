import { Drawer } from "@/components/Drawer"
import { FormInput } from "@/components/FormInput"
import { FormActions } from "@/components/form/FormActions"
import { FormSelect } from "@/components/form/FormSelect"
import type { FormDrawerProps } from "@/components/form/types"
import {
  ESTADO_ACTIVO_OPTIONS,
  TIPO_DOCUMENTO_OPTIONS,
  type EstadoActivo,
  type TipoDocumento,
} from "@/constants/common"
import { fieldSetter } from "@/utils/form"
import { CARGOS_SUGERIDOS, VINCULACION_OPTIONS } from "../constants"
import type { EmpleadoForm, VinculacionEmpleado } from "../types"
import { MAX_PHONE } from "@/utils/validation"
import { toOptions } from "@/utils/list"

const MAX_CARGO = 45

export function EmpleadoFormDrawer({
  isOpen,
  isEditing,
  saving,
  form,
  setForm,
  onClose,
  onSubmit,
}: FormDrawerProps<EmpleadoForm>) {
  const set = fieldSetter(setForm)

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title={isEditing ? "Editar empleado" : "Crear empleado"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3.5">
          <FormSelect
            label="Tipo documento"
            required
            options={TIPO_DOCUMENTO_OPTIONS}
            value={form.tipo_documento}
            onChange={(val) => set({ tipo_documento: val as TipoDocumento })}
          />
          <FormInput
            label="Número de documento"
            maxLength={20}
            placeholder="Ej. 1000100527"
            value={form.numero_documento}
            onChange={(e) => set({ numero_documento: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormInput
            label="Nombre"
            maxLength={50}
            placeholder="Ej. Andrés Felipe"
            value={form.primer_nombre}
            onChange={(e) => set({ primer_nombre: e.target.value })}
            required
          />
          <FormInput
            label="Apellido"
            maxLength={50}
            placeholder="Ej. Restrepo Gómez"
            value={form.primer_apellido}
            onChange={(e) => set({ primer_apellido: e.target.value })}
            required
          />
          <FormInput
            label="Correo electrónico"
            type="email"
            maxLength={150}
            placeholder="empleado@thehighevents.com"
            value={form.correo}
            onChange={(e) => set({ correo: e.target.value })}
            required
          />
          <FormInput
            label="Teléfono"
            type="tel"
            maxLength={MAX_PHONE}
            placeholder="Ej. 3105381442"
            value={form.telefono}
            onChange={(e) => set({ telefono: e.target.value })}
            required
          />
          <FormSelect
            label="Cargo"
            required
            searchable
            placeholder="Selecciona o escribe un cargo"
            options={toOptions([
              ...new Set([...CARGOS_SUGERIDOS, form.cargo].filter(Boolean)),
            ])}
            value={form.cargo}
            onChange={(val) => set({ cargo: val })}
            allowCreate
            createLabel="Usar cargo"
            onCreate={(val) => set({ cargo: val.slice(0, MAX_CARGO) })}
          />
          <FormSelect
            label="Tipo de vinculación"
            required
            options={VINCULACION_OPTIONS}
            value={form.vinculacion ?? "Fijo"}
            onChange={(val) => set({ vinculacion: val as VinculacionEmpleado })}
          />
          {isEditing && (
            <FormSelect
              label="Estado"
              options={ESTADO_ACTIVO_OPTIONS}
              value={form.estado}
              onChange={(val) => set({ estado: val as EstadoActivo })}
            />
          )}
        </div>

        <FormActions
          onCancel={onClose}
          saving={saving}
          submitLabel={isEditing ? "Guardar cambios" : "Crear empleado"}
        />
      </form>
    </Drawer>
  )
}
