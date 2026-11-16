export interface Privilege {
  id: string; label: string
}

export interface PermissionGroup {
  id: string; label: string
  privileges: Privilege[]
}

export interface Rol {
  id: string; nombre: string
  descripcion: string
  usuariosCount: number
  estado: "Activo" | "Inactivo"
}

export type PermsMap = Record<string, Set<string>>
