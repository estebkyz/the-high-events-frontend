import type { EstadoActivo, TipoDocumento } from "@/constants/common"

export type VinculacionEmpleado = "Fijo" | "Por Evento"

export interface EmpleadoItem {
  id: string
  tipo_documento: TipoDocumento
  numero_documento: string
  primer_nombre: string
  segundo_nombre?: string
  primer_apellido: string
  segundo_apellido?: string
  cargo: string
  telefono: string
  correo: string
  estado: EstadoActivo
  vinculacion?: VinculacionEmpleado
  emergenciaNombre?: string
  emergenciaTel?: string
  emergenciaParentesco?: string
}

export type EmpleadoForm = Omit<EmpleadoItem, "id">
