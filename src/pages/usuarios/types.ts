import type { EstadoActivo, TipoDocumento } from "@/constants/common"

export interface UsuarioItem {
  id: string
  tipo_documento: TipoDocumento
  numero_documento: string
  primer_nombre: string
  segundo_nombre?: string
  primer_apellido: string
  segundo_apellido?: string
  correo: string
  telefono: string
  rol: string
  ultimoAcceso: string
  estado: EstadoActivo
  fecha_creacion?: string
  /** Solo se envía al crear o cambiar la contraseña; la API no debe devolverla. */
  contrasena?: string
}

export type UsuarioForm = Omit<UsuarioItem, "id" | "ultimoAcceso" | "fecha_creacion"> & {
  contrasena: string
}
