import type { RouteId } from "@/types"

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

/** Perfil de la cuenta en uso (menú de la cuenta, no del menú lateral). */
export const PERFIL_PATH = "/perfil"

/** Rutas con parámetros o que no pertenecen al menú lateral. */
export const EVENTO_PATHS = {
  list: ROUTE_PATHS.eventos,
  create: `${ROUTE_PATHS.eventos}/nuevo`,
  createOn: (fecha: string) => `${ROUTE_PATHS.eventos}/nuevo?fecha=${fecha}`,
  edit: (id: string) => `${ROUTE_PATHS.eventos}/${id}/editar`,
} as const

export const AGENDA_PATHS = {
  on: (fecha: string) => `${ROUTE_PATHS.agendamiento}?fecha=${fecha}`,
} as const

export const ABONOS_PATHS = {
  cartera: (tipo: "Clientes" | "Proveedores") => `${ROUTE_PATHS.abonos}?cartera=${tipo}`,
} as const

export const LOGIN_PATH = "/login"

/** Módulo de la URL; `null` en el inicio y en direcciones desconocidas. */
export function matchRouteId(pathname: string): RouteId | null {
  const match = (Object.keys(ROUTE_PATHS) as RouteId[]).find(
    (id) => pathname === ROUTE_PATHS[id] || pathname.startsWith(`${ROUTE_PATHS[id]}/`),
  )
  return match ?? null
}

/** Deduce el RouteId activo a partir de la URL (para resaltar el menú lateral). */
export function routeIdFromPath(pathname: string): RouteId {
  return matchRouteId(pathname) ?? "dashboard"
}
