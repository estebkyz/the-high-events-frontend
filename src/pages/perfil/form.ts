import { validateContact, validatePassword } from "@/utils/validation"
import type { Perfil, PerfilForm } from "./types"

export function perfilToForm(p: Perfil): PerfilForm {
  return {
    tipo_documento: p.tipo_documento,
    numero_documento: p.numero_documento,
    nombre: p.nombre,
    apellido: p.apellido,
    correo: p.correo,
    telefono: p.telefono,
    contrasena_actual: "",
    contrasena_nueva: "",
    confirmar: "",
  }
}

const cambiaCorreo = (form: PerfilForm, perfil: Perfil) =>
  form.correo.trim().toLowerCase() !== perfil.correo.toLowerCase()

/** Pide la contraseña actual solo si cambian el correo o la contraseña. */
export const pideClaveActual = (form: PerfilForm, perfil: Perfil) =>
  Boolean(form.contrasena_nueva) || cambiaCorreo(form, perfil)

export function validatePerfil(form: PerfilForm, perfil: Perfil): string | null {
  if (!form.nombre.trim() || !form.apellido.trim())
    return "El nombre y el apellido son obligatorios"
  if (!form.numero_documento.trim()) return "El número de documento es obligatorio"
  if (!form.correo.trim()) return "El correo electrónico es obligatorio"
  const contacto = validateContact({
    correo: form.correo,
    telefono: form.telefono,
    numero_documento: form.numero_documento,
    tipo_documento: form.tipo_documento,
  })
  if (contacto) return contacto
  if (form.contrasena_nueva) {
    const clave = validatePassword(form.contrasena_nueva)
    if (clave) return clave
    if (form.contrasena_nueva !== form.confirmar)
      return "La confirmación no coincide con la contraseña nueva"
  }
  if (pideClaveActual(form, perfil) && !form.contrasena_actual)
    return "Escribe tu contraseña actual para cambiar el correo o la contraseña"
  return null
}

/** Solo viaja lo que la API usa; la contraseña actual, solo si hace falta. */
export function perfilToPayload(form: PerfilForm, perfil: Perfil) {
  return {
    tipo_documento: form.tipo_documento,
    numero_documento: form.numero_documento.trim(),
    nombre: form.nombre.trim(),
    apellido: form.apellido.trim(),
    correo: form.correo.trim(),
    telefono: form.telefono.trim(),
    ...(pideClaveActual(form, perfil) && { contrasena_actual: form.contrasena_actual }),
    ...(form.contrasena_nueva && { contrasena_nueva: form.contrasena_nueva }),
  }
}
