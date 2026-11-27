import {
  Home,
  CalendarDays,
  FileText,
  DollarSign,
  Menu,
  type LucideIcon,
} from "lucide-react"
import { MODULE_ACCESS } from "@/constants/access"
import { useCan } from "@/hooks/useAccess"
import type { RouteId } from "@/types"

interface BottomNavigationProps {
  active: RouteId | null
  onNavigate: (route: RouteId) => void
  onOpenMenu: () => void
  isMenuOpen?: boolean
}

interface NavTab {
  id: RouteId
  label: string
  icon: LucideIcon
}

const PRIMARY_TABS: NavTab[] = [
  { id: "dashboard", label: "Inicio", icon: Home },
  { id: "eventos", label: "Eventos", icon: CalendarDays },
  { id: "cotizaciones", label: "Cotizar", icon: FileText },
  { id: "ventas", label: "Ventas", icon: DollarSign },
]

export function BottomNavigation({
  active,
  onNavigate,
  onOpenMenu,
  isMenuOpen = false,
}: BottomNavigationProps) {
  const can = useCan()
  const tabs = PRIMARY_TABS.filter((tab) => can(MODULE_ACCESS[tab.id].view))

  return (
    <nav
      aria-label="Navegación móvil inferior"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-line px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around h-13 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = active === tab.id && !isMenuOpen

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 cursor-pointer ${
                isActive
                  ? "text-brand-ink"
                  : "text-ink-muted hover:text-ink active:scale-95"
              }`}
            >
              <div
                className={`relative p-1 rounded-lg transition-colors ${
                  isActive ? "bg-brand-soft text-brand-ink" : ""
                }`}
              >
                <Icon size={19} aria-hidden="true" />
              </div>
              <span
                className={`text-[11px] tracking-tight mt-0.5 leading-none font-medium ${
                  isActive ? "text-brand-ink font-semibold" : "text-ink-muted"
                }`}
              >
                {tab.label}
              </span>
            </button>
          )
        })}

        {/* Tab 5: Más / Menú completo */}
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Abrir menú completo con todos los módulos"
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 cursor-pointer ${
            isMenuOpen
              ? "text-brand-ink"
              : "text-ink-muted hover:text-ink active:scale-95"
          }`}
        >
          <div
            className={`relative p-1 rounded-lg transition-colors ${
              isMenuOpen ? "bg-brand-soft text-brand-ink" : ""
            }`}
          >
            <Menu size={19} aria-hidden="true" />
          </div>
          <span
            className={`text-[11px] tracking-tight mt-0.5 leading-none font-medium ${
              isMenuOpen ? "text-brand-ink font-semibold" : "text-ink-muted"
            }`}
          >
            Más
          </span>
        </button>
      </div>
    </nav>
  )
}
