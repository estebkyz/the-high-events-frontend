import type { ClienteForm } from "./types"

export const EMPTY_CLIENTE: ClienteForm = {
  tipo_cliente: "Empresa",
  tipo_documento: "NIT",
  numero_documento: "",
  razon_social: "",
  primer_nombre: "",
  segundo_nombre: "",
  primer_apellido: "",
  segundo_apellido: "",
  contacto_nombre: "",
  correo: "",
  telefono: "",
  direccion: "",
  ciudad: "",
  estado: "Activo",
}

/** Devuelve el primer error encontrado, o `null` si el formulario es válido. */
export function validateCliente(form: ClienteForm): string | null {
  if (form.tipo_cliente === "Empresa") {
    if (!form.razon_social?.trim()) return "La razón social de la empresa es obligatoria"
  } else if (!form.primer_nombre?.trim() || !form.primer_apellido?.trim()) {
    return "El nombre y el apellido son obligatorios"
  }
  if (!form.numero_documento.trim()) return "El número de documento es obligatorio"
  if (!form.correo.trim() || !form.telefono.trim()) {
    return "El correo y el teléfono son obligatorios"
  }
  if (!form.direccion.trim()) return "La dirección es obligatoria"
  return null
}
