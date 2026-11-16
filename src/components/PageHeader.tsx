import React from "react"
import { Search } from "lucide-react"
import { FilterPopover } from "./FilterPopover"

export interface PageHeaderProps {
  title: string
  actionLabel?: string
  onAction?: () => void
  searchValue?: string
  onSearchChange?: (val: string) => void
  searchPlaceholder?: string
  filterPopoverChildren?: React.ReactNode
  children?: React.ReactNode
  activeFilterCount?: number
  onResetFilters?: () => void
  extraControls?: React.ReactNode
}

export function PageHeader({
  title,
  actionLabel,
  onAction,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar",
  filterPopoverChildren,
  children,
  activeFilterCount = 0,
  onResetFilters,
  extraControls,
}: PageHeaderProps) {
  const filterContent = filterPopoverChildren ?? children

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* ── Lado izquierdo: Título + Botón de acción primario ── */}
      <div className="flex items-center gap-3">
        <h1 className="text-[22px] font-bold text-[#F1F5F9] tracking-tight">
          {title}
        </h1>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="px-3.5 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus:outline-none text-white text-[13px] font-semibold transition-all cursor-pointer shadow-sm shadow-[#7C3AED]/25"
          >
            {actionLabel}
          </button>
        )}
      </div>

      {/* ── Lado derecho: Buscador + Filtros + Controles adicionales ── */}
      <div className="flex flex-wrap items-center gap-2">
        {extraControls}

        {onSearchChange && (
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="pl-8 pr-3 h-[36px] bg-[#1A1D23] rounded-xl text-xs text-[#F1F5F9] placeholder-[#94A3B8]/70 focus:outline-none focus:border-[#7C3AED] focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40 w-52 sm:w-64 transition-colors"
            />
          </div>
        )}

        {filterContent && (
          <FilterPopover
            activeCount={activeFilterCount}
            onReset={onResetFilters}
          >
            {filterContent}
          </FilterPopover>
        )}
      </div>
    </div>
  )
}
