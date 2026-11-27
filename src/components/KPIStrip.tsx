import type { ReactNode } from "react"

interface KPIStripProps {
  children: ReactNode
  /** Rejilla propia; por defecto, hasta cuatro columnas. */
  grid?: string
  loading?: boolean
}

/** Una sola tarjeta con las métricas separadas por líneas finas. */
export function KPIStrip({
  children,
  grid = "grid-cols-2 lg:grid-cols-4",
  loading,
}: KPIStripProps) {
  return (
    <div
      aria-busy={loading}
      // El fondo se ve por la separación de 1 px: son las líneas divisorias.
      className={`grid gap-px bg-line-soft rounded-xl shadow-card overflow-hidden ${grid}`}
    >
      {children}
    </div>
  )
}
