import type { PermissionGroup, Rol, PermsMap } from "./types"

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: "config",
    label: "Configuración",
    privileges: [
      { id: "config.roles.ver", label: "Ver roles y permisos" },
      { id: "config.roles.editar", label: "Editar roles y permisos" },
      { id: "config.roles.crear", label: "Crear nuevos roles" },
      { id: "config.roles.eliminar", label: "Eliminar roles" },
    ],
  },
  {
    id: "usuarios",
    label: "Gestión de Usuarios",
    privileges: [
      { id: "usuarios.ver", label: "Ver usuarios del sistema" },
      { id: "usuarios.crear", label: "Crear usuarios" },
      { id: "usuarios.editar", label: "Editar usuarios" },
      { id: "usuarios.eliminar", label: "Eliminar usuarios" },
      { id: "usuarios.estado", label: "Activar o inactivar usuarios" },
    ],
  },
  {
    id: "empleados",
    label: "Gestión de Empleados",
    privileges: [
      { id: "empleados.ver", label: "Ver empleados" },
      { id: "empleados.crear", label: "Crear empleados" },
      { id: "empleados.editar", label: "Editar empleados" },
      { id: "empleados.eliminar", label: "Eliminar empleados" },
    ],
  },
  {
    id: "comercial",
    label: "Gestión Comercial y Ventas",
    privileges: [
      { id: "clientes.ver", label: "Ver clientes" },
      { id: "clientes.crear", label: "Crear clientes" },
      { id: "clientes.editar", label: "Editar y actualizar clientes" },
      { id: "servicios.ver", label: "Ver catálogo de servicios" },
      { id: "servicios.gestionar", label: "Gestionar servicios" },
      { id: "cotizaciones.ver", label: "Ver cotizaciones" },
      { id: "cotizaciones.crear", label: "Crear cotizaciones" },
      { id: "cotizaciones.editar", label: "Editar cotizaciones" },
      { id: "cotizaciones.pdf", label: "Generar PDF de cotización" },
      { id: "ventas.ver", label: "Ver ventas" },
      { id: "ventas.crear", label: "Registrar ventas" },
      { id: "abonos.ver", label: "Ver abonos y pagos" },
      { id: "abonos.crear", label: "Registrar abonos y pagos" },
    ],
  },
  {
    id: "eventos",
    label: "Gestión de Eventos",
    privileges: [
      { id: "eventos.ver", label: "Ver eventos" },
      { id: "eventos.crear", label: "Crear eventos" },
      { id: "eventos.editar", label: "Editar eventos" },
      { id: "eventos.eliminar", label: "Eliminar eventos" },
      { id: "agendamiento.ver", label: "Ver reservas y agendamiento" },
      { id: "agendamiento.crear", label: "Crear y cancelar reservas" },
    ],
  },
  {
    id: "proveedores",
    label: "Gestión de Proveedores",
    privileges: [
      { id: "proveedores.ver", label: "Ver proveedores" },
      { id: "proveedores.crear", label: "Crear proveedores" },
      { id: "proveedores.editar", label: "Editar proveedores" },
      { id: "proveedores.estado", label: "Activar o inactivar proveedores" },
      { id: "recepciones.ver", label: "Ver recepciones y actas" },
      { id: "recepciones.crear", label: "Registrar recepciones" },
    ],
  },
  {
    id: "operativa",
    label: "Gestión Operativa y Logística",
    privileges: [
      { id: "equipos.ver", label: "Ver inventario de equipos" },
      { id: "equipos.gestionar", label: "Gestionar equipos" },
      { id: "prestamos.ver", label: "Ver préstamos de equipos" },
      { id: "prestamos.crear", label: "Registrar y controlar préstamos" },
      { id: "tareas.ver", label: "Ver tareas asignadas" },
      { id: "tareas.crear", label: "Crear y asignar tareas" },
      { id: "tareas.editar", label: "Editar y actualizar tareas" },
      { id: "incidentes.ver", label: "Ver incidentes registrados" },
      { id: "incidentes.reportar", label: "Reportar incidentes" },
      {
        id: "incidentes.gestionar",
        label: "Gestionar resolución de incidentes",
      },
    ],
  },
]

export const ALL_PRIV_IDS = PERMISSION_GROUPS.flatMap((g) =>
  g.privileges.map((p) => p.id),
)

export const INITIAL_ROLES: Rol[] = [
  {
    id: "1",
    nombre: "Super Admin",
    descripcion: "Control total de la plataforma.",
    usuariosCount: 2,
    estado: "Activo",
  },
  {
    id: "2",
    nombre: "Coordinador",
    descripcion: "Gestión operativa y logística de eventos.",
    usuariosCount: 4,
    estado: "Activo",
  },
  {
    id: "3",
    nombre: "Comercial",
    descripcion: "Clientes, cotizaciones y ventas.",
    usuariosCount: 5,
    estado: "Activo",
  },
  {
    id: "4",
    nombre: "Operativo",
    descripcion: "Equipos, tareas e incidentes en campo.",
    usuariosCount: 8,
    estado: "Activo",
  },
  {
    id: "5",
    nombre: "Auditor",
    descripcion: "Solo lectura de reportes y registros.",
    usuariosCount: 1,
    estado: "Inactivo",
  },
]

export function buildInitialPerms(): PermsMap {
  const all = new Set(ALL_PRIV_IDS)

  const coordinador = new Set([
    "usuarios.ver",
    "empleados.ver",
    "empleados.crear",
    "empleados.editar",
    "clientes.ver",
    "cotizaciones.ver",
    "ventas.ver",
    "abonos.ver",
    "eventos.ver",
    "eventos.crear",
    "eventos.editar",
    "eventos.eliminar",
    "agendamiento.ver",
    "agendamiento.crear",
    "proveedores.ver",
    "recepciones.ver",
    "recepciones.crear",
    "equipos.ver",
    "equipos.gestionar",
    "prestamos.ver",
    "prestamos.crear",
    "tareas.ver",
    "tareas.crear",
    "tareas.editar",
    "incidentes.ver",
    "incidentes.reportar",
    "incidentes.gestionar",
  ])

  const comercial = new Set([
    "clientes.ver",
    "clientes.crear",
    "clientes.editar",
    "servicios.ver",
    "servicios.gestionar",
    "cotizaciones.ver",
    "cotizaciones.crear",
    "cotizaciones.editar",
    "cotizaciones.pdf",
    "ventas.ver",
    "ventas.crear",
    "abonos.ver",
    "abonos.crear",
    "eventos.ver",
    "agendamiento.ver",
    "proveedores.ver",
  ])

  const operativo = new Set([
    "empleados.ver",
    "eventos.ver",
    "agendamiento.ver",
    "equipos.ver",
    "equipos.gestionar",
    "prestamos.ver",
    "prestamos.crear",
    "tareas.ver",
    "tareas.crear",
    "tareas.editar",
    "incidentes.ver",
    "incidentes.reportar",
    "recepciones.ver",
    "recepciones.crear",
  ])

  const auditor = new Set([
    "clientes.ver",
    "cotizaciones.ver",
    "ventas.ver",
    "abonos.ver",
    "eventos.ver",
    "proveedores.ver",
    "equipos.ver",
    "tareas.ver",
    "incidentes.ver",
  ])

  return {
    "1": all,
    "2": coordinador,
    "3": comercial,
    "4": operativo,
    "5": auditor,
  }
}
