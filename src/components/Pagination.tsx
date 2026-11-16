import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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

export function Pagination({
  pageSize,
  currentPage,
  totalPages,
  totalCount,
  itemLabel,
  onPageSizeChange,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
      <div>
        <div className="flex items-center gap-2 text-[13px] text-[#94A3B8]">
          <span>Mostrar</span>
          <div className="relative inline-block">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-8 pl-3 pr-7 bg-[#181B22] border border-[#262D3D] rounded-lg text-xs text-[#F1F5F9] focus:outline-none focus:border-[#7C3AED] appearance-none cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
            />
          </div>
          <span>
            {itemLabel ? `de ${totalCount} ${itemLabel}` : `de ${totalCount}`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-[13px] text-[#94A3B8]">
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={currentPage <= 1}
            title="Primera página"
            className="p-1.5 rounded-lg border border-[#262D3D] bg-[#181B22] text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#222734] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            title="Página anterior"
            className="p-1.5 rounded-lg border border-[#262D3D] bg-[#181B22] text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#222734] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            title="Página siguiente"
            className="p-1.5 rounded-lg border border-[#262D3D] bg-[#181B22] text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#222734] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage >= totalPages}
            title="Última página"
            className="p-1.5 rounded-lg border border-[#262D3D] bg-[#181B22] text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#222734] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
