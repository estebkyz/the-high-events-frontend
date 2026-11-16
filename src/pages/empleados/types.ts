export type TipoDocumentoEmpleado = "CC" | "CE" | "Pasaporte"
export type EstadoEmpleado = "Activo" | "Inactivo"
export type VinculacionEmpleado = "Fijo" | "Por Evento"

export interface EmpleadoItem {
  id: string; tipo_documento: TipoDocumentoEmpleado
  numero_documento: string
  primer_nombre: string
  segundo_nombre?: string
  primer_apellido: string
  segundo_apellido?: string
  cargo: string
  telefono: string
  correo: string
  estado: EstadoEmpleado
  vinculacion?: VinculacionEmpleado
  emergenciaNombre?: string
  emergenciaTel?: string
  emergenciaParentesco?: string
}

export interface EmpleadoFormData {
  tipo_documento: TipoDocumentoEmpleado; numero_documento: string
  primer_nombre: string
  segundo_nombre: string
  primer_apellido: string
  segundo_apellido: string
  cargo: string
  telefono: string
  correo: string
  estado: EstadoEmpleado
  vinculacion: VinculacionEmpleado
  emergenciaNombre: string
  emergenciaTel: string
  emergenciaParentesco: string
}

export type EmpleadoDrawerMode = null | "view" | "create" | "edit"
