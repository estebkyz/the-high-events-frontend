import type { ReactNode } from "react"
import { Search, X } from "lucide-react"
import { FilterPopover } from "./FilterPopover"

export interface ActiveFilterPill {
  key: string
  label: string
  onClear: () => void
}

export interface PageHeaderProps {
  title: string
  actionLabel?: string
  onAction?: () => void
  searchValue?: string
  onSearchChange?: (val: string) => void
  searchPlaceholder?: string
  children?: ReactNode
  activeFilterCount?: number
  onResetFilters?: () => void
  activeFilterPills?: ActiveFilterPill[]
  extraControls?: ReactNode
}

export function PageHeader({
  title,
  actionLabel,
  onAction,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar",
  children,
  activeFilterCount = 0,
  onResetFilters,
  activeFilterPills = [],
  extraControls,
}: PageHeaderProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* ── Lado izquierdo: Título + Botón de acción primario ── */}
        <div className="flex items-center gap-3">
          <h1 className="text-[22px] font-bold text-[#F1F5F9] tracking-tight">{title}</h1>
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

        {/* ── Lado derecho: Buscador estilo Shopify + Botón Filtrar + Controles adicionales ── */}
        <div className="flex flex-wrap items-center gap-2">
          {extraControls}

          {onSearchChange && (
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchValue ?? ""}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="pl-8 pr-8 h-[36px] bg-[#181B22] border border-[#262D3D] hover:border-[#3B455A] rounded-xl text-xs text-[#F1F5F9] placeholder-[#94A3B8]/70 focus:outline-none focus:border-[#7C3AED] focus-visible:ring-2 focus-visible:ring-[#7C3AED]/40 w-52 sm:w-64 transition-colors"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  title="Limpiar búsqueda"
                  aria-label="Limpiar búsqueda"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#262D3D] transition-colors cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          )}

          {children && (
            <FilterPopover activeCount={activeFilterCount} onReset={onResetFilters}>
              {children}
            </FilterPopover>
          )}
        </div>
      </div>

      {/* ── Píldoras de filtros activos estilo Shopify Polaris ── */}
      {activeFilterPills.length > 0 && (
        <div
          className="flex flex-wrap items-center gap-1.5 text-xs pt-0.5"
          aria-label="Filtros aplicados"
        >
          {activeFilterPills.map((pill) => (
            <span
              key={pill.key}
              className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg bg-[#181B22] border border-[#2D3748] text-[#CBD5E1] text-[11.5px] font-medium"
            >
              <span>{pill.label}</span>
              <button
                type="button"
                onClick={pill.onClear}
                aria-label={`Quitar filtro ${pill.label}`}
                className="p-0.5 rounded hover:bg-[#262D3D] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
              >
                <X size={11} />
              </button>
            </span>
          ))}
          {onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-[11.5px] text-[#A78BFA] hover:text-[#C4B5FD] hover:underline px-1.5 py-0.5 cursor-pointer font-medium"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  )
}
