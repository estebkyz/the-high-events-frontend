import { ChevronRight } from "lucide-react"
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { PageLoader } from "@/components/PageLoader"
import { useCrudActions } from "@/hooks/useCrudActions"
import { useCrudResource } from "@/hooks/useCrudResource"
import { EVENTO_PATHS, ROUTE_PATHS } from "@/routes/paths"
import { EventoFormContent } from "./components/EventoFormContent"
import { EVENTO_LABEL } from "./constants"
import { emptyEventoEn, eventoDesdeCotizacion, eventoToForm } from "./form"
import type { EventoForm, EventoItem } from "./types"
import { useEventoCatalogs } from "./useEventoCatalogs"

/**
 * Crear (`/eventos/nuevo?fecha=YYYY-MM-DD` o `?cotizacion=id`) y editar
 * (`/eventos/:id/editar`).
 */
export default function EventoFormPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const eventos = useCrudResource<EventoItem>({ endpoint: "/eventos" })
  const actions = useCrudActions(eventos, EVENTO_LABEL, (e) => e.nombre)

  const catalogs = useEventoCatalogs()
  const cotizacionId = id ? null : searchParams.get("cotizacion")

  const evento = id ? eventos.items.find((e) => e.id === id) : undefined
  const title = id ? "Editar evento" : "Crear evento"
  const goToList = () => void navigate(EVENTO_PATHS.list)

  const handleSave = async (form: EventoForm) => {
    const saved = id ? await actions.update(id, form) : await actions.create(form)
    if (saved) goToList()
  }

  if (id && eventos.loading) return <PageLoader />
  if (id && !evento) return <Navigate to={EVENTO_PATHS.list} replace />
  if (cotizacionId && (catalogs.cotizaciones.loading || catalogs.clientes.loading)) {
    return <PageLoader />
  }

  const cotizacion = catalogs.cotizaciones.items.find((c) => c.id === cotizacionId)
  const initialForm = evento
    ? eventoToForm(evento)
    : cotizacion
      ? eventoDesdeCotizacion(cotizacion)
      : emptyEventoEn(searchParams.get("fecha"))

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 sm:p-8 max-w-6xl mx-auto w-full">
        <nav
          aria-label="Ruta"
          className="flex items-center gap-2 text-xs text-[#94A3B8] mb-3"
        >
          <button
            type="button"
            onClick={goToList}
            className="hover:text-[#F8FAFC] transition-colors cursor-pointer"
          >
            Eventos
          </button>
          <ChevronRight size={14} aria-hidden="true" />
          <span aria-current="page" className="text-[#F8FAFC] font-medium">
            {title}
          </span>
        </nav>
        <h1 className="text-[24px] font-bold text-[#F8FAFC] tracking-tight mb-6">
          {title}
        </h1>
        <EventoFormContent
          initialForm={initialForm}
          catalogs={catalogs}
          submitLabel={id ? "Guardar cambios" : "Crear evento"}
          saving={actions.saving}
          onSave={(form) => void handleSave(form)}
          onCancel={goToList}
          onCreateCotizacion={() => void navigate(ROUTE_PATHS.cotizaciones)}
        />
      </main>
    </div>
  )
}
