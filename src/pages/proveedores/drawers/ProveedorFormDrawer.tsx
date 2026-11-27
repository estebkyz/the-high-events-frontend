import { Drawer } from "@/components/Drawer"
import { FormInput } from "@/components/FormInput"
import { FormActions } from "@/components/form/FormActions"
import { FormSelect } from "@/components/form/FormSelect"
import type { FormDrawerProps } from "@/components/form/types"
import { ESTADO_ACTIVO_OPTIONS, type EstadoActivo } from "@/constants/common"
import { fieldSetter } from "@/utils/form"
import { ProveedorSuministro } from "../components/ProveedorSuministro"
import type { ProveedorForm } from "../types"
import { MAX_PHONE } from "@/utils/validation"

interface ProveedorFormDrawerProps extends FormDrawerProps<ProveedorForm> {
  servicios: string[]
  loadingServicios: boolean
  onCreateServicio: () => void
}

export function ProveedorFormDrawer({
  isOpen,
  isEditing,
  saving,
  form,
  setForm,
  onClose,
  onSubmit,
  servicios,
  loadingServicios,
  onCreateServicio,
}: ProveedorFormDrawerProps) {
  const set = fieldSetter(setForm)

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title={isEditing ? "Editar proveedor" : "Crear proveedor"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormInput
            label="Documento"
            maxLength={20}
            placeholder="Ej. 900.451.230-1"
            value={form.nit_documento}
            onChange={(e) => set({ nit_documento: e.target.value })}
            required
          />
          <FormInput
            label="Razón social"
            maxLength={100}
            placeholder="Ej. AudioPro Medellín S.A.S."
            value={form.razon_social}
            onChange={(e) => set({ razon_social: e.target.value })}
            required
          />
          <FormInput
            label="Nombre de contacto"
            maxLength={50}
            placeholder="Ej. Roberto Carlos"
            value={form.contacto_primer_nombre}
            onChange={(e) => set({ contacto_primer_nombre: e.target.value })}
            required
          />
          <FormInput
            label="Apellido de contacto"
            maxLength={50}
            placeholder="Ej. Gómez Vélez"
            value={form.contacto_primer_apellido}
            onChange={(e) => set({ contacto_primer_apellido: e.target.value })}
            required
          />
          <FormInput
            label="Correo electrónico"
            type="email"
            maxLength={150}
            placeholder="contacto@proveedor.com"
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
          {isEditing && (
            <FormSelect
              label="Estado"
              value={form.estado}
              onChange={(val) => set({ estado: val as EstadoActivo })}
              options={ESTADO_ACTIVO_OPTIONS}
            />
          )}
        </div>

        <ProveedorSuministro
          form={form}
          onChange={set}
          servicios={servicios}
          loading={loadingServicios}
          onCreateServicio={onCreateServicio}
        />

        <FormActions
          onCancel={onClose}
          saving={saving}
          submitLabel={isEditing ? "Guardar cambios" : "Crear proveedor"}
        />
      </form>
    </Drawer>
  )
}
