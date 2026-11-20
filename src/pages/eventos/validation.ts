import type { EventoFormValues, AsignacionesMap } from "./types"

/**
 * Reglas de negocio de la tabla `evento` según modalidad (Cliente vs Propio).
 * Devuelve el mensaje del primer error encontrado, o `null` si el formulario es válido.
 */
export function validateEventoForm(
  form: EventoFormValues,
  equiposAsignados: string[] = [],
  assignments?: AsignacionesMap,
): string | null {
  const esCliente = form.modalidad === "Cliente"

  // 1. REGLAS PARA EVENTOS DE CLIENTE
  if (esCliente) {
    if (!form.cliente_id) {
      return "Debes seleccionar el cliente solicitante del evento."
    }

    if (!form.cotizacion_id || form.cotizacion_id === "5") {
      return "Para un evento de cliente es obligatorio seleccionar una cotización aprobada previamente."
    }

    if (equiposAsignados.length === 0) {
      return "Para un evento de cliente es obligatorio asignar los equipos técnicos requeridos de bodega."
    }

    if (assignments) {
      const staffAsignado = Object.values(assignments).some((a) => a.checked)
      if (!staffAsignado) {
        return "Para un evento de cliente es obligatorio asignar al menos un colaborador técnico con su tarea y fase."
      }
    }

    return null
  }

  // 2. REGLAS PARA EVENTOS PROPIOS (THE HIGH EVENTS)
  if (!form.nombre?.trim()) {
    return "El nombre del espectáculo o evento propio es obligatorio."
  }

  if (form.nombre.trim().length > 45) {
    return "El nombre del evento no puede superar 45 caracteres (VARCHAR 45)."
  }

  if (!form.concepto_espectaculo?.trim()) {
    return "Describe el concepto, temática visual o show de luces del evento propio."
  }

  if (!form.direccion?.trim()) {
    return "La ubicación del evento propio es obligatoria."
  }

  if (!form.hora_inicio || !form.hora_fin) {
    return "Las fechas y horarios de inicio y finalización son obligatorios."
  }

  if (new Date(form.hora_fin) <= new Date(form.hora_inicio)) {
    return "La hora de finalización debe ser posterior a la hora de inicio."
  }

  if (Number(form.presupuesto_estimado) < 0) {
    return "El presupuesto estimado no puede ser negativo."
  }

  if (assignments) {
    const staffAsignado = Object.values(assignments).some((a) => a.checked)
    if (!staffAsignado) {
      return "Debes asignar al menos un colaborador técnico para la producción de este evento propio."
    }
  }

  return null
}
