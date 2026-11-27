import { Skeleton } from "@/components/Skeleton"

const SECTIONS = [0, 1]
const FIELDS = [0, 1, 2, 3, 4, 5]

/** Silueta de un formulario de página completa. */
export function FormSkeleton() {
  return (
    <div role="status" aria-busy="true" className="space-y-4">
      <span className="sr-only">Cargando formulario…</span>
      {SECTIONS.map((section) => (
        <div key={section} className="bg-surface rounded-xl shadow-card p-5 space-y-4">
          <Skeleton className="h-4 w-44" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FIELDS.map((field) => (
              <div key={field} className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
