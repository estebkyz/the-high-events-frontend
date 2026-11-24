import type { EstadoActivo } from "@/constants/common"

export interface Privilege {
  id: string
  label: string
}

export interface PermissionGroup {
  id: string
  label: string
  privileges: Privilege[]
}

export interface Rol {
  id: string
  nombre: string
  descripcion: string
  usuariosCount: number
  estado: EstadoActivo
  /** Ids de privilegio (`PERMISSION_GROUPS`). */
  permisos: string[]
}

export type RolForm = Pick<Rol, "nombre" | "descripcion" | "estado"> & {
  permisos: string[]
}
