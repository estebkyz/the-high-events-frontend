import type { TareaCatalogoForm, TareaCatalogoItem, TareaForm, TareaItem } from "./types"

export const EMPTY_TAREA: TareaForm = {
  tarea: "",
  evento: "",
  responsable: "",
  fase: "Montaje",
  prioridad: "Media",
  fechaLimite: "",
  hora_inicio_estimada: "",
  hora_fin_estimada: "",
  estado: "Pendiente",
  notas: "",
}

export const EMPTY_CATALOGO: TareaCatalogoForm = {
  nombre_tarea: "",
  descripcion: "",
  fase_sugerida: "Montaje",
}

export function validateTarea(form: TareaForm): string | null {
  if (!form.tarea.trim()) return "La tarea es obligatoria"
  if (!form.evento) return "El evento es obligatorio"
  if (!form.responsable) return "El responsable es obligatorio"
  if (!form.fechaLimite) return "La fecha programada es obligatoria"
  if (!form.hora_inicio_estimada || !form.hora_fin_estimada) {
    return "Las horas de inicio y fin son obligatorias"
  }
  return null
}

export function validateCatalogo(form: TareaCatalogoForm): string | null {
  if (!form.nombre_tarea.trim()) return "El nombre de la tarea es obligatorio"
  if (!form.descripcion.trim()) return "La descripción es obligatoria"
  return null
}

export function normalizeCatalogo(form: TareaCatalogoForm): TareaCatalogoForm {
  return {
    ...form,
    nombre_tarea: form.nombre_tarea.trim(),
    descripcion: form.descripcion.trim(),
  }
}

/** Datos que una asignación hereda de su plantilla. */
export function desdeCatalogo(plantilla: TareaCatalogoItem): Partial<TareaForm> {
  return {
    tarea_id: plantilla.id,
    codigo_tarea: plantilla.codigo,
    tarea: plantilla.nombre_tarea,
    descripcion_catalogo: plantilla.descripcion,
    fase: plantilla.fase_sugerida,
  }
}

export function asignacionesDe(
  plantilla: TareaCatalogoItem,
  tareas: TareaItem[],
): TareaItem[] {
  return tareas.filter((t) => String(t.tarea_id) === plantilla.id)
}
