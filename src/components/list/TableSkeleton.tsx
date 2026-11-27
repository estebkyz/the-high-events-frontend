import { Skeleton } from "@/components/Skeleton"
import type { Column } from "./DataTable"

interface TableSkeletonProps<T> {
  columns: Column<T>[]
  itemLabel: string
}

const ROWS = [0, 1, 2, 3, 4, 5]
const CARDS = ROWS.slice(0, 4)
/** Anchos distintos para que se lea como texto y no como una reja. */
const WIDTHS = ["w-36", "w-24", "w-28", "w-20", "w-32"]
const BAR_ALIGN = { left: "", right: "ml-auto", center: "mx-auto" }

/** Silueta del listado mientras llegan los datos: mismas columnas y alto de fila. */
export function TableSkeleton<T>({ columns, itemLabel }: TableSkeletonProps<T>) {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Cargando {itemLabel}…</span>

      <div aria-hidden="true" className="sm:hidden divide-y divide-line-soft">
        {CARDS.map((row) => (
          <div key={row} className="p-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>

      <div aria-hidden="true" className="hidden sm:block overflow-hidden">
        <table className="w-full text-left text-[13px] border-collapse">
          <thead>
            <tr className="border-b border-line-soft text-xs text-ink-muted bg-surface-2">
              {columns.map((col) => (
                <th
                  key={col.id}
                  className="py-2 px-3 first:pl-4 font-medium whitespace-nowrap"
                >
                  <span className={`block w-fit ${BAR_ALIGN[col.align ?? "left"]}`}>
                    {col.header}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {ROWS.map((row) => (
              <tr key={row}>
                {columns.map((col, index) => (
                  <td key={col.id} className="py-4 px-3 first:pl-4">
                    <Skeleton
                      className={`h-3.5 max-w-full ${WIDTHS[(row + index) % WIDTHS.length]} ${BAR_ALIGN[col.align ?? "left"]}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
