import { joinName } from "@/utils/format"
import type { ProveedorItem } from "./types"

export function getProveedorContacto(p: Partial<ProveedorItem>): string {
  return joinName(
    [
      p.contacto_primer_nombre,
      p.contacto_segundo_nombre,
      p.contacto_primer_apellido,
      p.contacto_segundo_apellido,
    ],
    "Contacto sin nombre",
  )
}
