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
  costo_alquiler?: number
  activo?: boolean
}

/** `YYYY-MM-DDTHH:mm` */
export interface RangoFechas {
  inicio: string
  fin: string
}

/** Ocupación de un equipo; `salida`: ya está físicamente afuera. */
export interface ReservaEquipo extends RangoFechas {
  evento_id: string
  evento: string
  tipo: "reserva" | "salida"
}

export interface DisponibilidadEquipo {
  id: string
  disponible: boolean
  /** Por qué no está disponible. */
  motivo?: string
  /** Próximas, en orden. */
  reservas: ReservaEquipo[]
}

export type EquipoForm = Omit<EquipoItem, "id">
