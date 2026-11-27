import { useState } from "react"
import { ChevronRight, X, type LucideIcon } from "lucide-react"
import { useCan } from "@/hooks/useAccess"
import type { RouteId } from "@/types"
import { allowedNavigation, type NavSection } from "./navigation"
import { preloadPage } from "@/routes/pages"

interface SidebarProps {
  active: RouteId | null
  onNavigate: (route: RouteId) => void
  isMobileOpen: boolean
  onCloseMobile: () => void
  isDesktopVisible: boolean
}

export function Sidebar({
  active,
  onNavigate,
  isMobileOpen,
  onCloseMobile,
  isDesktopVisible,
}: SidebarProps) {
  const { home, sections } = allowedNavigation(useCan())
  const [collapsed, setCollapsed] = useState<string[]>([])

  const toggleSection = (title: string) =>
    setCollapsed((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    )

  return (
    <>
      {isMobileOpen && (
        <div
          aria-hidden="true"
          onClick={onCloseMobile}
          className="md:hidden fixed inset-0 z-40 bg-overlay"
        />
      )}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-[272px] md:w-[240px] shrink-0 bg-nav flex flex-col transition-transform duration-200 ${
          isMobileOpen
            ? "translate-x-0 shadow-modal"
            : "max-md:invisible -translate-x-full md:translate-x-0"
        } ${isDesktopVisible ? "" : "md:hidden"}`}
      >
        <div className="md:hidden h-14 pl-5 pr-3 flex items-center justify-between shrink-0">
          <p className="text-[14px] font-semibold text-ink">Menú</p>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Cerrar menú lateral"
            className="icon-btn"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Principal" className="flex-1 px-3 pb-4 md:pt-3 overflow-y-auto">
          {home && (
            <NavLinkButton
              icon={home.icon}
              label={home.label}
              isActive={active === home.route}
              onClick={() => onNavigate(home.route)}
              onPreload={() => preloadPage(home.route)}
            />
          )}
          {sections.map((section) => (
            <SidebarSection
              key={section.title}
              section={section}
              active={active}
              isOpen={!collapsed.includes(section.title)}
              onToggle={() => toggleSection(section.title)}
              onNavigate={onNavigate}
            />
          ))}
        </nav>
      </aside>
    </>
  )
}

interface SidebarSectionProps {
  section: NavSection
  active: RouteId | null
  isOpen: boolean
  onToggle: () => void
  onNavigate: (route: RouteId) => void
}

/** Grupo plegable; el que contiene la pantalla actual no se puede plegar. */
function SidebarSection({
  section: { title, items },
  active,
  isOpen,
  onToggle,
  onNavigate,
}: SidebarSectionProps) {
  const isExpanded = isOpen || items.some((item) => item.route === active)

  return (
    <div className="mt-2.5">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="w-full min-h-7 px-2 flex items-center gap-1 rounded-lg text-xs font-medium text-ink-muted text-left hover:text-ink transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand"
      >
        <span className="truncate">{title}</span>
        <ChevronRight
          size={13}
          aria-hidden="true"
          className={`shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
        />
      </button>
      {isExpanded &&
        items.map((item) => (
          <NavLinkButton
            key={item.route}
            icon={item.icon}
            label={item.label}
            isActive={item.route === active}
            onClick={() => onNavigate(item.route)}
            onPreload={() => preloadPage(item.route)}
          />
        ))}
    </div>
  )
}

interface NavLinkButtonProps {
  icon: LucideIcon
  label: string
  isActive: boolean
  onClick: () => void
  /** Al apuntar o enfocar: adelanta la descarga de la página. */
  onPreload: () => void
}

function NavLinkButton({
  icon: Icon,
  label,
  isActive,
  onClick,
  onPreload,
}: NavLinkButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onPointerEnter={onPreload}
      onFocus={onPreload}
      aria-current={isActive ? "page" : undefined}
      className={`w-full min-h-10 md:min-h-[30px] px-2 mb-px flex items-center gap-2.5 rounded-lg text-[13px] text-left transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand ${
        isActive
          ? "bg-nav-active text-brand-ink font-semibold shadow-[0_1px_0_0_rgba(26,26,26,0.08)]"
          : "text-ink-soft font-medium hover:bg-nav-active/70 hover:text-ink"
      }`}
    >
      <Icon
        size={16}
        strokeWidth={isActive ? 2.25 : 1.9}
        aria-hidden="true"
        className="shrink-0"
      />
      <span className="truncate">{label}</span>
    </button>
  )
}
