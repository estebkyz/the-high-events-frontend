import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import LoginPage from "@/pages/LoginPage"
import { ROUTE_PATHS } from "./paths"

/** `/login`: si ya hay sesión, redirige al dashboard. */
export function LoginRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to={ROUTE_PATHS.dashboard} replace /> : <LoginPage />
}
