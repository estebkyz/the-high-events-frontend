import { CARGOS } from "./constants"
import type { EmpleadoForm } from "./types"

export const EMPTY_EMPLEADO: EmpleadoForm = {
  tipo_documento: "CC",
  numero_documento: "",
  primer_nombre: "",
  segundo_nombre: "",
  primer_apellido: "",
  segundo_apellido: "",
  cargo: CARGOS[0],
  telefono: "",
  correo: "",
  vinculacion: "Fijo",
  estado: "Activo",
}

export function validateEmpleado(form: EmpleadoForm): string | null {
  if (!form.primer_nombre.trim() || !form.primer_apellido.trim()) {
    return "El nombre y el apellido son obligatorios"
  }
  if (!form.numero_documento.trim()) return "El número de documento es obligatorio"
  if (!form.correo.trim()) return "El correo electrónico es obligatorio"
  return null
}

export function normalizeEmpleado(form: EmpleadoForm): EmpleadoForm {
  return {
    ...form,
    numero_documento: form.numero_documento.trim(),
    primer_nombre: form.primer_nombre.trim(),
    primer_apellido: form.primer_apellido.trim(),
    telefono: form.telefono.trim(),
    correo: form.correo.trim(),
  }
}
