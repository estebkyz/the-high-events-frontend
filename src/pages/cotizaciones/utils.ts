import { printDocumentPdf } from "@/utils/printDocumentPdf"
import { formatCOP } from "@/utils/format"
import type { CotizacionItem } from "./types"

export interface CotizacionLinea {
  descripcion: string
  valor: string
}

/** Renglones a mostrar: el detalle con cantidades si existe; si no, los servicios. */
export function getCotizacionLineas(cotizacion: CotizacionItem): CotizacionLinea[] {
  if (cotizacion.items && cotizacion.items.length > 0) {
    return cotizacion.items.map((it) => ({
      descripcion: `${it.nombre} ×${it.cantidad}`,
      valor: formatCOP(it.subtotal),
    }))
  }
  return (cotizacion.servicios ?? []).map((servicio, index) => ({
    descripcion: servicio,
    valor: cotizacion.montos?.[index] ?? "",
  }))
}

export function printCotizacion(cotizacion: CotizacionItem): void {
  printDocumentPdf({
    tipoDocumento: "Cotización Comercial",
    codigo: cotizacion.codigo,
    fecha: cotizacion.fecha,
    terceroLabel: "Cliente",
    terceroNombre: cotizacion.cliente,
    evento: cotizacion.nombre_evento,
    estado: cotizacion.estado,
    total: cotizacion.total,
    items: getCotizacionLineas(cotizacion),
    notas: cotizacion.notas,
  })
}

export function cotizacionMailto(cotizacion: CotizacionItem): string {
  const subject = `Cotización ${cotizacion.codigo} - The High Events`
  const body = `Hola ${cotizacion.cliente},\n\nAdjuntamos los detalles de la cotización ${cotizacion.codigo} para el evento "${cotizacion.nombre_evento}" por un total de ${cotizacion.total}.`
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
