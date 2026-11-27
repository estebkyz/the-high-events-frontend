import { useCrudResource } from "@/hooks/useCrudResource"
import type { DisponibilidadEquipo, RangoFechas } from "./types"

/**
 * Disponibilidad de los equipos en un rango (`YYYY-MM-DDTHH:mm`); sin rango, en este
 * momento. `eventoId`: el evento que se edita no choca consigo mismo.
 */
export function useDisponibilidad(rango: RangoFechas | null, eventoId?: string) {
  const params = new URLSearchParams({
    ...rango,
    ...(eventoId && { evento: eventoId }),
  })
  const { items, refresh } = useCrudResource<DisponibilidadEquipo>({
    endpoint: `/equipos/disponibilidad?${params.toString()}`,
  })
  return {
    get: (equipoId: string) => items.find((d) => d.id === equipoId),
    refresh,
  }
}
