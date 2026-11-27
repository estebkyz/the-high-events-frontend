import { Skeleton } from "@/components/Skeleton"

export interface IndexTabItem {
  id: string
  label: string
  count?: number
}

export interface IndexTabsProps {
  tabs: IndexTabItem[]
  activeTab: string
  onTabChange: (id: string) => void
  /** Los conteos aún no llegan: un cero se leería como real. */
  loading?: boolean
}

export function IndexTabs({ tabs, activeTab, onTabChange, loading }: IndexTabsProps) {
  return (
    <div
      className="flex items-center gap-1 overflow-x-auto [scrollbar-width:none] p-0.5"
      role="tablist"
      aria-label="Vistas rápidas"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={`min-h-8 px-3 inline-flex items-center gap-1.5 rounded-lg text-xs whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand ${
              isActive
                ? "bg-fill text-ink font-semibold"
                : "text-ink-muted font-medium hover:bg-hover hover:text-ink"
            }`}
          >
            {tab.label}
            {loading && tab.count !== undefined && <Skeleton className="h-3 w-4" />}
            {!loading && typeof tab.count === "number" && (
              <span className={`tabular-nums ${isActive ? "text-brand-ink" : ""}`}>
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
