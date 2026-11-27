import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
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
import { MAX_PHONE, MIN_PASSWORD_LENGTH } from "@/utils/validation"
import type { UsuarioForm } from "../types"

interface UsuarioFormDrawerProps extends FormDrawerProps<UsuarioForm> {
  rolOptions: { label: string; value: string }[]
}

export function UsuarioFormDrawer({
  isOpen,
  isEditing,
  saving,
  form,
  setForm,
  onClose,
  onSubmit,
  rolOptions,
}: UsuarioFormDrawerProps) {
  const [showPassword, setShowPassword] = useState(false)
  const set = fieldSetter(setForm)
  const PasswordIcon = showPassword ? EyeOff : Eye

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title={isEditing ? "Editar usuario" : "Crear usuario"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3.5">
          <FormSelect
            label="Tipo documento"
            required
            value={form.tipo_documento}
            onChange={(val) => set({ tipo_documento: val as TipoDocumento })}
            options={TIPO_DOCUMENTO_OPTIONS}
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
            placeholder="Ej. Carlos Alberto"
            value={form.primer_nombre}
            onChange={(e) => set({ primer_nombre: e.target.value })}
            required
          />
          <FormInput
            label="Apellido"
            maxLength={50}
            placeholder="Ej. Ruiz Montoya"
            value={form.primer_apellido}
            onChange={(e) => set({ primer_apellido: e.target.value })}
            required
          />
          <FormInput
            label="Correo electrónico"
            type="email"
            maxLength={150}
            placeholder="usuario@thehighevents.com"
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
            label="Rol de acceso"
            required
            value={form.rol}
            onChange={(val) => set({ rol: val })}
            options={rolOptions}
            placeholder="Selecciona un rol"
          />
          {isEditing && (
            <FormSelect
              label="Estado"
              value={form.estado}
              onChange={(val) => set({ estado: val as EstadoActivo })}
              options={ESTADO_ACTIVO_OPTIONS}
            />
          )}
          <div className="relative">
            <FormInput
              label={isEditing ? "Nueva contraseña (opcional)" : "Contraseña"}
              type={showPassword ? "text" : "password"}
              required={!isEditing}
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete="new-password"
              placeholder={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres, con letras y números`}
              value={form.contrasena}
              onChange={(e) => set({ contrasena: e.target.value })}
              className="!pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="icon-btn !size-7 absolute right-1.5 bottom-1.5 sm:bottom-1"
            >
              <PasswordIcon size={15} aria-hidden="true" />
            </button>
          </div>
        </div>

        <FormActions
          onCancel={onClose}
          saving={saving}
          submitLabel={isEditing ? "Guardar cambios" : "Crear usuario"}
        />
      </form>
    </Drawer>
  )
}
