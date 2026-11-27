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

/** Privilegio de acceso del módulo de un privilegio: `eventos.editar` → `eventos.ver`. */
export const accesoDe = (id: string) => `${id.slice(0, id.lastIndexOf("."))}.ver`
export const esAcceso = (id: string) => id.endsWith(".ver")

/**
 * Acceder al módulo es requisito de sus demás acciones: marcar una acción marca el acceso, y el
 * acceso no se desmarca mientras quede otra acción del módulo.
 */
export function togglePermiso(permisos: string[], id: string): string[] {
  if (permisos.includes(id)) {
    const enUso = esAcceso(id) && permisos.some((p) => p !== id && accesoDe(p) === id)
    return enUso ? permisos : permisos.filter((p) => p !== id)
  }
  const acceso = accesoDe(id)
  return [...permisos, id, ...(esAcceso(id) || permisos.includes(acceso) ? [] : [acceso])]
}
