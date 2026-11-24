import { Suspense, useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { PageLoader } from "@/components/PageLoader"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/hooks/useTheme"
import { LOGIN_PATH, routeIdFromPath } from "@/routes/paths"
import { useAppNavigate } from "@/routes/useAppNavigate"
import type { RouteId } from "@/types"
import { BottomNavigation } from "./BottomNavigation"
import { Sidebar } from "./Sidebar"
import { TopHeader } from "./TopHeader"

export default function AppLayout() {
  const { isAuthenticated } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const navigate = useAppNavigate()

  const [isSidebarVisible, setIsSidebarVisible] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (!isAuthenticated) {
    return <Navigate to={LOGIN_PATH} replace />
  }

  const currentRouteId = routeIdFromPath(pathname)

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
    <div className="flex h-screen bg-[#111318] font-['Inter',sans-serif] overflow-hidden text-[#F1F5F9] antialiased">
      <Sidebar
        active={currentRouteId}
        onNavigate={handleNavigate}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        isDesktopVisible={isSidebarVisible}
      />

      <div className="flex-1 overflow-hidden flex flex-col min-w-0">
        <TopHeader
          onToggleSidebar={handleToggleSidebar}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />

        <div className="flex-1 overflow-hidden flex flex-col min-w-0 pb-16 md:pb-0">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
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
