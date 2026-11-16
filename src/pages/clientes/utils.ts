import type { ClienteItem } from "./types"

export function getClienteDisplayName(c: Partial<ClienteItem>): string {
  if (c.tipo_cliente === "Empresa") {
    return c.razon_social || "Empresa sin razón social"
  }
  const parts = [
    c.primer_nombre,
    c.segundo_nombre,
    c.primer_apellido,
    c.segundo_apellido,
  ].filter(Boolean)
  return parts.length > 0 ? parts.join(" ") : "Cliente sin nombre"
}
