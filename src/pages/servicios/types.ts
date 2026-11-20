export type TipoCobroServicio =
  | "por_evento"
  | "por_hora"
  | "por_dia"
  | "por_persona"
  | "tarifa_fija"

export const TIPO_COBRO_LABELS: Record<TipoCobroServicio, string> = {
  por_evento: "Por Evento",
  por_hora: "Por Hora",
  por_dia: "Por Día",
  por_persona: "Por Persona",
  tarifa_fija: "Tarifa Fija",
}

export interface ServicioItem {
  id: string
  nombre: string
  categoria: string
  tipo_cobro: TipoCobroServicio
  descripcion: string
  precioBase: string
  precioBaseNum?: number
  estado: "Activo" | "Inactivo"
}

export interface CategoriaServicioItem {
  id: string
  nombre: string
  descripcion: string
  estado: "Activo" | "Inactivo"
}

export type ServicioModalMode = "closed" | "view" | "form" | "categorias"

export type ServicioFormData = Partial<ServicioItem>
