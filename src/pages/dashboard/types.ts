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
  values: number[]
  area?: boolean
  strong?: boolean
}

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
