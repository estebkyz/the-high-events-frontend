import { useState } from "react"
import { ChevronDown, LayoutGrid, X, type LucideIcon } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import type { RouteId } from "@/types"
import { NAV_SECTIONS, type NavSection } from "./navigation"
import { UserMenu } from "./UserMenu"

interface SidebarProps {
  active: RouteId
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
  const { user, logout } = useAuth()
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
          className="md:hidden fixed inset-0 z-40 bg-black/40"
        />
      )}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-[260px] md:w-[240px] shrink-0 bg-white dark:bg-[#111318] border-r border-[#CBD5E1] dark:border-[#2D3748] flex flex-col h-screen transition-transform duration-300 ${
          isMobileOpen
            ? "translate-x-0 shadow-2xl"
            : "max-md:invisible -translate-x-full md:translate-x-0"
        } ${isDesktopVisible ? "" : "md:hidden"}`}
      >
        <div className="px-4 py-4 border-b border-[#CBD5E1] dark:border-[#2D3748] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              aria-hidden="true"
              className="w-8 h-8 rounded-lg bg-[#7C3AED] flex items-center justify-center font-bold text-white text-xs"
            >
              TH
            </div>
            <p className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
              The High
              <span className="block text-[10px] text-[#6D28D9] dark:text-[#A78BFA] tracking-widest uppercase">
                Events
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Cerrar menú lateral"
            className="md:hidden p-1.5 rounded-lg text-[#475569] dark:text-[#94A3B8] cursor-pointer"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <nav
          aria-label="Principal"
          className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto"
        >
          <NavLinkButton
            icon={LayoutGrid}
            label="Dashboard"
            isActive={active === "dashboard"}
            onClick={() => onNavigate("dashboard")}
          />
          <div className="h-px bg-[#CBD5E1] dark:bg-[#2D3748] my-2 mx-1" />
          {NAV_SECTIONS.map((section) => (
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

        <UserMenu user={user} onLogout={logout} />
      </aside>
    </>
  )
}

interface SidebarSectionProps {
  section: NavSection
  active: RouteId
  isOpen: boolean
  onToggle: () => void
  onNavigate: (route: RouteId) => void
}

function SidebarSection({
  section,
  active,
  isOpen,
  onToggle,
  onNavigate,
}: SidebarSectionProps) {
  const { icon: Icon, title, items } = section
  const hasActive = items.some((item) => item.route === active)

  return (
    <div className="space-y-0.5">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen || hasActive}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-[#F1F5F9] dark:hover:bg-[#1A1D23] transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2.5 min-w-0 text-[13.5px] font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
          <Icon
            size={18}
            aria-hidden="true"
            className={`shrink-0 ${
              hasActive
                ? "text-[#6D28D9] dark:text-[#A78BFA]"
                : "text-[#334155] dark:text-[#94A3B8]"
            }`}
          />
          <span className="truncate">{title}</span>
        </span>
        <ChevronDown
          size={15}
          aria-hidden="true"
          className={`text-[#475569] dark:text-[#94A3B8] shrink-0 transition-transform ${
            isOpen || hasActive ? "" : "-rotate-90"
          }`}
        />
      </button>
      {(isOpen || hasActive) && (
        <div className="pl-2.5 ml-4.5 space-y-1 border-l border-[#CBD5E1] dark:border-[#2D3748]">
          {items.map((item) => (
            <NavLinkButton
              key={item.route}
              icon={item.icon}
              label={item.label}
              isActive={item.route === active}
              onClick={() => onNavigate(item.route)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface NavLinkButtonProps {
  icon: LucideIcon
  label: string
  isActive: boolean
  onClick: () => void
}

function NavLinkButton({ icon: Icon, label, isActive, onClick }: NavLinkButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-left transition-colors cursor-pointer ${
        isActive
          ? "bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#7C3AED]/20 dark:text-[#C4B5FD] font-semibold"
          : "text-[#334155] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E232D] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] font-medium"
      }`}
    >
      <Icon size={17} aria-hidden="true" className="shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  )
}
