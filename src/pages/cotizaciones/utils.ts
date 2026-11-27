import { printDocumentPdf } from "@/utils/printDocumentPdf"
import { diasEntre, formatCOP, formatFecha, formatHora } from "@/utils/format"
import type { CotizacionItem } from "./types"
import { EMPRESA } from "@/constants/empresa"

export interface CotizacionLinea {
  nombre: string
  descripcion: string
  valor: string
  /** `2 × $ 2.500.000`, solo si hay más de una unidad. */
  desglose?: string
}

export interface Vigencia {
  texto: string
  tone: "muted" | "warning" | "danger"
}

const POR_VENCER_DIAS = 7
const plural = (n: number) => `${n} ${n === 1 ? "día" : "días"}`

/** Plazo de una cotización; solo apremia mientras el cliente no ha respondido. */
export function getVigencia(
  { estado, fechaVence }: Pick<CotizacionItem, "estado" | "fechaVence">,
  hoy: string,
): Vigencia {
  const dias = diasEntre(hoy, fechaVence)
  const abierta = estado === "Borrador" || estado === "Enviada"
  if (dias === null || !abierta || dias > POR_VENCER_DIAS) {
    return { texto: `Vence: ${formatFecha(fechaVence)}`, tone: "muted" }
  }
  if (dias < 0) return { texto: `Venció hace ${plural(-dias)}`, tone: "danger" }
  return {
    texto: dias === 0 ? "Vence hoy" : `Vence en ${plural(dias)}`,
    tone: "warning",
  }
}

/** El servidor entiende que un fin anterior al inicio es del día siguiente. */
export function terminaAlDiaSiguiente(inicio?: string, fin?: string): boolean {
  return Boolean(inicio && fin && fin <= inicio)
}

export function formatHorario(inicio?: string, fin?: string): string | null {
  if (!inicio && !fin) return null
  const horas = [inicio, fin].map((hora) => (hora ? formatHora(hora) : "por definir"))
  return `${horas.join(" – ")}${terminaAlDiaSiguiente(inicio, fin) ? " (día siguiente)" : ""}`
}

/** Renglones a mostrar: el detalle con cantidades si existe; si no, los servicios. */
export function getCotizacionLineas(cotizacion: CotizacionItem): CotizacionLinea[] {
  if (cotizacion.items && cotizacion.items.length > 0) {
    return cotizacion.items.map((it) => ({
      nombre: it.nombre,
      descripcion: `${it.nombre} ×${it.cantidad}`,
      valor: formatCOP(it.subtotal),
      desglose:
        it.cantidad > 1 ? `${it.cantidad} × ${formatCOP(it.valor_unitario)}` : undefined,
    }))
  }
  return (cotizacion.servicios ?? []).map((servicio, index) => ({
    nombre: servicio,
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

export function cotizacionMailto(cotizacion: CotizacionItem, correo = ""): string {
  const subject = `Cotización ${cotizacion.codigo} - ${EMPRESA.nombre}`
  const body = `Hola ${cotizacion.cliente},\n\nAdjuntamos los detalles de la cotización ${cotizacion.codigo} para el evento "${cotizacion.nombre_evento}" por un total de ${cotizacion.total}.`
  return `mailto:${correo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
