import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import type { RouteId } from "../types"
import { ROUTE_PATHS } from "./paths"

export function useAppNavigate() {
  const navigate = useNavigate()
  return useCallback(
    (route: RouteId) => navigate(ROUTE_PATHS[route]),
    [navigate],
  )
}
