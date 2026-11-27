import { useParams, useSearchParams } from "react-router-dom"
import { EVENTO_PATHS, ROUTE_PATHS } from "@/routes/paths"
import { emptyEventoEn, eventoToForm } from "./form"
import type { EventoForm, EventoItem } from "./types"
import type { EventoCatalogs } from "./useEventoCatalogs"

/** De dónde parte el formulario: un evento o una fecha (una cotización redirige a su evento). */
export function useEventoOrigen(
  eventos: { items: EventoItem[]; loading: boolean },
  catalogs: EventoCatalogs,
) {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const { cotizaciones } = catalogs

  const origen = {
    evento: id ?? null,
    cotizacion: id ? null : searchParams.get("cotizacion"),
  }
  const evento = eventos.items.find((e) => e.id === origen.evento)
  const cotizacion = cotizaciones.items.find((c) => c.id === origen.cotizacion)

  const getInitialForm = (): EventoForm =>
    evento ? eventoToForm(evento) : emptyEventoEn(searchParams.get("fecha"))

  // Crear un evento de cliente necesita las cotizaciones y sus eventos
  const loading = origen.evento
    ? eventos.loading
    : eventos.loading || cotizaciones.loading

  /** Destino si el registro de origen no existe. */
  const getFallback = (): string | null => {
    if (origen.evento && !evento) return EVENTO_PATHS.list
    // La cotización ya tiene su evento: se edita ese
    if (origen.cotizacion)
      return cotizacion
        ? EVENTO_PATHS.edit(cotizacion.evento_id)
        : ROUTE_PATHS.cotizaciones
    return null
  }

  return { id, loading, getFallback, getInitialForm }
}
