import { Navigate, useNavigate } from "react-router-dom"
import DashboardPage from "../pages/dashboard/DashboardPage"
import LoginPage from "../pages/LoginPage"
import { useAuth } from "../context/AuthContext"
import { ROUTE_PATHS } from "./paths"
import { useAppNavigate } from "./useAppNavigate"

export function DashboardRoute() {
  const navigate = useAppNavigate()
  return <DashboardPage onNavigate={navigate} />
}

export function LoginRoute() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) return <Navigate to={ROUTE_PATHS.dashboard} replace />

  return (
    <div className="min-h-screen bg-[#0B0D11] font-['Inter',sans-serif] text-[#F1F5F9] flex flex-col">
      <LoginPage
        onLoginSuccess={() => {
          login()
          navigate(ROUTE_PATHS.dashboard, { replace: true })
        }}
      />
    </div>
  )
}
