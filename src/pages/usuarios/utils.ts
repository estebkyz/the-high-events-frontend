import type { UsuarioItem } from "./types"

export function getUsuarioFullName(u: Partial<UsuarioItem>): string {
  const parts = [
    u.primer_nombre,
    u.segundo_nombre,
    u.primer_apellido,
    u.segundo_apellido,
  ].filter(Boolean)
  return parts.length > 0 ? parts.join(" ") : "Usuario sin nombre"
}
