import type { EmpleadoItem } from "./types"

export function getEmpleadoFullName(e: Partial<EmpleadoItem>): string {
  const parts = [
    e.primer_nombre,
    e.segundo_nombre,
    e.primer_apellido,
    e.segundo_apellido,
  ].filter(Boolean)
  return parts.length > 0 ? parts.join(" ") : "Empleado sin nombre"
}
