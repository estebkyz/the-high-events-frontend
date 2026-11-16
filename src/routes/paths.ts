import type { RouteId } from "../types"

/**
 * Única fuente de verdad de las URLs de la aplicación.
 * Para agregar o cambiar una ruta: edita aquí y en `routes/index.tsx`.
 */
export const ROUTE_PATHS: Record<RouteId, string> = {
  dashboard: "/dashboard",
  eventos: "/eventos",
  agendamiento: "/agendamiento",
  tareas: "/tareas",
  equipos: "/equipos",
  prestamos: "/prestamos",
  incidentes: "/incidentes",
  clientes: "/clientes",
  cotizaciones: "/cotizaciones",
  ventas: "/ventas",
  abonos: "/abonos",
  proveedores: "/proveedores",
  recepciones: "/recepciones",
  servicios: "/servicios",
  empleados: "/empleados",
  usuarios: "/usuarios",
  roles: "/roles",
}

/** Rutas con parámetros o que no pertenecen al menú lateral. */
export const EVENTO_PATHS = {
  list: ROUTE_PATHS.eventos,
  create: `${ROUTE_PATHS.eventos}/nuevo`,
  createServicio: `${ROUTE_PATHS.eventos}/nuevo/servicio`,
  createEmpleado: `${ROUTE_PATHS.eventos}/nuevo/empleado`,
  edit: (id: string) => `${ROUTE_PATHS.eventos}/${id}/editar`,
  editServicio: (id: string) => `${ROUTE_PATHS.eventos}/${id}/editar/servicio`,
  editEmpleado: (id: string) => `${ROUTE_PATHS.eventos}/${id}/editar/empleado`,
} as const

export const LOGIN_PATH = "/login"

/** Deduce el RouteId activo a partir de la URL (para resaltar el menú lateral). */
export function routeIdFromPath(pathname: string): RouteId {
  const match = (Object.keys(ROUTE_PATHS) as RouteId[]).find(
    (id) =>
      pathname === ROUTE_PATHS[id] ||
      pathname.startsWith(`${ROUTE_PATHS[id]}/`),
  )
  return match ?? "dashboard"
}
