import type { TipoDocumento } from "@/constants/common"

/** Mismos formatos que exige la API: el aviso sale antes de enviar. */
const EMAIL =
  /^[^\s@<>()",;:\\[\]]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/i
const PHONE = /^\+?[\d\s().-]+(?:\s*(?:ext|x)\.?\s*\d{1,6})?$/i
const DOCUMENT: Record<TipoDocumento, RegExp> = {
  CC: /^\d{5,10}$/,
  CE: /^[a-z0-9]{4,15}$/i,
  NIT: /^\d{6,10}(?:-?\d)?$/,
  PASAPORTE: /^[a-z0-9]{5,15}$/i,
}

export const MIN_PASSWORD_LENGTH = 8
export const MAX_PHONE = 20
const MAX_NAME = 50
const MAX_PASSWORD_BYTES = 72

export function isEmail(value: string): boolean {
  return value.length <= 150 && EMAIL.test(value) && !value.includes("..")
}

export function isPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "").length
  return value.length <= MAX_PHONE && digits >= 7 && digits <= 15 && PHONE.test(value)
}

export function isDocument(type: TipoDocumento, value: string): boolean {
  return DOCUMENT[type].test(value.replace(/[.\s]/g, ""))
}

interface Contact {
  correo?: string
  telefono?: string
  numero_documento?: string
  tipo_documento?: TipoDocumento
}

/** Revisa el formato de los datos de contacto presentes. */
export function validateContact({
  correo = "",
  telefono = "",
  numero_documento = "",
  tipo_documento = "CC",
}: Contact): string | null {
  if (numero_documento && !isDocument(tipo_documento, numero_documento.trim())) {
    return `El número de documento no es válido para ${tipo_documento}`
  }
  if (correo && !isEmail(correo.trim())) return "El correo electrónico no es válido"
  if (telefono && !isPhone(telefono.trim())) {
    return "El teléfono debe tener entre 7 y 15 dígitos"
  }
  return null
}

/** La base guarda juntos los nombres y juntos los apellidos. */
export function validateNames(form: {
  primer_nombre?: string
  segundo_nombre?: string
  primer_apellido?: string
  segundo_apellido?: string
}): string | null {
  const length = (...parts: (string | undefined)[]) => parts.join(" ").trim().length
  if (length(form.primer_nombre, form.segundo_nombre) > MAX_NAME) {
    return `El nombre admite máximo ${MAX_NAME} caracteres`
  }
  return length(form.primer_apellido, form.segundo_apellido) > MAX_NAME
    ? `El apellido admite máximo ${MAX_NAME} caracteres`
    : null
}

export function validatePassword(value: string): string | null {
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`
  }
  if (!/\p{L}/u.test(value) || !/\d/.test(value)) {
    return "La contraseña debe combinar letras y números"
  }
  return new TextEncoder().encode(value).length > MAX_PASSWORD_BYTES
    ? "La contraseña es demasiado larga"
    : null
}
