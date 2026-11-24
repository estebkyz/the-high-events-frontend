import { lazy } from "react"
import { createBrowserRouter, Navigate, type RouteObject } from "react-router-dom"
import AppLayout from "@/layouts/AppLayout"
import ErrorPage from "@/pages/ErrorPage"
import { LoginRoute } from "./LoginRoute"
import { ROUTE_PATHS, LOGIN_PATH } from "./paths"
import type { RouteId } from "@/types"

// Cada página se carga bajo demanda (code splitting): el bundle inicial queda liviano.
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"))
const EventosPage = lazy(() => import("@/pages/eventos/EventosPage"))
const EventoFormPage = lazy(() => import("@/pages/eventos/EventoFormPage"))
const AgendamientoPage = lazy(() => import("@/pages/agendamiento/AgendamientoPage"))
const TareasPage = lazy(() => import("@/pages/tareas/TareasPage"))
const EquiposPage = lazy(() => import("@/pages/equipos/EquiposPage"))
const PrestamosPage = lazy(() => import("@/pages/prestamos/PrestamosPage"))
const IncidentesPage = lazy(() => import("@/pages/incidentes/IncidentesPage"))
const ClientesPage = lazy(() => import("@/pages/clientes/ClientesPage"))
const CotizacionesPage = lazy(() => import("@/pages/cotizaciones/CotizacionesPage"))
const VentasPage = lazy(() => import("@/pages/ventas/VentasPage"))
const AbonosPage = lazy(() => import("@/pages/abonos/AbonosPage"))
const ProveedoresPage = lazy(() => import("@/pages/proveedores/ProveedoresPage"))
const RecepcionesPage = lazy(() => import("@/pages/recepciones/RecepcionesPage"))
const ServiciosPage = lazy(() => import("@/pages/servicios/ServiciosPage"))
const EmpleadosPage = lazy(() => import("@/pages/empleados/EmpleadosPage"))
const UsuariosPage = lazy(() => import("@/pages/usuarios/UsuariosPage"))
const RolesPage = lazy(() => import("@/pages/roles/RolesPage"))
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"))

const rel = (id: RouteId) => ROUTE_PATHS[id].slice(1)

const privateRoutes: RouteObject[] = [
  { index: true, element: <Navigate to={ROUTE_PATHS.dashboard} replace /> },
  { path: rel("dashboard"), element: <DashboardPage /> },
  {
    path: rel("eventos"),
    children: [
      { index: true, element: <EventosPage /> },
      { path: "nuevo", element: <EventoFormPage /> },
      { path: ":id/editar", element: <EventoFormPage /> },
    ],
  },
  { path: rel("agendamiento"), element: <AgendamientoPage /> },
  { path: rel("tareas"), element: <TareasPage /> },
  { path: rel("equipos"), element: <EquiposPage /> },
  { path: rel("prestamos"), element: <PrestamosPage /> },
  { path: rel("incidentes"), element: <IncidentesPage /> },
  { path: rel("clientes"), element: <ClientesPage /> },
  { path: rel("cotizaciones"), element: <CotizacionesPage /> },
  { path: rel("ventas"), element: <VentasPage /> },
  { path: rel("abonos"), element: <AbonosPage /> },
  { path: rel("proveedores"), element: <ProveedoresPage /> },
  { path: rel("recepciones"), element: <RecepcionesPage /> },
  { path: rel("servicios"), element: <ServiciosPage /> },
  { path: rel("empleados"), element: <EmpleadosPage /> },
  { path: rel("usuarios"), element: <UsuariosPage /> },
  { path: rel("roles"), element: <RolesPage /> },
  { path: "*", element: <NotFoundPage /> },
]

export const router = createBrowserRouter([
  { path: LOGIN_PATH, element: <LoginRoute />, errorElement: <ErrorPage /> },
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    // Un error en una página conserva el menú para poder salir de ella.
    children: [{ errorElement: <ErrorPage />, children: privateRoutes }],
  },
])
