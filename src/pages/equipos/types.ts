export type TipoPropiedadEquipo = "Propio" | "Alquilado"

/** ENUM('disponible','en_evento','prestado','en_mantenimiento','de_baja') */
export type EstadoOperativo =
  | "Disponible"
  | "En Evento"
  | "Prestado"
  | "En Mantenimiento"
  | "De Baja"

export interface EquipoItem {
  id: string
  codigo?: string
  nombre: string
  categoria: string
  serie: string
  estadoOperativo: EstadoOperativo
  propiedad: TipoPropiedadEquipo
  proveedor_id?: number | null
  proveedor_nombre?: string
  costo_adquisicion?: number
  costo_alquiler_dia?: number
  mantenimiento_proximo?: string
  activo?: boolean
}

export type EquipoForm = Omit<EquipoItem, "id">
