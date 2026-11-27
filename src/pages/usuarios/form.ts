import type { UsuarioForm, UsuarioItem } from "./types"
import { validateContact, validateNames, validatePassword } from "@/utils/validation"

export const EMPTY_USUARIO: UsuarioForm = {
  tipo_documento: "CC",
  numero_documento: "",
  primer_nombre: "",
  segundo_nombre: "",
  primer_apellido: "",
  segundo_apellido: "",
  correo: "",
  telefono: "",
  rol: "",
  contrasena: "",
  estado: "Activo",
}

export function usuarioToForm(item: UsuarioItem): UsuarioForm {
  return { ...item, contrasena: "" }
}

/** Omite la contraseña vacía para no sobrescribir la existente. */
export function usuarioToPayload(form: UsuarioForm): Omit<UsuarioForm, "contrasena"> & {
  contrasena?: string
} {
  const { contrasena, ...data } = form
  return contrasena ? { ...data, contrasena } : data
}

export function validateUsuario(form: UsuarioForm, isEditing: boolean): string | null {
  if (!form.primer_nombre.trim() || !form.primer_apellido.trim()) {
    return "El nombre y el apellido son obligatorios"
  }
  if (!form.numero_documento.trim()) return "El número de documento es obligatorio"
  if (!form.correo.trim()) return "El correo electrónico es obligatorio"
  if (!form.rol) return "El rol de acceso es obligatorio"
  const requiresPassword = !isEditing || form.contrasena.length > 0
  const password = requiresPassword ? validatePassword(form.contrasena) : null
  return password ?? validateNames(form) ?? validateContact(form)
}
