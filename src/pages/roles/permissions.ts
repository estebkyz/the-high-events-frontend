import type { PermissionGroup } from "./types"

/** Catálogo de privilegios por módulo: debe coincidir con el del servidor. */
export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: "dashboard",
    label: "Dashboard Gerencial",
    privileges: [
      { id: "dashboard.ver", label: "Ver KPIs y gráficos estadísticos" },
      { id: "dashboard.agenda", label: "Consultar mini-agenda de disponibilidad" },
      { id: "dashboard.exportar", label: "Exportar resumen gerencial" },
    ],
  },
  {
    id: "cotizaciones",
    label: "Cotizaciones",
    privileges: [
      { id: "cotizaciones.ver", label: "Ver y buscar cotizaciones" },
      { id: "cotizaciones.crear", label: "Crear nuevas cotizaciones" },
      { id: "cotizaciones.editar", label: "Editar cotizaciones" },
      { id: "cotizaciones.eliminar", label: "Eliminar cotizaciones" },
      { id: "cotizaciones.estado", label: "Cambiar estado (Aprobar / Rechazar)" },
      { id: "cotizaciones.pdf", label: "Generar y descargar PDF de cotización" },
    ],
  },
  {
    id: "eventos",
    label: "Eventos",
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
    label: "Agendamiento",
    privileges: [
      { id: "agendamiento.ver", label: "Ver calendario y disponibilidad" },
      { id: "agendamiento.crear", label: "Agendar eventos, citas y visitas técnicas" },
      { id: "agendamiento.editar", label: "Reprogramar o editar agendamientos" },
      { id: "agendamiento.eliminar", label: "Eliminar agendamientos" },
      { id: "agendamiento.estado", label: "Confirmar o cancelar reservas" },
    ],
  },
  {
    id: "clientes",
    label: "Clientes",
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
    label: "Servicios",
    privileges: [
      { id: "servicios.ver", label: "Ver catálogo de servicios" },
      { id: "servicios.crear", label: "Crear nuevos servicios" },
      { id: "servicios.editar", label: "Editar precios y descripciones" },
      { id: "servicios.eliminar", label: "Eliminar servicios" },
      { id: "servicios.estado", label: "Activar o inactivar servicios" },
      { id: "servicios.categorias", label: "Gestionar categorías de servicios" },
    ],
  },
  {
    id: "ventas",
    label: "Ventas",
    privileges: [
      { id: "ventas.ver", label: "Ver listado y detalle de ventas" },
      { id: "ventas.crear", label: "Registrar ventas y boletería" },
      { id: "ventas.editar", label: "Editar ventas" },
      { id: "ventas.eliminar", label: "Eliminar ventas sin pagos" },
      { id: "ventas.anular", label: "Anular o cambiar estado de venta" },
      { id: "ventas.comprobante", label: "Generar comprobantes de venta" },
    ],
  },
  {
    id: "abonos",
    label: "Abonos y Pagos",
    privileges: [
      { id: "abonos.ver", label: "Ver abonos de clientes y pagos a proveedores" },
      { id: "abonos.crear", label: "Registrar anticipos (50%) y pagos finales" },
      { id: "abonos.editar", label: "Editar y verificar comprobantes" },
      { id: "abonos.estado", label: "Cambiar estado de transacciones" },
    ],
  },
  {
    id: "tareas",
    label: "Tareas Operativas",
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
    label: "Equipos e Inventario",
    privileges: [
      { id: "equipos.ver", label: "Ver inventario de equipos propios y alquilados" },
      { id: "equipos.crear", label: "Registrar nuevos equipos" },
      { id: "equipos.editar", label: "Editar equipos y mantenimiento" },
      { id: "equipos.eliminar", label: "Eliminar equipos" },
      { id: "equipos.estado", label: "Cambiar estado operativo de equipos" },
      { id: "equipos.categorias", label: "Gestionar categorías de equipos" },
    ],
  },
  {
    id: "prestamos",
    label: "Préstamos de Equipos",
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
    label: "Recepciones (Formato de Entrega)",
    privileges: [
      { id: "recepciones.ver", label: "Ver actas de recepción y devolución" },
      { id: "recepciones.crear", label: "Registrar recepción por equipo con foto" },
      { id: "recepciones.editar", label: "Editar estado y observaciones por equipo" },
      { id: "recepciones.eliminar", label: "Eliminar actas de recepción" },
      { id: "recepciones.estado", label: "Cambiar estado del acta" },
      { id: "recepciones.devolucion", label: "Verificar devolución en desmontaje" },
    ],
  },
  {
    id: "incidentes",
    label: "Incidentes",
    privileges: [
      { id: "incidentes.ver", label: "Ver historial de incidentes por evento" },
      { id: "incidentes.reportar", label: "Registrar nuevos incidentes" },
      { id: "incidentes.gestionar", label: "Asignar responsable y registrar solución" },
      { id: "incidentes.eliminar", label: "Eliminar incidentes" },
      { id: "incidentes.estado", label: "Cambiar estado y cerrar incidentes" },
    ],
  },
  {
    id: "proveedores",
    label: "Proveedores",
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
    label: "Empleados",
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
    label: "Usuarios",
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
    label: "Roles y Permisos",
    privileges: [
      { id: "config.roles.ver", label: "Ver listado y detalle de roles" },
      { id: "config.roles.crear", label: "Crear nuevos roles" },
      { id: "config.roles.editar", label: "Editar permisos y privilegios de roles" },
      { id: "config.roles.eliminar", label: "Eliminar roles" },
      { id: "config.roles.estado", label: "Activar o inactivar roles" },
    ],
  },
]
