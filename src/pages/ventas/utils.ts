import { printDocumentPdf } from "@/utils/printDocumentPdf"
import type { VentaItem } from "./types"

export interface ResumenVentas {
  total: number
  confirmadas: number
  pagadas: number
  porCobrar: number
  clientes: number
}

/** Las ventas anuladas no suman en los indicadores. */
export function resumirVentas(ventas: VentaItem[]): ResumenVentas {
  const vigentes = ventas.filter((v) => v.estado_venta === "Confirmada")
  const pagadas = vigentes.filter((v) => v.estadoPago === "Pagado").length
  return {
    total: vigentes.reduce((sum, v) => sum + v.totalNum, 0),
    confirmadas: vigentes.length,
    pagadas,
    porCobrar: vigentes.length - pagadas,
    clientes: vigentes.filter((v) => v.tipo === "Cliente").length,
  }
}

export function printVenta(venta: VentaItem): void {
  printDocumentPdf({
    tipoDocumento: "Factura de Venta",
    codigo: venta.numero_factura,
    fecha: venta.fecha,
    terceroLabel: venta.tipo === "Propio" ? "Evento propio" : "Cliente / Evento",
    terceroNombre: venta.clienteEvento,
    estado: venta.estadoPago,
    total: venta.total,
  })
}
