import type { TipoDocumento } from "@/constants/common"
import type { UserProfile } from "@/services/session"

/** Datos de la cuenta en uso (`GET /perfil`). */
export interface Perfil {
  tipo_documento: TipoDocumento
  numero_documento: string
  nombre: string
  apellido: string
  correo: string
  telefono: string
  rol: string
  /** `YYYY-MM-DD HH:mm`; vacío si nunca ha ingresado. */
  ultimoAcceso: string
  fecha_creacion: string
}

export interface PerfilForm extends Pick<
  Perfil,
  "tipo_documento" | "numero_documento" | "nombre" | "apellido" | "correo" | "telefono"
> {
  contrasena_actual: string
  contrasena_nueva: string
  confirmar: string
}

/** `PUT /perfil`: el token llega solo si cambió la contraseña. */
export interface PerfilGuardado {
  perfil: Perfil
  user: UserProfile
  token?: string
}
