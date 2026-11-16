import type { ProveedorItem } from "./types"

export function getProveedorContacto(p: Partial<ProveedorItem>): string {
  const parts = [
    p.contacto_primer_nombre,
    p.contacto_segundo_nombre,
    p.contacto_primer_apellido,
    p.contacto_segundo_apellido,
  ].filter(Boolean)
  return parts.length > 0 ? parts.join(" ") : "Contacto sin nombre"
}
