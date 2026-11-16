import React from "react"
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  DollarSign,
  Menu,
} from "lucide-react"
import type { RouteId } from "../types"

interface BottomNavigationProps {
  active: RouteId
  onNavigate: (route: RouteId) => void
  onOpenMenu: () => void
  isMenuOpen?: boolean
}

interface NavTab {
  id: RouteId
  label: string
  icon: React.ElementType
}

const PRIMARY_TABS: NavTab[] = [
  { id: "dashboard", label: "Inicio", icon: LayoutDashboard },
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
  return (
    <nav
      aria-label="Navegación móvil inferior"
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#111318]/95 backdrop-blur-lg border-t border-[#262D3D] px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around h-13 max-w-lg mx-auto">
        {PRIMARY_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = active === tab.id && !isMenuOpen

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              aria-label={tab.label}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 cursor-pointer ${
                isActive
                  ? "text-[#A78BFA]"
                  : "text-[#94A3B8] hover:text-[#F1F5F9] active:scale-95"
              }`}
            >
              <div
                className={`relative p-1 rounded-lg transition-colors ${
                  isActive ? "bg-[#7C3AED]/20 text-[#A78BFA]" : ""
                }`}
              >
                <Icon size={19} aria-hidden="true" />
              </div>
              <span
                className={`text-[10px] tracking-tight mt-0.5 leading-none font-medium ${
                  isActive ? "text-[#A78BFA] font-semibold" : "text-[#94A3B8]"
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
              ? "text-[#A78BFA]"
              : "text-[#94A3B8] hover:text-[#F1F5F9] active:scale-95"
          }`}
        >
          <div
            className={`relative p-1 rounded-lg transition-colors ${
              isMenuOpen ? "bg-[#7C3AED]/20 text-[#A78BFA]" : ""
            }`}
          >
            <Menu size={19} aria-hidden="true" />
          </div>
          <span
            className={`text-[10px] tracking-tight mt-0.5 leading-none font-medium ${
              isMenuOpen ? "text-[#A78BFA] font-semibold" : "text-[#94A3B8]"
            }`}
          >
            Más
          </span>
        </button>
      </div>
    </nav>
  )
}
