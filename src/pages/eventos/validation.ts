import { MAX_NOMBRE } from "./constants"
import { durationMinutes } from "./schedule"
import type { EventoForm } from "./types"

/** Reglas de negocio por modalidad. Devuelve el primer error o `null`. */
export function validateEvento(form: EventoForm): string | null {
  if (form.modalidad === "Cliente" && (!form.cliente_id || !form.cotizacion_id))
    return "Selecciona la cotización aceptada del evento"
  if (!form.nombre.trim()) return "El nombre del evento es obligatorio"
  if (form.nombre.trim().length > MAX_NOMBRE) {
    return `El nombre no puede superar ${MAX_NOMBRE} caracteres`
  }
  if (form.modalidad === "Propio" && !form.concepto_evento.trim()) {
    return "Describe el concepto del evento"
  }
  if (!form.responsable_id) return "Elige el responsable del evento"
  // En cotización (o cancelado) la fecha, el lugar y los recursos aún pueden faltar
  const sinProgramar = form.estado === "Cotización" || form.estado === "Cancelado"
  const minutes = durationMinutes(form)
  if (sinProgramar) {
    if (minutes !== null && minutes <= 0) return "El fin debe ser posterior al inicio"
    const sinFecha = minutes === null
    if (sinFecha && (form.equiposAsignados.length || form.empleadosAsignados.length)) {
      return "Define las fechas del evento antes de asignar equipos o personal"
    }
    return null
  }
  if (!form.direccion.trim()) return "La ubicación es obligatoria"
  if (minutes === null) return "Las fechas y horas de inicio y fin son obligatorias"
  if (minutes <= 0) return "El fin debe ser posterior al inicio"
  return form.empleadosAsignados.length === 0
    ? "Asigna al menos un empleado con su tarea y fase"
    : null
}
