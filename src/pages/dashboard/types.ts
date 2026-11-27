export type RangeType = "dia" | "semana" | "mes" | "anio"

/** Rango de fechas `YYYY-MM-DD`, ambos extremos incluidos. */
export interface DateRange {
  from: string
  to: string
}

export interface Bucket extends DateRange {
  label: string
}

export interface Period {
  range: DateRange
  label: string
  buckets: Bucket[]
  previousBuckets: Bucket[]
}

export interface ChartSeries {
  name: string
  color: string
  /** `null`: el tramo aún no llega o no existe en ese período. */
  values: (number | null)[]
  area?: boolean
  strong?: boolean
  dashed?: boolean
}

/** Estado de carga de los recursos que alimentan un panel. */
export type ViewState = "loading" | "error" | "ready"

export interface CategoriaVenta {
  categoria: string
  monto: number
  porcentaje: number
}

export interface ModalidadResumen {
  label: string
  color: string
  cantidad: number
  presupuesto: number
}

export interface OperacionResumen {
  categoria: string
  ok: number
  enCurso: number
  alerta: number
}
