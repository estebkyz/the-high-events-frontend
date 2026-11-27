import type { CotizacionItem } from "@/pages/cotizaciones/types"
import type { EmpleadoItem } from "@/pages/empleados/types"
import { getEmpleadoFullName } from "@/pages/empleados/utils"
import type { ServicioItem } from "@/pages/servicios/types"
import type { TareaCatalogoItem } from "@/pages/tareas/types"
import { EMPRESA } from "@/constants/empresa"
import { buildSchedule } from "./schedule"
import type { EmpleadoAsignado, EventoForm, EventoItem, ServicioEvento } from "./types"

/** Datos propios del evento: se vacían al cambiar de modalidad. */
const SIN_DATOS = {
  id: undefined,
  cotizacion_id: null,
  cotizacion_codigo: "",
  nombre: "",
  direccion: "",
  hora_inicio: "",
  hora_fin: "",
  aforo_esperado: "",
  presupuesto_estimado: 0,
  valor_total: undefined,
  concepto_evento: "",
  observaciones: "",
  servicios: [],
  serviciosDetalles: [],
} satisfies Partial<EventoForm>

export const EMPTY_EVENTO: EventoForm = {
  ...SIN_DATOS,
  responsable_id: "",
  modalidad: "Cliente",
  cliente_id: null,
  cliente_nombre: "",
  estado: "Planificación",
  empleadosAsignados: [],
  equiposAsignados: [],
}

export function emptyEventoEn(fecha: string | null): EventoForm {
  return fecha
    ? { ...EMPTY_EVENTO, ...buildSchedule(fecha, "19:00", "23:59") }
    : EMPTY_EVENTO
}

export function eventoToForm(evento: EventoItem): EventoForm {
  return {
    ...EMPTY_EVENTO,
    ...evento,
    servicios: evento.servicios ?? [],
    serviciosDetalles: evento.serviciosDetalles ?? [],
    empleadosAsignados: evento.empleadosAsignados ?? [],
    equiposAsignados: evento.equiposAsignados ?? [],
  }
}

export function cambiarModalidad(
  modalidad: EventoForm["modalidad"],
): Partial<EventoForm> {
  return {
    ...SIN_DATOS,
    modalidad,
    cliente_id: null,
    cliente_nombre: modalidad === "Propio" ? EMPRESA.nombre : "",
  }
}

/** Estados en los que el evento de una cotización aceptada aún espera su planificación. */
const POR_PLANIFICAR: EventoItem["estado"][] = ["Cotización", "Planificación"]

/**
 * Cotizaciones aceptadas cuyo evento aún no se ha completado en Eventos (sin personal asignado).
 * Cada una trae su evento: es el mismo registro que se completa.
 */
export function cotizacionesPorPlanificar(
  cotizaciones: CotizacionItem[],
  eventos: EventoItem[],
) {
  return cotizaciones.flatMap((cotizacion) => {
    if (cotizacion.estado !== "Aceptada") return []
    const evento = eventos.find((e) => e.id === cotizacion.evento_id)
    const pendiente =
      evento?.modalidad === "Cliente" &&
      POR_PLANIFICAR.includes(evento.estado) &&
      !evento.empleadosAsignados?.length
    return pendiente ? [{ cotizacion, evento }] : []
  })
}

/** Carga el evento de la cotización aceptada; conserva el personal y los equipos ya elegidos. */
export function desdeCotizacion(evento: EventoItem, actual: EventoForm): EventoForm {
  const base = eventoToForm(evento)
  return {
    ...base,
    id: evento.id,
    estado: evento.estado === "Cotización" ? "Planificación" : evento.estado,
    responsable_id: actual.responsable_id || base.responsable_id,
    empleadosAsignados: actual.empleadosAsignados.length
      ? actual.empleadosAsignados
      : base.empleadosAsignados,
    equiposAsignados: actual.equiposAsignados.length
      ? actual.equiposAsignados
      : base.equiposAsignados,
  }
}

/** Detalle por servicio: usa lo guardado o lo arma desde el catálogo. */
export function resolverServicios(
  form: EventoForm,
  catalogo: ServicioItem[],
): ServicioEvento[] {
  return form.servicios.map((nombre) => {
    const guardado = form.serviciosDetalles.find((d) => d.nombre === nombre)
    if (guardado) return guardado
    const servicio = catalogo.find((s) => s.nombre === nombre)
    return {
      id: nombre,
      servicio_catalogo_id: servicio?.id,
      nombre,
      categoria: servicio?.categoria ?? "General",
      observaciones: servicio?.descripcion ?? "",
      costo: servicio?.precioBase ?? "$ 0",
    }
  })
}

/** Personas distintas: un empleado con varias tareas cuenta una vez. */
export function contarEmpleados({ empleadosAsignados = [] }: EventoItem): number {
  return new Set(empleadosAsignados.map((a) => a.empleado_id)).size
}

export function asignarEmpleado(
  empleado: EmpleadoItem,
  tarea: TareaCatalogoItem,
): EmpleadoAsignado {
  return {
    empleado_id: empleado.id,
    nombre: getEmpleadoFullName(empleado),
    cargo: empleado.cargo,
    ...cambiarTarea(tarea),
    estado: "Pendiente",
  }
}

export function cambiarTarea(
  tarea: TareaCatalogoItem,
): Pick<EmpleadoAsignado, "tarea_id" | "nombre_tarea" | "fase"> {
  return {
    tarea_id: tarea.id,
    nombre_tarea: tarea.nombre_tarea,
    fase: tarea.fase_sugerida,
  }
}

export function eventoToPayload(form: EventoForm, catalogo: ServicioItem[]): EventoForm {
  return {
    ...form,
    nombre: form.nombre.trim(),
    direccion: form.direccion.trim(),
    serviciosDetalles: resolverServicios(form, catalogo),
  }
}
