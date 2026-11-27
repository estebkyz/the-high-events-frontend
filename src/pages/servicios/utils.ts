import type { ProveedorItem } from "@/pages/proveedores/types"
import type { ServicioItem } from "./types"

/** Proveedores activos que ofrecen el servicio o su categoría. */
export function findProveedoresDeServicio(
  servicio: ServicioItem,
  proveedores: ProveedorItem[],
): ProveedorItem[] {
  const nombre = servicio.nombre.toLowerCase()
  const categoria = servicio.categoria.toLowerCase()
  return proveedores.filter(
    (p) =>
      p.estado === "Activo" &&
      (p.servicios ?? []).some((s) => {
        const ofrecido = s.toLowerCase()
        return (
          ofrecido.includes(categoria) ||
          categoria.includes(ofrecido) ||
          nombre.includes(ofrecido)
        )
      }),
  )
}
