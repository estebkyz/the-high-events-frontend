import type { SegmentedOption } from "@/components/SegmentedControl"

export const RANGE_OPTIONS: SegmentedOption[] = [
  { value: "dia", label: "Día" },
  { value: "semana", label: "Semana" },
  { value: "mes", label: "Mes" },
  { value: "anio", label: "Año" },
]

export const COLORS = {
  accent: "var(--brand)",
  info: "var(--info)",
  /** Comparaciones y categorías sin significado de estado. */
  neutral: "var(--chart-axis)",
} as const

export const PANEL = "bg-surface rounded-xl shadow-card p-4 sm:p-5"

/** Flechas del período y del calendario. */
export const ARROW_BUTTON = "icon-btn !size-7"

// Rejillas según el ancho del área de contenido (el menú lateral la reduce).
export const KPI_GRID =
  "grid-cols-1 @xs:grid-cols-2 @max-2xl:[&>:last-child]:col-span-full @2xl:@max-4xl:grid-cols-6 @2xl:@max-4xl:[&>*]:col-span-2 @2xl:@max-4xl:[&>:nth-last-child(-n+2)]:col-span-3 @4xl:grid-cols-5"
export const MAIN_GRID =
  "grid grid-cols-1 gap-4 [&>*]:min-w-0 @2xl:grid-cols-2 @4xl:grid-cols-3 @4xl:grid-rows-[auto_1fr_auto]"

/** Quien no ve ventas o abonos tiene menos métricas: ocupan todo el ancho. */
export const KPI_GRID_PARCIAL = "grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]"
