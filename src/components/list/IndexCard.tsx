import type { ReactNode } from "react"

/** Tarjeta única del listado: filtros arriba, registros y paginación abajo. */
export function IndexCard({ children }: { children: ReactNode }) {
  return (
    <section className="@container bg-surface rounded-xl shadow-card">{children}</section>
  )
}
