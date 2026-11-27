import { joinName } from "@/utils/format"
import type { EmpleadoItem } from "./types"

export function getEmpleadoFullName(e: Partial<EmpleadoItem>): string {
  return joinName(
    [e.primer_nombre, e.segundo_nombre, e.primer_apellido, e.segundo_apellido],
    "Empleado sin nombre",
  )
}

/** Responsable que hereda un documento del evento; vacío si el evento no lo tiene. */
export function getResponsable(
  id: string | undefined,
  empleados: EmpleadoItem[],
): { responsable?: string; responsable_id?: number } {
  const empleado = empleados.find((e) => e.id === id)
  return empleado
    ? { responsable: getEmpleadoFullName(empleado), responsable_id: Number(empleado.id) }
    : {}
}
