import { useLocation } from "react-router-dom"
import { MODULE_ACCESS } from "@/constants/access"
import { useAuth } from "@/context/AuthContext"
import { matchRouteId, routeIdFromPath } from "@/routes/paths"

/** `can(["clientes.crear"])`: la persona tiene al menos uno de esos privilegios. */
export function useCan() {
  return useAuth().can
}

/** Qué puede hacer la persona en el módulo de la URL actual. */
export function useModuleAccess() {
  const can = useCan()
  const { pathname } = useLocation()
  const access = MODULE_ACCESS[routeIdFromPath(pathname)]
  return {
    // El inicio y las direcciones desconocidas no pertenecen a un módulo.
    canView: matchRouteId(pathname) === null || can(access.view),
    canCreate: can(access.create),
    canEdit: can(access.edit),
    canRemove: can(access.remove),
    canChangeStatus: can(access.status),
  }
}
