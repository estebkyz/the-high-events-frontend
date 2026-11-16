import { AVAILABLE_EMPLOYEES, TAREAS_CATALOGO } from "./data"
import type { AsignacionesMap, EventoFormValues, EventoItem } from "./types"

/** Valores iniciales al crear un evento nuevo. */
export function createEmptyEventoForm(): EventoFormValues {
  return {
    modalidad: "Cliente",
    cliente_id: "1",
    cotizacion_id: "1",
    cotizacion_codigo: "COT-8040",
    nombre: "Gala Anual Corporativa",
    direccion: "Hotel Sheraton Salón Gran Virrey, Bogotá",
    hora_inicio: "2026-11-20T19:00",
    hora_fin: "2026-11-21T02:00",
    presupuesto_estimado: 45000000,
    estado: "Planificación",
    aforo_esperado: "350",
    concepto_espectaculo: "",
    observaciones:
      "Aceptada formalmente por junta directiva; programado para contrato.",
    servicios: [
      "Sonido Pro Line Array (hasta 1.000 pax)",
      "Show de Luces Robóticas Beam/Spot 350W",
      "DJ Profesional + Set Pioneer CDJ-3000",
      "Cobertura Fotográfica Completa",
    ],
    equiposAsignados: [],
  }
}

/** Selección de personal inicial; si se edita un evento, marca los ya asignados. */
export function createInitialAssignments(event?: EventoItem): AsignacionesMap {
  const assignments: AsignacionesMap = {}
  AVAILABLE_EMPLOYEES.forEach((emp) => {
    const existing = event?.empleadosAsignados?.find(
      (a) => a.empleado_id === emp.id || a.nombre === emp.nombre,
    )
    assignments[emp.id] = {
      checked: Boolean(existing),
      tarea_id: existing?.tarea_id || TAREAS_CATALOGO[0].id,
      fase: existing?.fase || "Montaje",
    }
  })
  return assignments
}
