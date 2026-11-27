import type { KPITrend } from "@/components/KPICard"
import type { AbonoItem } from "@/pages/abonos/types"
import { resumirCartera } from "@/pages/abonos/utils"
import type { EquipoItem } from "@/pages/equipos/types"
import type { EventoItem } from "@/pages/eventos/types"
import type { IncidenteItem } from "@/pages/incidentes/types"
import type { Recepcion } from "@/pages/recepciones/types"
import type { TareaItem } from "@/pages/tareas/types"
import type { VentaItem } from "@/pages/ventas/types"
import { resumirVentas } from "@/pages/ventas/utils"
import { parseCOP } from "@/utils/format"
import { COLORS } from "./constants"
import { isInRange } from "./period"
import type {
  Bucket,
  CategoriaVenta,
  DateRange,
  ModalidadResumen,
  OperacionResumen,
} from "./types"

export interface DashboardData {
  ventas: VentaItem[]
  abonos: AbonoItem[]
  eventos: EventoItem[]
  equipos: EquipoItem[]
  tareas: TareaItem[]
  recepciones: Recepcion[]
  incidentes: IncidenteItem[]
  /** Pagos confirmados de clientes. */
  cobros: Movimiento[]
}

/** Dinero en una fecha: una venta o un cobro. */
export interface Movimiento {
  fecha: string
  monto: number
}

export function ventasToMovimientos(ventas: VentaItem[]): Movimiento[] {
  return ventas
    .filter((v) => v.estado_venta === "Confirmada")
    .map((v) => ({ fecha: v.fecha, monto: v.totalNum }))
}

export function cobrosDe(abonos: AbonoItem[]): Movimiento[] {
  return abonos
    .filter((a) => a.tipoCartera === "Clientes")
    .flatMap((a) => a.historial)
    .filter((p) => p.estado === "Pagado")
    .map((p) => ({ fecha: p.fecha, monto: p.montoNum }))
}

const sumar = (movimientos: Movimiento[]) =>
  movimientos.reduce((total, m) => total + m.monto, 0)

/** Cambio frente a la referencia; sin base no hay porcentaje que mostrar. */
export function getTrend(
  actual: number,
  anterior: Movimiento[],
  { range, label }: { range: DateRange; label: string },
): KPITrend | undefined {
  const base = sumar(anterior.filter((m) => isInRange(m.fecha, range)))
  if (base <= 0) return undefined
  return { percent: Math.round(((actual - base) / base) * 100), label }
}

/** Solo los registros cuya fecha cae dentro del período. */
export function filterByPeriod(data: DashboardData, range: DateRange): DashboardData {
  const ventas = data.ventas.filter((v) => isInRange(v.fecha, range))
  const eventos = data.eventos.filter((e) => isInRange(e.hora_inicio, range))
  return {
    ventas,
    eventos,
    // Un acuerdo pertenece al período de su venta o de su evento, tenga pagos o no.
    abonos: data.abonos.filter(
      (a) =>
        ventas.some((v) => a.id === `C-${v.id}`) ||
        eventos.some((e) => a.id.startsWith(`P-${e.id}-`)),
    ),
    cobros: data.cobros.filter((c) => isInRange(c.fecha, range)),
    tareas: data.tareas.filter((t) => isInRange(t.fechaLimite, range)),
    recepciones: data.recepciones.filter((r) => isInRange(r.fecha, range)),
    incidentes: data.incidentes.filter((i) => isInRange(i.fecha, range)),
    // El inventario es una foto actual: no depende del período.
    equipos: data.equipos,
  }
}

export function getKpis({ ventas, abonos, eventos, cobros }: DashboardData) {
  const resumen = resumirVentas(ventas)
  const vigentes = eventos.filter((e) => e.estado !== "Cancelado").length
  return {
    vendido: resumen.total,
    cobrado: sumar(cobros),
    porCobrar: resumirCartera(abonos, "Clientes").pendiente,
    porPagar: resumirCartera(abonos, "Proveedores").pendiente,
    eventosVigentes: vigentes,
    eventosTotal: eventos.length,
  }
}

/**
 * Total por tramo. Es `null` si el tramo empieza después de `hoy` o no existe:
 * un cero ahí se leería como una caída real.
 */
