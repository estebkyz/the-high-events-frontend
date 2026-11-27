import { Navigate } from "react-router-dom"
import { useCan } from "@/hooks/useAccess"
import { firstAllowedRoute } from "@/layouts/navigation"
import { ROUTE_PATHS } from "./paths"

/** Inicio: el primer módulo del menú que la persona puede ver. */
export function HomeRedirect() {
  return <Navigate to={ROUTE_PATHS[firstAllowedRoute(useCan())]} replace />
}
