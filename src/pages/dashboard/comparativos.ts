import { COLORS } from "./constants"
import {
  serie,
  ventasToMovimientos,
  type DashboardData,
  type Movimiento,
} from "./metrics"
import { getPeriod, shiftAnchor } from "./period"
import type { ChartSeries, RangeType } from "./types"

export type ComparativoId = "cobrado" | "venta"

export interface Comparativo {
  title: string
  subtitle: string
  labels: string[]
  series: ChartSeries[]
}

/** Opciones del selector; el título de la tarjeta lleva el nombre completo. */
export const COMPARATIVO_OPTIONS: { value: ComparativoId; label: string }[] = [
  { value: "cobrado", label: "Cobrado" },
  { value: "venta", label: "Venta" },
]

/** El período de la fecha elegida contra el inmediatamente anterior. */
function contra(
  type: Extract<RangeType, "mes" | "semana">,
  anchor: string,
  hoy: string,
  movimientos: Movimiento[],
  color: string,
): Pick<Comparativo, "labels" | "series"> {
  const period = getPeriod(type, anchor)
  const previous = getPeriod(type, shiftAnchor(type, anchor, -1))
  return {
    labels: period.buckets.map((b) => b.label),
    series: [
      {
        name: period.label,
        color,
        values: serie(movimientos, period.buckets, hoy),
        area: true,
        strong: true,
      },
      {
        name: previous.label,
        color: COLORS.neutral,
        dashed: true,
        // El anterior puede tener más o menos tramos (meses de 4 o 5 semanas).
        values: serie(
          movimientos,
          period.buckets.map((_, i) => previous.buckets[i]),
          hoy,
        ),
      },
    ],
  }
}

export function getComparativo(
  id: ComparativoId,
  data: DashboardData,
  anchor: string,
  hoy: string,
): Comparativo {
  if (id === "cobrado") {
    return {
      title: "Cobrado Mes contra Mes",
      subtitle: "Cobros confirmados por semana",
      ...contra("mes", anchor, hoy, data.cobros, COLORS.accent),
    }
  }
  return {
    title: "Venta Semana contra Semana",
    subtitle: "Ventas confirmadas por día",
    ...contra("semana", anchor, hoy, ventasToMovimientos(data.ventas), COLORS.info),
  }
}
