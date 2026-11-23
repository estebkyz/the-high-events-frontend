export type TipoDocumentoUsuario = "CC" | "CE" | "NIT" | "PASAPORTE"

export interface SesionAcceso {
  fecha: string; ip: string
  dispositivo: string
  resultado: "Exitosa" | "Fallida"
}

export interface UsuarioItem {
  id: string; tipo_documento: TipoDocumentoUsuario
  numero_documento: string
  primer_nombre: string
  segundo_nombre?: string
  primer_apellido: string
  segundo_apellido?: string
  correo: string
  telefono: string
  rol: string
  contrasena?: string
  ultimoAcceso: string
  estado: "Activo" | "Inactivo"
  fecha_creacion?: string
  sesiones?: SesionAcceso[]
}

export type UsuarioDrawerMode = "none" | "create" | "edit" | "view"

export type UsuarioFormData = Partial<UsuarioItem>
