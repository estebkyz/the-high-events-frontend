import type { RouteId } from "@/types"

/** Cada página se descarga bajo demanda: el paquete inicial queda liviano. */
export const PAGES = {
  dashboard: () => import("@/pages/dashboard/DashboardPage"),
  eventos: () => import("@/pages/eventos/EventosPage"),
  agendamiento: () => import("@/pages/agendamiento/AgendamientoPage"),
  tareas: () => import("@/pages/tareas/TareasPage"),
  equipos: () => import("@/pages/equipos/EquiposPage"),
  prestamos: () => import("@/pages/prestamos/PrestamosPage"),
  incidentes: () => import("@/pages/incidentes/IncidentesPage"),
  clientes: () => import("@/pages/clientes/ClientesPage"),
  cotizaciones: () => import("@/pages/cotizaciones/CotizacionesPage"),
  ventas: () => import("@/pages/ventas/VentasPage"),
  abonos: () => import("@/pages/abonos/AbonosPage"),
  proveedores: () => import("@/pages/proveedores/ProveedoresPage"),
  recepciones: () => import("@/pages/recepciones/RecepcionesPage"),
  servicios: () => import("@/pages/servicios/ServiciosPage"),
  empleados: () => import("@/pages/empleados/EmpleadosPage"),
  usuarios: () => import("@/pages/usuarios/UsuariosPage"),
  roles: () => import("@/pages/roles/RolesPage"),
} satisfies Record<RouteId, () => Promise<unknown>>

/** Adelanta la descarga al apuntar un enlace del menú; el navegador no la repite. */
export function preloadPage(route: RouteId): void {
  // Si falla (sin conexión), la navegación lo vuelve a intentar.
  PAGES[route]().catch(() => undefined)
}
