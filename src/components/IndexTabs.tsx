export interface IndexTabItem {
  id: string
  label: string
  count?: number
}

export interface IndexTabsProps {
  tabs: IndexTabItem[]
  activeTab: string
  onTabChange: (id: string) => void
}

export function IndexTabs({ tabs, activeTab, onTabChange }: IndexTabsProps) {
  return (
    <div
      className="flex items-center gap-1 border-b border-[#262D3D] overflow-x-auto scrollbar-none scroll-smooth"
      role="tablist"
      aria-label="Vistas Rápidas"
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
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap -mb-[1px] ${
              isActive
                ? "border-[#7C3AED] text-[#F1F5F9] font-semibold"
                : "border-transparent text-[#94A3B8] hover:text-[#F1F5F9] hover:border-[#333C4E]"
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold tabular-nums transition-colors ${
                  isActive
                    ? "bg-[#7C3AED]/20 text-[#A78BFA]"
                    : "bg-[#181B22] text-[#64748B]"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
