import { Menu } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { PERFIL_PATH } from "@/routes/paths"
import type { RouteId } from "@/types"
import { BrandMark } from "./BrandMark"
import { GlobalSearch } from "./GlobalSearch"
import { UserMenu } from "./UserMenu"

interface TopHeaderProps {
  onToggleSidebar: () => void
  onNavigate: (route: RouteId) => void
}

const BAR_BUTTON =
  "size-9 shrink-0 inline-flex items-center justify-center rounded-lg text-topbar-muted hover:text-topbar-ink hover:bg-topbar-field transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-line"

/** Barra superior: marca · buscador de módulos · cuenta (perfil, tema y cierre de sesión). */
export function TopHeader({ onToggleSidebar, onNavigate }: TopHeaderProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="h-14 shrink-0 flex items-center gap-2 sm:gap-4 px-2 sm:px-3">
      <div className="flex items-center gap-1.5 md:w-[228px] shrink-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Alternar barra lateral"
          className={BAR_BUTTON}
        >
          <Menu size={17} aria-hidden="true" />
        </button>
        <BrandMark />
      </div>
      <div className="flex-1 min-w-0 flex justify-center">
        <GlobalSearch onNavigate={onNavigate} />
      </div>
      <div className="flex items-center justify-end gap-1 lg:w-[228px] shrink-0">
        <UserMenu
          user={user}
          onLogout={logout}
          onProfile={() => void navigate(PERFIL_PATH)}
        />
      </div>
    </header>
  )
}
