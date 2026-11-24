import { joinName } from "@/utils/format"
import type { EmpleadoItem } from "./types"

export function getEmpleadoFullName(e: Partial<EmpleadoItem>): string {
  return joinName(
    [e.primer_nombre, e.segundo_nombre, e.primer_apellido, e.segundo_apellido],
    "Empleado sin nombre",
  )
}