export function serie(
  movimientos: Movimiento[],
  buckets: (Bucket | undefined)[],
  hoy: string,
): (number | null)[] {
  return buckets.map((bucket) =>
    bucket && bucket.from <= hoy
      ? sumar(movimientos.filter((m) => isInRange(m.fecha, bucket)))
      : null,
  )
}

export function ventasPorCategoria(eventos: EventoItem[]): CategoriaVenta[] {
  const totals = new Map<string, number>()
  for (const servicio of eventos.flatMap((e) => e.serviciosDetalles ?? [])) {
    const current = totals.get(servicio.categoria) ?? 0
    totals.set(servicio.categoria, current + parseCOP(servicio.costo))
  }
  const total = Array.from(totals.values()).reduce((sum, monto) => sum + monto, 0)
  return Array.from(totals, ([categoria, monto]) => ({
    categoria,
    monto,
    porcentaje: total > 0 ? Math.round((monto / total) * 100) : 0,
  })).sort((a, b) => b.monto - a.monto)
}

/** Las mayores y, si sobran, el resto sumado en "Otras": nada se oculta. */
export function agruparCategorias(
  categorias: CategoriaVenta[],
  max: number,
): CategoriaVenta[] {
  if (categorias.length <= max) return categorias
  const resto = categorias.slice(max - 1)
  return [
    ...categorias.slice(0, max - 1),
    {
      categoria: `Otras (${resto.length})`,
      monto: resto.reduce((sum, c) => sum + c.monto, 0),
      porcentaje: resto.reduce((sum, c) => sum + c.porcentaje, 0),
    },
  ]
}

export function eventosPorModalidad(eventos: EventoItem[]): ModalidadResumen[] {
  const summarize = (
    modalidad: EventoItem["modalidad"],
    label: string,
    color: string,
  ): ModalidadResumen => {
    const items = eventos.filter((e) => e.modalidad === modalidad)
    return {
      label,
      color,
      cantidad: items.length,
      presupuesto: items.reduce((sum, e) => sum + (e.valor_total || 0), 0),
    }
  }
  return [
    summarize("Cliente", "Eventos de clientes", COLORS.accent),
    summarize("Propio", "Eventos propios", COLORS.neutral),
  ]
}

const countIn = <T, K extends keyof T>(items: T[], key: K, values: T[K][]) =>
  items.filter((item) => values.includes(item[key])).length

export function resumenOperacion(data: DashboardData): OperacionResumen[] {
  const { equipos, tareas, recepciones, incidentes } = data
  return [
    {
      categoria: "Equipos",
      ok: countIn(equipos, "estadoOperativo", ["Disponible"]),
      enCurso: countIn(equipos, "estadoOperativo", ["En Evento", "Prestado"]),
      alerta: countIn(equipos, "estadoOperativo", ["En Mantenimiento", "De Baja"]),
    },
    {
      categoria: "Tareas",
      ok: countIn(tareas, "estado", ["Completada"]),
      enCurso: countIn(tareas, "estado", ["Pendiente", "En Proceso"]),
      alerta: 0,
    },
    {
      categoria: "Recepciones",
      ok: countIn(recepciones, "estado", ["Conforme", "Cerrada"]),
      enCurso: countIn(recepciones, "estado", ["Pendiente"]),
      alerta: countIn(recepciones, "estado", ["Con Novedades", "Anulada"]),
    },
    {
      categoria: "Incidentes",
      ok: countIn(incidentes, "estado", ["Solucionado"]),
      enCurso: countIn(incidentes, "estado", ["Reportado", "En Atención"]),
      alerta: countIn(incidentes, "estado", ["Escalado"]),
    },
  ]
}

/** Escala "redonda" para el eje Y, con un máximo de 5 intervalos. */
export function niceScale(max: number): { top: number; step: number; intervals: number } {
  const raw = max * 1.08 || 1
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  for (const multiplier of [0.5, 1, 2, 2.5, 5, 10]) {
    const step = multiplier * magnitude
    const intervals = Math.ceil(raw / step)
    if (intervals <= 5) return { top: intervals * step, step, intervals }
  }
  return { top: raw, step: raw, intervals: 1 }
}
