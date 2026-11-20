import type { PermissionGroup, Rol, PermsMap } from "./types"

/**
 * Lista completa de Permisos (Quemados según la BD) — Todos los 17 módulos del sistema.
 * Cada permiso (módulo) agrupa sus privilegios granulares (Ver, Crear, Editar, Eliminar, Cambiar estado).
 */
export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: "dashboard",
    label: "1. Dashboard Gerencial",
    privileges: [
      { id: "dashboard.ver", label: "Ver KPIs y gráficos estadísticos" },
      { id: "dashboard.agenda", label: "Consultar mini-agenda de disponibilidad" },
      { id: "dashboard.exportar", label: "Exportar resumen gerencial" },
    ],
  },
  {
    id: "cotizaciones",
    label: "2. Cotizaciones",
    privileges: [
      { id: "cotizaciones.ver", label: "Ver y buscar cotizaciones" },
      { id: "cotizaciones.crear", label: "Crear nuevas cotizaciones" },
      { id: "cotizaciones.editar", label: "Editar cotizaciones" },
      { id: "cotizaciones.estado", label: "Cambiar estado (Aprobar / Rechazar)" },
      { id: "cotizaciones.pdf", label: "Generar y descargar PDF de cotización" },
    ],
  },
  {
    id: "eventos",
    label: "3. Eventos",
    privileges: [
      { id: "eventos.ver", label: "Ver listado y detalle de eventos" },
      { id: "eventos.crear", label: "Crear eventos (Cliente y Propios)" },
      { id: "eventos.editar", label: "Editar servicios, equipos y personal" },
      { id: "eventos.eliminar", label: "Eliminar eventos" },
      { id: "eventos.estado", label: "Cambiar estado operativo del evento" },
    ],
  },
  {
    id: "agendamiento",
    label: "4. Agendamiento",
    privileges: [
      { id: "agendamiento.ver", label: "Ver calendario y disponibilidad" },
      { id: "agendamiento.crear", label: "Agendar eventos, citas y visitas técnicas" },
      { id: "agendamiento.editar", label: "Reprogramar o editar agendamientos" },
      { id: "agendamiento.estado", label: "Confirmar o cancelar reservas" },
    ],
  },
  {
    id: "clientes",
    label: "5. Clientes",
    privileges: [
      { id: "clientes.ver", label: "Ver listado y detalle de clientes" },
      { id: "clientes.crear", label: "Registrar nuevos clientes" },
      { id: "clientes.editar", label: "Editar información de clientes" },
      { id: "clientes.eliminar", label: "Eliminar clientes" },
      { id: "clientes.estado", label: "Activar o inactivar clientes" },
    ],
  },
  {
    id: "servicios",
    label: "6. Servicios",
    privileges: [
      { id: "servicios.ver", label: "Ver catálogo de servicios" },
      { id: "servicios.crear", label: "Crear nuevos servicios" },
      { id: "servicios.editar", label: "Editar precios y descripciones" },
      { id: "servicios.eliminar", label: "Eliminar servicios" },
      { id: "servicios.estado", label: "Activar o inactivar servicios" },
    ],
  },
  {
    id: "ventas",
    label: "7. Ventas",
    privileges: [
      { id: "ventas.ver", label: "Ver listado y detalle de ventas" },
      { id: "ventas.crear", label: "Registrar ventas y boletería" },
      { id: "ventas.anular", label: "Anular o cambiar estado de venta" },
      { id: "ventas.comprobante", label: "Generar comprobantes de venta" },
    ],
  },
  {
    id: "abonos",
    label: "8. Abonos y Pagos",
    privileges: [
      { id: "abonos.ver", label: "Ver abonos de clientes y pagos a proveedores" },
      { id: "abonos.crear", label: "Registrar anticipos (50%) y pagos finales" },
      { id: "abonos.editar", label: "Editar y verificar comprobantes" },
      { id: "abonos.estado", label: "Cambiar estado de transacciones" },
    ],
  },
  {
    id: "tareas",
    label: "9. Tareas Operativas",
    privileges: [
      { id: "tareas.ver", label: "Ver tablero y listado de tareas" },
      { id: "tareas.crear", label: "Crear y asignar tareas a empleados" },
      { id: "tareas.editar", label: "Editar tareas y registrar avances" },
      { id: "tareas.eliminar", label: "Eliminar tareas" },
      { id: "tareas.estado", label: "Cambiar estado de cumplimiento" },
    ],
  },
  {
    id: "equipos",
    label: "10. Equipos e Inventario",
    privileges: [
      { id: "equipos.ver", label: "Ver inventario de equipos propios y alquilados" },
      { id: "equipos.crear", label: "Registrar nuevos equipos" },
      { id: "equipos.editar", label: "Editar equipos y mantenimiento" },
      { id: "equipos.eliminar", label: "Eliminar equipos" },
      { id: "equipos.categorias", label: "Gestionar categorías de equipos" },
    ],
  },
  {
    id: "prestamos",
    label: "11. Préstamos de Equipos",
    privileges: [
      { id: "prestamos.ver", label: "Ver préstamos activos e historial" },
      { id: "prestamos.crear", label: "Registrar préstamo de equipos a eventos" },
      { id: "prestamos.editar", label: "Editar datos del préstamo" },
      { id: "prestamos.devolucion", label: "Registrar devolución y estado físico" },
      { id: "prestamos.eliminar", label: "Eliminar registros de préstamo" },
    ],
  },
  {
    id: "recepciones",
    label: "12. Recepciones (Formato de Entrega)",
    privileges: [
      { id: "recepciones.ver", label: "Ver actas de recepción y devolución" },
      { id: "recepciones.crear", label: "Registrar recepción por equipo con foto" },
      { id: "recepciones.editar", label: "Editar estado y observaciones por equipo" },
      { id: "recepciones.devolucion", label: "Verificar devolución en desmontaje" },
    ],
  },
  {
    id: "incidentes",
    label: "13. Incidentes",
    privileges: [
      { id: "incidentes.ver", label: "Ver historial de incidentes por evento" },
      { id: "incidentes.reportar", label: "Registrar nuevos incidentes" },
      { id: "incidentes.gestionar", label: "Asignar responsable y registrar solución" },
      { id: "incidentes.estado", label: "Cambiar estado y cerrar incidentes" },
    ],
  },
  {
    id: "proveedores",
    label: "14. Proveedores",
    privileges: [
      { id: "proveedores.ver", label: "Ver directorio e historial de proveedores" },
      { id: "proveedores.crear", label: "Registrar nuevos proveedores" },
      { id: "proveedores.editar", label: "Editar datos y servicios ofrecidos" },
      { id: "proveedores.eliminar", label: "Eliminar proveedores" },
      { id: "proveedores.estado", label: "Activar o inactivar proveedores" },
    ],
  },
  {
    id: "empleados",
    label: "15. Empleados",
    privileges: [
      { id: "empleados.ver", label: "Ver listado y detalle de empleados" },
      { id: "empleados.crear", label: "Registrar nuevos empleados" },
      { id: "empleados.editar", label: "Editar cargo, vinculación y contacto" },
      { id: "empleados.eliminar", label: "Eliminar empleados" },
      { id: "empleados.estado", label: "Activar o inactivar empleados" },
    ],
  },
  {
    id: "usuarios",
    label: "16. Usuarios",
    privileges: [
      { id: "usuarios.ver", label: "Ver cuentas de usuario del sistema" },
      { id: "usuarios.crear", label: "Crear usuarios y asignar contraseña" },
      { id: "usuarios.editar", label: "Editar usuarios y rol asignado" },
      { id: "usuarios.eliminar", label: "Eliminar usuarios" },
      { id: "usuarios.estado", label: "Activar o inactivar cuentas" },
    ],
  },
  {
    id: "roles",
    label: "17. Roles y Permisos",
    privileges: [
      { id: "config.roles.ver", label: "Ver listado y detalle de roles" },
      { id: "config.roles.crear", label: "Crear nuevos roles" },
      { id: "config.roles.editar", label: "Editar permisos y privilegios de roles" },
      { id: "config.roles.eliminar", label: "Eliminar roles" },
    ],
  },
]

