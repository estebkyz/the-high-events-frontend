import type {
  EventoItem,
  CotizacionCatalogoItem,
  EquipoCatalogoItem,
  FaseTareaEvento,
} from "./types"

export const CLIENTES_CATALOGO: { id: string; nombre: string }[] = []

export const COTIZACIONES_CATALOGO: CotizacionCatalogoItem[] = []

export const AVAILABLE_EQUIPMENT: EquipoCatalogoItem[] = []

export const TAREAS_CATALOGO: {
  id: string
  codigo: string
  nombre_tarea: string
  descripcion: string
  fase_sugerida: FaseTareaEvento
}[] = []

export const AVAILABLE_EMPLOYEES: { id: string; nombre: string; cargo: string }[] = []

export const EVENTOS_MOCK: EventoItem[] = []
