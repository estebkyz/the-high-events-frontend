import { todayISO } from "@/utils/format"
import type { AccionForm, IncidenteForm, IncidenteItem } from "./types"

export const EMPTY_INCIDENTE: IncidenteForm = {
  titulo: "",
  evento: "",
  reporta: "",
  tipo_incidente: "otro",
  criticidad: "Media",
  descripcion: "",
}

export const EMPTY_ACCION: AccionForm = {
  accion: "",
  responsable: "",
  estado: "En Atención",
}

export function validateIncidente(form: IncidenteForm): string | null {
  if (!form.titulo.trim()) return "El título del incidente es obligatorio"
  if (!form.evento) return "El evento es obligatorio"
  if (!form.reporta) return "El empleado que reporta es obligatorio"
  if (!form.descripcion.trim()) return "La descripción es obligatoria"
  return null
}

export function nuevoIncidente(form: IncidenteForm): Partial<IncidenteItem> {
  return {
    ...form,
    titulo: form.titulo.trim(),
    descripcion: form.descripcion.trim(),
    fecha: todayISO(),
    estado: "Reportado",
  }
}
