/** Contratos de datos entre pantallas (`navigate(ruta, { state })`). */

export interface AgendaToCotizacionState {
  fromAgenda: true
  clientName?: string
  fechaTentativa?: string
  tipoEvento?: string
  lugar?: string
  notas?: string
}

export function isAgendaToCotizacion(state: object): state is AgendaToCotizacionState {
  return "fromAgenda" in state && state.fromAgenda === true
}
