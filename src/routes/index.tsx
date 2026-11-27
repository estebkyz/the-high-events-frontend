import { lazy } from "react"
import { createBrowserRouter, type RouteObject } from "react-router-dom"
import { MODULE_ACCESS } from "@/constants/access"
import AppLayout from "@/layouts/AppLayout"
import ErrorPage from "@/pages/ErrorPage"
import { HomeRedirect } from "./HomeRedirect"
import { LoginRoute } from "./LoginRoute"
import { ROUTE_PATHS, LOGIN_PATH, PERFIL_PATH } from "./paths"
import { PAGES } from "./pages"
import { RequireAccess } from "./RequireAccess"
import type { RouteId } from "@/types"

const DashboardPage = lazy(PAGES.dashboard)
const EventosPage = lazy(PAGES.eventos)
const EventoFormPage = lazy(() => import("@/pages/eventos/EventoFormPage"))
const AgendamientoPage = lazy(PAGES.agendamiento)
const TareasPage = lazy(PAGES.tareas)
const EquiposPage = lazy(PAGES.equipos)
const PrestamosPage = lazy(PAGES.prestamos)
const IncidentesPage = lazy(PAGES.incidentes)
const ClientesPage = lazy(PAGES.clientes)
const CotizacionesPage = lazy(PAGES.cotizaciones)
const VentasPage = lazy(PAGES.ventas)
const AbonosPage = lazy(PAGES.abonos)
const ProveedoresPage = lazy(PAGES.proveedores)
const RecepcionesPage = lazy(PAGES.recepciones)
const ServiciosPage = lazy(PAGES.servicios)
const EmpleadosPage = lazy(PAGES.empleados)
const UsuariosPage = lazy(PAGES.usuarios)
const RolesPage = lazy(PAGES.roles)
const PerfilPage = lazy(() => import("@/pages/perfil/PerfilPage"))
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"))

const rel = (id: RouteId) => ROUTE_PATHS[id].slice(1)

const privateRoutes: RouteObject[] = [
  { index: true, element: <HomeRedirect /> },
  { path: rel("dashboard"), element: <DashboardPage /> },
  {
    path: rel("eventos"),
    children: [
      { index: true, element: <EventosPage /> },
      {
        path: "nuevo",
        element: (
          <RequireAccess codes={MODULE_ACCESS.eventos.create}>
            <EventoFormPage />
          </RequireAccess>
        ),
      },
      {
        path: ":id/editar",
        element: (
          <RequireAccess codes={MODULE_ACCESS.eventos.edit}>
            <EventoFormPage />
          </RequireAccess>
        ),
      },
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
  // Sin privilegios: cada cuenta ve y cambia sus propios datos
  { path: PERFIL_PATH.slice(1), element: <PerfilPage /> },
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