export const ALL_PRIV_IDS = PERMISSION_GROUPS.flatMap((g) =>
  g.privileges.map((p) => p.id),
)

export const INITIAL_ROLES: Rol[] = [
  {
    id: "1",
    nombre: "Administrador General",
    descripcion: "Control total de todos los módulos administrativos, comerciales y operativos.",
    usuariosCount: 2,
    estado: "Activo",
  },
  {
    id: "2",
    nombre: "Gerente de Operaciones y Logística",
    descripcion: "Coordinación de eventos, equipos, préstamos, recepciones, tareas e incidentes.",
    usuariosCount: 4,
    estado: "Activo",
  },
  {
    id: "3",
    nombre: "Coordinador Comercial y Ventas",
    descripcion: "Gestión de clientes, servicios, cotizaciones, agendamiento, ventas y abonos.",
    usuariosCount: 5,
    estado: "Activo",
  },
  {
    id: "4",
    nombre: "Técnico Operativo de Campo",
    descripcion: "Consulta de eventos, ejecución de tareas asignadas, préstamos y reporte de incidentes.",
    usuariosCount: 8,
    estado: "Activo",
  },
  {
    id: "5",
    nombre: "Auditor / Consulta",
    descripcion: "Acceso de solo lectura a indicadores, reportes financieros y registros.",
    usuariosCount: 1,
    estado: "Inactivo",
  },
]

export function buildInitialPerms(): PermsMap {
  const all = new Set(ALL_PRIV_IDS)

  const coordinador = new Set(
    PERMISSION_GROUPS.filter((g) =>
      [
        "dashboard",
        "eventos",
        "agendamiento",
        "tareas",
        "equipos",
        "prestamos",
        "recepciones",
        "incidentes",
        "proveedores",
        "empleados",
      ].includes(g.id),
    ).flatMap((g) => g.privileges.map((p) => p.id)),
  )

  const comercial = new Set(
    PERMISSION_GROUPS.filter((g) =>
      [
        "dashboard",
        "cotizaciones",
        "eventos",
        "agendamiento",
        "clientes",
        "servicios",
        "ventas",
        "abonos",
      ].includes(g.id),
    ).flatMap((g) => g.privileges.map((p) => p.id)),
  )

  const operativo = new Set([
    "eventos.ver",
    "agendamiento.ver",
    "tareas.ver",
    "tareas.editar",
    "tareas.estado",
    "equipos.ver",
    "prestamos.ver",
    "prestamos.crear",
    "prestamos.devolucion",
    "recepciones.ver",
    "recepciones.crear",
    "recepciones.devolucion",
    "incidentes.ver",
    "incidentes.reportar",
  ])

  const auditor = new Set(
    PERMISSION_GROUPS.flatMap((g) =>
      g.privileges.filter((p) => p.id.endsWith(".ver")).map((p) => p.id),
    ),
  )

  return {
    "1": all,
    "2": coordinador,
    "3": comercial,
    "4": operativo,
    "5": auditor,
  }
}
