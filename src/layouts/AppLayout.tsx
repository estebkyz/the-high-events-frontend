import { Suspense, useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { BottomNavigation } from "../components/BottomNavigation"
import TopHeader from "../components/TopHeader"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../hooks/useTheme"
import { LOGIN_PATH, routeIdFromPath } from "../routes/paths"
import { useAppNavigate } from "../routes/useAppNavigate"

function PageLoader() {
  return (
    <div
      className="flex-1 flex items-center justify-center text-xs text-[#94A3B8]"
      role="status"
    >
      Cargando…
    </div>
  )
}

export default function AppLayout() {
  const { isAuthenticated, logout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const navigate = useAppNavigate()

  const [isSidebarVisible, setIsSidebarVisible] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (!isAuthenticated) {
    return <Navigate to={LOGIN_PATH} replace />
  }

  const currentRouteId = routeIdFromPath(pathname)

  return (
    <div className="flex h-screen bg-[#111318] font-['Inter',sans-serif] overflow-hidden text-[#F1F5F9] antialiased">
      {/* Sidebar: static on desktop (if visible), overlay drawer on mobile */}
      <Sidebar
        active={currentRouteId}
        onNavigate={(route) => {
          setIsMobileMenuOpen(false)
          navigate(route)
        }}
        onLogout={logout}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        isDesktopVisible={isSidebarVisible}
      />

      <div className="flex-1 overflow-hidden flex flex-col min-w-0">
        <TopHeader
          onToggleSidebar={() => {
            // In mobile toggle the mobile overlay, in desktop toggle the sidebar column
            if (window.innerWidth < 768) {
              setIsMobileMenuOpen((prev) => !prev)
            } else {
              setIsSidebarVisible((prev) => !prev)
            }
          }}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />

        <div className="flex-1 overflow-hidden flex flex-col min-w-0 pb-16 md:pb-0">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Shopify Thumb-Zone Pattern) */}
      <BottomNavigation
        active={currentRouteId}
        onNavigate={(route) => {
          setIsMobileMenuOpen(false)
          navigate(route)
        }}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
        isMenuOpen={isMobileMenuOpen}
      />
    </div>
  )
}
