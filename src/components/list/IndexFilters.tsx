import type { ReactNode } from "react"
import { Search, X } from "lucide-react"
import { FilterPopover } from "@/components/FilterPopover"
import { IndexTabs, type IndexTabsProps } from "@/components/IndexTabs"

export interface ActiveFilterPill {
  key: string
  label: string
  onClear: () => void
}

interface IndexFiltersProps extends Partial<IndexTabsProps> {
  searchValue: string
  onSearchChange: (val: string) => void
  activeFilterCount: number
  activeFilterPills: ActiveFilterPill[]
  onResetFilters: () => void
  /** Controles del panel "Filtrar". */
  children?: ReactNode
}

/** Barra del listado: vistas rápidas, búsqueda, filtros y filtros aplicados. */
export function IndexFilters({
  tabs,
  activeTab,
  onTabChange,
  loading,
  searchValue,
  onSearchChange,
  activeFilterCount,
  activeFilterPills,
  onResetFilters,
  children,
}: IndexFiltersProps) {
  return (
    <>
      <div className="p-2 flex flex-col @3xl:flex-row @3xl:items-center gap-2 border-b border-line-soft">
        {tabs && activeTab !== undefined && onTabChange && (
          <div className="min-w-0 @3xl:flex-1">
            <IndexTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={onTabChange}
              loading={loading}
            />
          </div>
        )}
        <div className={`flex items-center gap-2 ${tabs ? "" : "flex-1"}`}>
          <SearchField
            value={searchValue}
            onChange={onSearchChange}
            className={tabs ? "flex-1 @3xl:w-56" : "flex-1"}
          />
          {children && (
            <FilterPopover activeCount={activeFilterCount} onReset={onResetFilters}>
              {children}
            </FilterPopover>
          )}
        </div>
      </div>

      {activeFilterPills.length > 0 && (
        <div
          role="group"
          className="px-3 py-2 flex flex-wrap items-center gap-1.5 border-b border-line-soft"
          aria-label="Filtros aplicados"
        >
          {activeFilterPills.map((pill) => (
            <span
              key={pill.key}
              className="inline-flex items-center gap-1 pl-2.5 pr-1 py-0.5 rounded-lg bg-fill text-xs font-medium text-ink"
            >
              {pill.label}
              <button
                type="button"
                onClick={pill.onClear}
                aria-label={`Quitar filtro ${pill.label}`}
                className="size-6 inline-flex items-center justify-center rounded-md text-ink-muted hover:text-ink hover:bg-line transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand"
              >
                <X size={13} aria-hidden="true" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={onResetFilters}
            className="min-h-6 px-1.5 text-xs font-medium text-brand-ink hover:underline rounded-md cursor-pointer focus-visible:outline-2 focus-visible:outline-brand"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </>
  )
}

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  className: string
}

function SearchField({ value, onChange, className }: SearchFieldProps) {
  return (
    <div className={`relative min-w-0 ${className}`}>
      <Search
        size={15}
        aria-hidden="true"
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar"
        aria-label="Buscar"
        className="field !pl-8 !pr-9 sm:!min-h-8 sm:!py-1"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpiar búsqueda"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 size-6 inline-flex items-center justify-center rounded-md text-ink-muted hover:text-ink hover:bg-hover transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand"
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
