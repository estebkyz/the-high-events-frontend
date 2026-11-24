import type { ReactNode } from "react"

interface ListPageProps {
  children: ReactNode
  /** Modales y barras flotantes: van fuera del área con scroll. */
  overlays?: ReactNode
}

/** Contenedor único de toda página de listado. */
export function ListPage({ children, overlays }: ListPageProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 space-y-5 max-w-7xl mx-auto w-full">
        {children}
      </main>
      {overlays}
    </div>
  )
}
