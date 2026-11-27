import type { ReactNode } from "react"

interface ListPageProps {
  children: ReactNode
  /** Modales y barras flotantes: van fuera del área con scroll. */
  overlays?: ReactNode
}

/** Contenedor único de toda página de listado. */
export function ListPage({ children, overlays }: ListPageProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1280px] mx-auto w-full px-4 py-5 sm:px-6 space-y-4">
          {children}
        </div>
      </main>
      {overlays}
    </div>
  )
}
