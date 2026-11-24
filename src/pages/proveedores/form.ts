import type { ProveedorForm, ProveedorItem } from "./types"

export const EMPTY_PROVEEDOR: ProveedorForm = {
  nit_documento: "",
  razon_social: "",
  contacto_primer_nombre: "",
  contacto_segundo_nombre: "",
  contacto_primer_apellido: "",
  contacto_segundo_apellido: "",
  telefono: "",
  correo: "",
  servicios: [],
  equipos: [],
  estado: "Activo",
}

export function proveedorToForm(item: ProveedorItem): ProveedorForm {
  return { ...item, servicios: item.servicios ?? [], equipos: item.equipos ?? [] }
}

export function validateProveedor(form: ProveedorForm): string | null {
  if (!form.nit_documento.trim()) return "El NIT o documento es obligatorio"
  if (!form.razon_social.trim()) return "La razón social es obligatoria"
  if (!form.contacto_primer_nombre.trim() || !form.contacto_primer_apellido.trim()) {
    return "El nombre y el apellido del contacto son obligatorios"
  }
  if (!form.correo.trim()) return "El correo electrónico es obligatorio"
  if (form.servicios.length === 0 && form.equipos.length === 0) {
    return "Selecciona al menos un servicio que suministre el proveedor"
  }
  return null
}
