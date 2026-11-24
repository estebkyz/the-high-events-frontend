import { printDocumentPdf } from "@/utils/printDocumentPdf"
import { CARTERA } from "./constants"
import type { AbonoItem, TipoCartera, TipoPago } from "./types"

export function getTercero(abono: AbonoItem): string {
  const nombre = abono.tipoCartera === "Clientes" ? abono.cliente : abono.proveedor
  return nombre || "No asignado"
}

export function getAbonoName(abono: AbonoItem): string {
  return abono.tipoCartera === "Clientes" ? abono.evento : abono.servicio || abono.evento
}

export function estadoCartera(abono: AbonoItem): "Pendiente" | "Liquidado" {
  return abono.porcentaje === 100 ? "Liquidado" : "Pendiente"
}

function sumarPagos(
  abono: AbonoItem,
  incluir: (estado: string, tipo: TipoPago) => boolean,
) {
  return abono.historial
    .filter((p) => incluir(p.estado, p.tipoPago))
    .reduce((sum, p) => sum + p.montoNum, 0)
}

/** Pagos confirmados o por verificar: lo que ya no se puede volver a cobrar. */
export function totalComprometido(abono: AbonoItem, tipo?: TipoPago): number {
  return sumarPagos(abono, (estado, t) => estado !== "Rechazado" && (!tipo || t === tipo))
}

/** Con saldo por registrar (los pagos por verificar ya cuentan). */
export function admitePago(abono: AbonoItem): boolean {
  return totalComprometido(abono) < abono.totalNum
}

export function resumirCartera(abonos: AbonoItem[], tipo: TipoCartera) {
  const cartera = abonos.filter((a) => a.tipoCartera === tipo)
  const confirmado = (tipoPago: TipoPago) =>
    cartera.reduce(
      (sum, a) =>
        sum + sumarPagos(a, (estado, t) => estado === "Pagado" && t === tipoPago),
      0,
    )
  const total = cartera.reduce((sum, a) => sum + a.totalNum, 0)
  const anticipos = confirmado("Anticipo")
  const saldos = confirmado("Saldo")
  return { total, anticipos, saldos, pendiente: total - anticipos - saldos }
}

export function printAbono(abono: AbonoItem): void {
  printDocumentPdf({
    tipoDocumento: "Comprobante de Abono / Pago",
    codigo: `ABO-${abono.id}`,
    fecha: abono.fechaPago,
    terceroLabel: CARTERA[abono.tipoCartera].tercero,
    terceroNombre: getTercero(abono),
    evento: abono.evento,
    estado: `${abono.porcentaje}% liquidado`,
    total: abono.total,
    items: [
      { descripcion: `Anticipo 50% (${abono.estadoAnticipo})`, valor: abono.anticipo },
      { descripcion: `Saldo 50% (${abono.estadoSaldo})`, valor: abono.saldo },
    ],
  })
}
