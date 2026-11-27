import type { RouteId } from "@/types"

/** Privilegios que abren cada acción de un módulo: basta con tener uno. */
export interface ModuleAccess {
  view: readonly string[]
  create: readonly string[]
  edit: readonly string[]
  remove: readonly string[]
  status: readonly string[]
}

const standard = (prefix: string): ModuleAccess => ({
  view: [`${prefix}.ver`],
  create: [`${prefix}.crear`],
  edit: [`${prefix}.editar`],
  remove: [`${prefix}.eliminar`],
  status: [`${prefix}.estado`, `${prefix}.editar`],
})

/** Mismas reglas que aplica la API: aquí solo se oculta lo que ella rechazaría. */
export const MODULE_ACCESS: Record<RouteId, ModuleAccess> = {
  dashboard: standard("dashboard"),
  cotizaciones: standard("cotizaciones"),
  eventos: standard("eventos"),
  agendamiento: standard("agendamiento"),
  clientes: standard("clientes"),
  servicios: standard("servicios"),
  ventas: { ...standard("ventas"), status: ["ventas.anular", "ventas.editar"] },
  abonos: standard("abonos"),
  tareas: standard("tareas"),
  equipos: standard("equipos"),
  prestamos: {
    ...standard("prestamos"),
    status: ["prestamos.devolucion", "prestamos.editar"],
  },
  recepciones: {
    ...standard("recepciones"),
    create: ["recepciones.crear", "recepciones.devolucion"],
  },
  incidentes: {
    ...standard("incidentes"),
    create: ["incidentes.reportar"],
    edit: ["incidentes.gestionar"],
    status: ["incidentes.estado", "incidentes.gestionar"],
  },
  proveedores: standard("proveedores"),
  empleados: standard("empleados"),
  usuarios: standard("usuarios"),
  roles: standard("config.roles"),
}

/** Verificar o rechazar pagos. */
export const VERIFY_PAYMENTS = ["abonos.estado", "abonos.editar"] as const
