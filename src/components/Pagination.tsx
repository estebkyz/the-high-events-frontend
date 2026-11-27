import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  type LucideIcon,
} from "lucide-react"

interface PaginationProps {
  pageSize: number
  currentPage: number
  totalPages: number
  totalCount: number
  itemLabel?: string
  onPageSizeChange: (size: number) => void
  onPageChange: (page: number) => void
}

const PAGE_SIZES = [5, 10, 20, 50]

/** Pie de la tarjeta del listado. */
export function Pagination({
  pageSize,
  currentPage,
  totalPages,
  totalCount,
  itemLabel,
  onPageSizeChange,
  onPageChange,
}: PaginationProps) {
  const isFirst = currentPage <= 1
  const isLast = currentPage >= totalPages

  return (
    <div className="px-3 py-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line-soft bg-surface-2 rounded-b-xl text-xs text-ink-muted">
      <div className="flex items-center gap-2">
        <span>Mostrar</span>
        <span className="relative inline-block">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Registros por página"
            className="btn btn-secondary appearance-none !pr-7 !text-xs"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <ChevronDown
            size={13}
            aria-hidden="true"
            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </span>
        <span>{itemLabel ? `de ${totalCount} ${itemLabel}` : `de ${totalCount}`}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="tabular-nums">
          Página {currentPage} de {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <PageButton
            icon={ChevronsLeft}
            label="Primera página"
            disabled={isFirst}
            onClick={() => onPageChange(1)}
          />
          <PageButton
            icon={ChevronLeft}
            label="Página anterior"
            disabled={isFirst}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          />
          <PageButton
            icon={ChevronRight}
            label="Página siguiente"
            disabled={isLast}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          />
          <PageButton
            icon={ChevronsRight}
            label="Última página"
            disabled={isLast}
            onClick={() => onPageChange(totalPages)}
          />
        </div>
      </div>
    </div>
  )
}

interface PageButtonProps {
  icon: LucideIcon
  label: string
  disabled: boolean
  onClick: () => void
}

function PageButton({ icon: Icon, label, disabled, onClick }: PageButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="btn btn-secondary !px-2"
    >
      <Icon size={15} aria-hidden="true" />
    </button>
  )
}
