import { Drawer } from "@/components/Drawer"
import { FormInput } from "@/components/FormInput"
import { ToggleChips } from "@/components/ToggleChips"
import { FormActions } from "@/components/form/FormActions"
import { FormSection } from "@/components/form/FormSection"
import { FormSelect } from "@/components/form/FormSelect"
import type { FormDrawerProps } from "@/components/form/types"
import { ESTADO_ACTIVO_OPTIONS, type EstadoActivo } from "@/constants/common"
import { fieldSetter } from "@/utils/form"
import { toggleValue } from "@/utils/list"
import type { ProveedorForm } from "../types"

interface ProveedorFormDrawerProps extends FormDrawerProps<ProveedorForm> {
  servicios: string[]
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
            label="NIT / Documento"
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
            label="Nombres de contacto"
            maxLength={60}
            placeholder="Ej. Roberto Carlos"
            value={form.contacto_primer_nombre}
            onChange={(e) => set({ contacto_primer_nombre: e.target.value })}
            required
          />
          <FormInput
            label="Apellidos de contacto"
            maxLength={60}
            placeholder="Ej. Gómez Vélez"
            value={form.contacto_primer_apellido}
            onChange={(e) => set({ contacto_primer_apellido: e.target.value })}
            required
          />
          <FormInput
            label="Correo electrónico"
            type="email"
            maxLength={100}
            placeholder="contacto@proveedor.com"
            value={form.correo}
            onChange={(e) => set({ correo: e.target.value })}
            required
          />
          <FormInput
            label="Teléfono"
            type="tel"
            maxLength={15}
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

        <FormSection
          title="Servicios que provee"
          hint="Los equipos en alquiler se vinculan desde el módulo de Equipos."
        >
          {servicios.length === 0 ? (
            <p className="text-xs text-[#94A3B8]">
              Crea servicios en el módulo de Servicios para asignarlos.
            </p>
          ) : (
            <ToggleChips
              options={servicios}
              selected={form.servicios}
              onToggle={(s) => set({ servicios: toggleValue(form.servicios, s) })}
            />
          )}
        </FormSection>

        <FormActions
          onCancel={onClose}
          saving={saving}
          submitLabel={isEditing ? "Guardar cambios" : "Crear proveedor"}
        />
      </form>
    </Drawer>
  )
}
