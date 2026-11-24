import type { ClienteItem } from "@/pages/clientes/types"
import { getClienteName } from "@/pages/clientes/utils"
import type { CotizacionItem } from "@/pages/cotizaciones/types"
import type { EmpleadoItem } from "@/pages/empleados/types"
import { getEmpleadoFullName } from "@/pages/empleados/utils"
import type { ServicioItem } from "@/pages/servicios/types"
import type { TareaCatalogoItem } from "@/pages/tareas/types"
import { PRODUCTORA } from "./constants"
import { buildSchedule } from "./schedule"
import type { EmpleadoAsignado, EventoForm, EventoItem, ServicioEvento } from "./types"

/** Campos que dependen del cliente y su cotización. */
const SIN_COTIZACION = {
  cotizacion_id: null,
  cotizacion_codigo: "",
  nombre: "",
  direccion: "",
  hora_inicio: "",
  hora_fin: "",
  aforo_esperado: "",
  presupuesto_estimado: 0,
  concepto_espectaculo: "",
  observaciones: "",
  servicios: [],
  serviciosDetalles: [],
} satisfies Partial<EventoForm>

export const EMPTY_EVENTO: EventoForm = {
  ...SIN_COTIZACION,
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
    ...SIN_COTIZACION,
    modalidad,
    cliente_id: null,
    cliente_nombre: modalidad === "Propio" ? PRODUCTORA : "",
  }
}

export function cotizacionesDeCliente(
  cliente: ClienteItem | undefined,
  cotizaciones: CotizacionItem[],
): CotizacionItem[] {
  if (!cliente) return []
  const nombre = getClienteName(cliente)
  return cotizaciones.filter(
    (c) =>
      c.estado === "Aceptada" &&
      (c.cliente_id ? c.cliente_id === cliente.id : c.cliente === nombre),
  )
}

/** El evento de cliente hereda todos sus datos de la cotización. */
export function aplicarCotizacion(cotizacion: CotizacionItem): Partial<EventoForm> {
  return {
    cotizacion_id: cotizacion.id,
    cotizacion_codigo: cotizacion.codigo,
    nombre: cotizacion.nombre_evento,
    direccion: cotizacion.direccion ?? "",
    ...buildSchedule(
      cotizacion.fecha_evento ?? "",
      cotizacion.hora_inicio ?? "",
      cotizacion.hora_fin ?? "",
    ),
    aforo_esperado: cotizacion.aforo_esperado ? String(cotizacion.aforo_esperado) : "",
    presupuesto_estimado: cotizacion.totalNum ?? 0,
    observaciones: cotizacion.notas ?? "",
    servicios: cotizacion.servicios ?? [],
    serviciosDetalles: [],
  }
}

export function eventoDesdeCotizacion(cotizacion: CotizacionItem): EventoForm {
  return {
    ...EMPTY_EVENTO,
    ...aplicarCotizacion(cotizacion),
    cliente_id: cotizacion.cliente_id ?? null,
    cliente_nombre: cotizacion.cliente,
  }
}

export function seleccionarCliente(
  cliente: ClienteItem,
  cotizaciones: CotizacionItem[],
): Partial<EventoForm> {
  const [primera] = cotizacionesDeCliente(cliente, cotizaciones)
  return {
    ...SIN_COTIZACION,
    ...(primera && aplicarCotizacion(primera)),
    cliente_id: cliente.id,
    cliente_nombre: getClienteName(cliente),
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
