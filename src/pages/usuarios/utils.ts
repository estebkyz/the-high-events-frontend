import { joinName } from "@/utils/format"
import type { UsuarioItem } from "./types"

export function getUsuarioFullName(u: Partial<UsuarioItem>): string {
  return joinName(
    [u.primer_nombre, u.segundo_nombre, u.primer_apellido, u.segundo_apellido],
    "Usuario sin nombre",
  )
}
