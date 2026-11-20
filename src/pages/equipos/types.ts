export type Categoria =
  | "Audio"
  | "Iluminación"
  | "Video"
  | "Estructuras"
  | "Efectos Especiales / Humo"
  | "Accesorios"
  | string

export interface CategoriaEquipoItem {
  id: string
  nombre: string
  descripcion: string
  estado: "Activo" | "Inactivo"
}

export type TipoPropiedadEquipo = "Propio" | "Alquilado"

// Mapped exactly to MySQL Workbench: ENUM('disponible','en_evento','prestado','en_mantenimiento','de_baja')
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
  categoria: Categoria
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

export interface MantenimientoEntry {
  fecha: string
  descripcion: string
  tecnico: string
}

export type EquipoDrawerMode = "none" | "new" | "edit" | "view" | "categorias"

export type EquipoFormData = Partial<EquipoItem>
