import { useEffect, useEffectEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"

/**
 * Consume una sola vez los datos enviados con `navigate(ruta, { state })`.
 * Limpia el estado para que recargar o volver atrás no reabra el formulario.
 */
export function useNavigationState<T extends object>(
  isExpected: (state: object) => state is T,
  onArrive: (state: T) => void,
): void {
  const { state, pathname } = useLocation()
  const navigate = useNavigate()

  const consume = useEffectEvent((value: T) => {
    void navigate(pathname, { replace: true, state: null })
    onArrive(value)
  })

  useEffect(() => {
    if (state && typeof state === "object" && isExpected(state)) consume(state)
  }, [state, isExpected])
}
