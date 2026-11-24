import { PERMISSION_GROUPS } from "./permissions"
import type { PermissionGroup, Rol, RolForm } from "./types"

export const EMPTY_ROL: RolForm = {
  nombre: "",
  descripcion: "",
  estado: "Activo",
  permisos: [],
}

export function rolToForm(rol: Rol): RolForm {
  const { nombre, descripcion, estado, permisos } = rol
  return { nombre, descripcion, estado, permisos }
}

export function validateRol(form: RolForm): string | null {
  if (!form.nombre.trim()) return "El nombre del rol es obligatorio"
  if (form.permisos.length === 0) return "Asigna al menos un privilegio"
  return null
}

export function countModulos(permisos: string[]): number {
  return PERMISSION_GROUPS.filter((g) =>
    g.privileges.some((p) => permisos.includes(p.id)),
  ).length
}

/** Marca todos los privilegios del grupo, o los quita si ya estaban todos. */
export function toggleGroup(permisos: string[], group: PermissionGroup): string[] {
  const ids = group.privileges.map((p) => p.id)
  const rest = permisos.filter((id) => !ids.includes(id))
  return ids.every((id) => permisos.includes(id)) ? rest : [...rest, ...ids]
}
