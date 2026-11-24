import { MAX_NOMBRE } from "./constants"
import { durationMinutes } from "./schedule"
import type { EventoForm } from "./types"

/** Reglas de negocio por modalidad. Devuelve el primer error o `null`. */
export function validateEvento(form: EventoForm): string | null {
  const error =
    form.modalidad === "Cliente" ? validateCliente(form) : validatePropio(form)
  if (error) return error
  if (!form.direccion.trim()) return "La ubicación es obligatoria"

  const minutes = durationMinutes(form)
  if (minutes === null) return "Las fechas y horas de inicio y fin son obligatorias"
  if (minutes <= 0) return "El fin debe ser posterior al inicio"
  return form.empleadosAsignados.length === 0
    ? "Asigna al menos un empleado con su tarea y fase"
    : null
}

function validateCliente(form: EventoForm): string | null {
  if (!form.cliente_id) return "Selecciona el cliente del evento"
  if (!form.cotizacion_id) return "Selecciona una cotización aceptada del cliente"
  if (form.equiposAsignados.length === 0) return "Asigna los equipos del evento"
  return null
}

function validatePropio(form: EventoForm): string | null {
  if (!form.nombre.trim()) return "El nombre del evento es obligatorio"
  if (form.nombre.trim().length > MAX_NOMBRE) {
    return `El nombre no puede superar ${MAX_NOMBRE} caracteres`
  }
  if (!form.concepto_espectaculo.trim()) return "Describe el concepto del evento"
  return null
}
