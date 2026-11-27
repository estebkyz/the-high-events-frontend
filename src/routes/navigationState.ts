/** Contratos de datos entre pantallas (`navigate(ruta, { state })`). */

export interface AgendaToCotizacionState {
  fromAgenda: true
  clientName?: string
  clientId?: string
  fechaTentativa?: string
  tipoEvento?: string
  lugar?: string
  notas?: string
}

export interface ProveedorToEquipoState {
  fromProveedor: true
  proveedorId: string
  proveedorNombre: string
}

export function isProveedorToEquipo(state: object): state is ProveedorToEquipoState {
  return "fromProveedor" in state && state.fromProveedor === true
}

/** Abre el detalle de un registro al llegar a su módulo. */
export interface OpenRecordState {
  openId: string
}

export function isOpenRecord(state: object): state is OpenRecordState {
  return "openId" in state && typeof state.openId === "string"
}

export function isAgendaToCotizacion(state: object): state is AgendaToCotizacionState {
  return "fromAgenda" in state && state.fromAgenda === true
}

/** Abre "Crear venta" con el evento ya elegido (desde el detalle del evento). */
export interface EventoToVentaState {
  ventaDeEvento: string
}

export function isEventoToVenta(state: object): state is EventoToVentaState {
  return "ventaDeEvento" in state && typeof state.ventaDeEvento === "string"
}
