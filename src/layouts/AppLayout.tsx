import { Suspense, useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { PageLoader } from "@/components/PageLoader"
import { useAuth } from "@/context/AuthContext"
import { useModuleAccess } from "@/hooks/useAccess"
import { useTheme } from "@/hooks/useTheme"
import NoAccessPage from "@/pages/NoAccessPage"
import { LOGIN_PATH, matchRouteId } from "@/routes/paths"
import { useAppNavigate } from "@/routes/useAppNavigate"
import type { RouteId } from "@/types"
import { BottomNavigation } from "./BottomNavigation"
import { Sidebar } from "./Sidebar"
import { TopHeader } from "./TopHeader"

export default function AppLayout() {
  const { isAuthenticated } = useAuth()
  // Aplica el tema guardado; se cambia en Perfil
  useTheme()
  const { pathname } = useLocation()
  const { canView } = useModuleAccess()
  const navigate = useAppNavigate()

  const [isSidebarVisible, setIsSidebarVisible] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (!isAuthenticated) {
    return <Navigate to={LOGIN_PATH} replace />
  }

  // Fuera de los módulos (p. ej. Perfil) no se resalta ninguno
  const currentRouteId = matchRouteId(pathname)

  const handleNavigate = (route: RouteId) => {
    setIsMobileMenuOpen(false)
    navigate(route)
  }

  const handleToggleSidebar = () => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setIsMobileMenuOpen((prev) => !prev)
    } else {
      setIsSidebarVisible((prev) => !prev)
    }
  }

  return (
    <div className="flex flex-col h-dvh bg-topbar font-sans text-ink text-[13px] antialiased overflow-hidden">
      <TopHeader onToggleSidebar={handleToggleSidebar} onNavigate={handleNavigate} />
      <div className="flex-1 min-h-0 flex overflow-hidden bg-canvas rounded-t-xl">
        <Sidebar
          active={currentRouteId}
          onNavigate={handleNavigate}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          isDesktopVisible={isSidebarVisible}
        />
        <div className="flex-1 overflow-hidden flex flex-col min-w-0 pb-16 md:pb-0">
          <Suspense fallback={<PageLoader />}>
            {canView ? <Outlet /> : <NoAccessPage />}
          </Suspense>
        </div>
      </div>
      <BottomNavigation
        active={currentRouteId}
        onNavigate={handleNavigate}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
        isMenuOpen={isMobileMenuOpen}
      />
    </div>
  )
}
