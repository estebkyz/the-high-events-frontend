import { Skeleton } from "@/components/Skeleton"

const ROWS = [0, 1, 2, 3, 4, 5, 6]

/** Silueta de una pantalla mientras se descarga: título, acción y tarjeta. */
export function PageLoader() {
  return (
    <div role="status" aria-busy="true" className="flex-1 overflow-hidden">
      <span className="sr-only">Cargando…</span>
      <div className="max-w-[1280px] mx-auto w-full px-4 py-5 sm:px-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-8 w-28" />
        </div>
        <div className="bg-surface rounded-xl shadow-card divide-y divide-line-soft">
          {ROWS.map((row) => (
            <div key={row} className="p-4 flex items-center justify-between gap-6">
              <Skeleton className="h-3.5 w-1/3" />
              <Skeleton className="h-3.5 w-1/5" />
              <Skeleton className="h-3.5 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
