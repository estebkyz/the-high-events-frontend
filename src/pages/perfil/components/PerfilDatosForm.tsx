import { useState, type SubmitEvent } from "react"
import { FormInput } from "@/components/FormInput"
import { FormActions } from "@/components/form/FormActions"
import { FormSelect } from "@/components/form/FormSelect"
import { TIPO_DOCUMENTO_OPTIONS, type TipoDocumento } from "@/constants/common"
import { MAX_PHONE, MIN_PASSWORD_LENGTH } from "@/utils/validation"
import { perfilToForm, pideClaveActual, validatePerfil } from "../form"
import type { Perfil, PerfilForm } from "../types"
import { PasswordField } from "./PasswordField"

export const SECCION = "bg-surface rounded-xl shadow-card p-4 sm:p-5 space-y-4"

interface PerfilDatosFormProps {
  perfil: Perfil
  saving: boolean
  onSave: (form: PerfilForm) => void
  onError: (mensaje: string) => void
  onCancel: () => void
}

/** Datos personales y contraseña de la cuenta en uso. */
export function PerfilDatosForm({
  perfil,
  saving,
  onSave,
  onError,
  onCancel,
}: PerfilDatosFormProps) {
  const [form, setForm] = useState(() => perfilToForm(perfil))
  const set = (changes: Partial<PerfilForm>) => setForm((f) => ({ ...f, ...changes }))

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const error = validatePerfil(form, perfil)
    if (error) onError(error)
    else onSave(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <section className={SECCION} aria-labelledby="perfil-datos">
        <div>
          <h2 id="perfil-datos" className="text-[14px] font-semibold text-ink">
            Datos personales
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Rol: {perfil.rol}
            {perfil.ultimoAcceso && ` · Último ingreso: ${perfil.ultimoAcceso}`}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3.5">
          <FormSelect
            label="Tipo documento"
            required
            value={form.tipo_documento}
            onChange={(v) => set({ tipo_documento: v as TipoDocumento })}
            options={TIPO_DOCUMENTO_OPTIONS}
          />
          <FormInput
            label="Número de documento"
            required
            maxLength={20}
            value={form.numero_documento}
            onChange={(e) => set({ numero_documento: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormInput
            label="Nombre"
            required
            maxLength={50}
            placeholder="Ej. Carlos Alberto"
            value={form.nombre}
            onChange={(e) => set({ nombre: e.target.value })}
          />
          <FormInput
            label="Apellido"
            required
            maxLength={50}
            placeholder="Ej. Ruiz Montoya"
            value={form.apellido}
            onChange={(e) => set({ apellido: e.target.value })}
          />
          <FormInput
            label="Correo electrónico"
            type="email"
            required
            maxLength={150}
            value={form.correo}
            onChange={(e) => set({ correo: e.target.value })}
          />
          <FormInput
            label="Teléfono"
            type="tel"
            maxLength={MAX_PHONE}
            value={form.telefono}
            onChange={(e) => set({ telefono: e.target.value })}
          />
        </div>
      </section>

      <section className={SECCION} aria-labelledby="perfil-clave">
        <div>
          <h2 id="perfil-clave" className="text-[14px] font-semibold text-ink">
            Contraseña
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Déjala en blanco para conservarla. Al cambiarla se cierran tus sesiones en
            otros equipos.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <PasswordField
            label="Contraseña nueva"
            autoComplete="new-password"
            placeholder={`Mínimo ${MIN_PASSWORD_LENGTH} caracteres, con letras y números`}
            value={form.contrasena_nueva}
            onChange={(v) => set({ contrasena_nueva: v })}
          />
          <PasswordField
            label="Confirmar contraseña nueva"
            autoComplete="new-password"
            value={form.confirmar}
            onChange={(v) => set({ confirmar: v })}
          />
        </div>
        {pideClaveActual(form, perfil) && (
          <PasswordField
            label="Contraseña actual"
            autoComplete="current-password"
            hint="Se pide para cambiar el correo o la contraseña"
            value={form.contrasena_actual}
            onChange={(v) => set({ contrasena_actual: v })}
          />
        )}
      </section>

      <FormActions onCancel={onCancel} saving={saving} submitLabel="Guardar cambios" />
    </form>
  )
}
