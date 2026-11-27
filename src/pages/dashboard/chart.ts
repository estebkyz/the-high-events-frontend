import { niceScale } from "./metrics"
import type { ChartSeries } from "./types"

/** Medidas y escalas de la gráfica de líneas, en píxeles reales. */
export const CHART_HEIGHT = 240
export const PAD = { left: 60, right: 24, top: 16, bottom: 32 }
const PLOT_HEIGHT = CHART_HEIGHT - PAD.top - PAD.bottom
export const BASELINE = PAD.top + PLOT_HEIGHT
/** Ancho que necesita una etiqueta del eje X para no tocar a la siguiente. */
const LABEL_SPACE = 48

export interface Point {
  index: number
  value: number
}

export const toPoints = (values: (number | null)[]): Point[] =>
  values.flatMap((value, index) => (value === null ? [] : [{ index, value }]))

/** Eje compacto: `$ 12,5 M`. */
export function formatAxis(value: number): string {
  if (value === 0) return "$ 0"
  return `$ ${(value / 1_000_000).toLocaleString("es-CO", { maximumFractionDigits: 1 })} M`
}

export function getScale(width: number, count: number, series: ChartSeries[]) {
  const values = series.flatMap((s) => toPoints(s.values)).map((p) => p.value)
  const { top, step, intervals } = niceScale(Math.max(0, ...values))
  const plotWidth = Math.max(1, width - PAD.left - PAD.right)
  const stepX = count > 1 ? plotWidth / (count - 1) : plotWidth
  const x = (i: number) => PAD.left + (count > 1 ? i * stepX : plotWidth / 2)
  const y = (value: number) => BASELINE - (value / top) * PLOT_HEIGHT
  return {
    x,
    y,
    stepX,
    isEmpty: values.every((value) => value === 0),
    levels: Array.from({ length: intervals + 1 }, (_, i) => i * step),
    labelEvery: Math.ceil(LABEL_SPACE / stepX),
    path: (points: Point[]) => points.map((p) => `${x(p.index)},${y(p.value)}`).join(" "),
  }
}
