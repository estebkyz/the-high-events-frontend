import type { ProveedorToEquipoState } from "@/routes/navigationState"
import type { ProveedorForm, ProveedorItem } from "./types"
import { isDocument, validateContact } from "@/utils/validation"

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
  registrar_equipo: false,
}

export function proveedorToForm(item: ProveedorItem): ProveedorForm {
  return {
    ...item,
    servicios: item.servicios ?? [],
    equipos: item.equipos ?? [],
    registrar_equipo: false,
  }
}

export function validateProveedor(form: ProveedorForm): string | null {
  if (!form.nit_documento.trim()) return "El NIT o documento es obligatorio"
  if (!form.razon_social.trim()) return "La razón social es obligatoria"
  if (!form.contacto_primer_nombre.trim() || !form.contacto_primer_apellido.trim()) {
    return "El nombre y el apellido del contacto son obligatorios"
  }
  if (!form.correo.trim()) return "El correo electrónico es obligatorio"
  if (!form.telefono.trim()) return "El teléfono es obligatorio"
  // Un proveedor puede ser empresa (NIT) o persona (cédula).
  const nit = form.nit_documento.trim()
  if (!isDocument("NIT", nit) && !isDocument("CC", nit) && !isDocument("CE", nit)) {
    return "El NIT o documento no es válido"
  }
  const contact = validateContact({ correo: form.correo, telefono: form.telefono })
  if (contact) return contact
  const suministra =
    form.servicios.length > 0 || form.equipos.length > 0 || form.registrar_equipo
  return suministra
    ? null
    : "Elige al menos un servicio o marca que el proveedor alquila equipos"
}

export function proveedorToPayload(
  form: ProveedorForm,
): Omit<ProveedorForm, "registrar_equipo"> {
  const data: Omit<ProveedorForm, "registrar_equipo"> &
    Pick<Partial<ProveedorForm>, "registrar_equipo"> = { ...form }
  delete data.registrar_equipo
  return data
}

export function proveedorToEquipo({
  id,
  razon_social,
}: ProveedorItem): ProveedorToEquipoState {
  return { fromProveedor: true, proveedorId: id, proveedorNombre: razon_social }
}
