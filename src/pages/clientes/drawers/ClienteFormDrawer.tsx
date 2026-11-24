import { Drawer } from "@/components/Drawer"
import { FormInput } from "@/components/FormInput"
import { FormActions } from "@/components/form/FormActions"
import { FormSelect } from "@/components/form/FormSelect"
import type { FormDrawerProps } from "@/components/form/types"
import {
  ESTADO_ACTIVO_OPTIONS,
  type EstadoActivo,
  type TipoDocumento,
} from "@/constants/common"
import { fieldSetter } from "@/utils/form"
import {
  TIPO_CLIENTE_OPTIONS,
  TIPO_DOC_EMPRESA_OPTIONS,
  TIPO_DOC_NATURAL_OPTIONS,
} from "../constants"
import type { ClienteForm } from "../types"

export function ClienteFormDrawer({
  isOpen,
  isEditing,
  saving,
  form,
  setForm,
  onClose,
  onSubmit,
}: FormDrawerProps<ClienteForm>) {
  const set = fieldSetter(setForm)
  const isEmpresa = form.tipo_cliente === "Empresa"

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title={isEditing ? "Editar cliente" : "Crear cliente"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1.15fr_135px_1.35fr] gap-3.5">
          <FormSelect
            label="Tipo de cliente"
            required
            value={form.tipo_cliente}
            onChange={(val) =>
              set(
                val === "Empresa"
                  ? { tipo_cliente: "Empresa", tipo_documento: "NIT" }
                  : { tipo_cliente: "Natural", tipo_documento: "CC" },
              )
            }
            options={TIPO_CLIENTE_OPTIONS}
          />
          <FormSelect
            label="Tipo documento"
            required
            value={form.tipo_documento}
            onChange={(val) => set({ tipo_documento: val as TipoDocumento })}
            options={isEmpresa ? TIPO_DOC_EMPRESA_OPTIONS : TIPO_DOC_NATURAL_OPTIONS}
          />
          <FormInput
            label="Número de documento"
            value={form.numero_documento}
            onChange={(e) => set({ numero_documento: e.target.value })}
            required
          />
        </div>

        {isEmpresa ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormInput
              label="Razón social"
              value={form.razon_social ?? ""}
              onChange={(e) => set({ razon_social: e.target.value })}
              required
            />
            <FormInput
              label="Nombre de contacto"
              value={form.contacto_nombre ?? ""}
              onChange={(e) => set({ contacto_nombre: e.target.value })}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormInput
              label="Nombre"
              maxLength={60}
              value={form.primer_nombre ?? ""}
              onChange={(e) => set({ primer_nombre: e.target.value })}
              required
            />
            <FormInput
              label="Apellido"
              maxLength={60}
              value={form.primer_apellido ?? ""}
              onChange={(e) => set({ primer_apellido: e.target.value })}
              required
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormInput
            label="Correo electrónico"
            type="email"
            value={form.correo}
            onChange={(e) => set({ correo: e.target.value })}
            required
          />
          <FormInput
            label="Teléfono"
            type="tel"
            value={form.telefono}
            onChange={(e) => set({ telefono: e.target.value })}
            required
          />
          <FormInput
            label="Dirección"
            required
            value={form.direccion}
            onChange={(e) => set({ direccion: e.target.value })}
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

        <FormActions
          onCancel={onClose}
          saving={saving}
          submitLabel={isEditing ? "Guardar cambios" : "Crear cliente"}
        />
      </form>
    </Drawer>
  )
}
