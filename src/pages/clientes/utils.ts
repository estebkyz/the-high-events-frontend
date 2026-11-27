import { joinName } from "@/utils/format"
import type { ClienteItem } from "./types"

export function getClienteName(c: Partial<ClienteItem>): string {
  if (c.tipo_cliente === "Empresa") return c.razon_social || "Empresa sin razón social"
  return joinName(
    [c.primer_nombre, c.segundo_nombre, c.primer_apellido, c.segundo_apellido],
    "Cliente sin nombre",
  )
}
