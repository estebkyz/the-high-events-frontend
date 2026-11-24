import type { EstadoActivo } from "@/constants/common"

export type TipoCobroServicio =
  | "por_evento"
  | "por_hora"
  | "por_dia"
  | "por_persona"
  | "tarifa_fija"

export interface ServicioItem {
  id: string
  nombre: string
  categoria: string
  tipo_cobro: TipoCobroServicio
  descripcion: string
  precioBase: string
  precioBaseNum?: number
  estado: EstadoActivo
}

export type ServicioForm = Omit<ServicioItem, "id">
