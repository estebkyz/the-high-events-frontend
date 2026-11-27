import { ArrowLeft } from "lucide-react"
import { Navigate, useNavigate } from "react-router-dom"
import { FormSkeleton } from "@/components/form/FormSkeleton"
import { useToast } from "@/components/Toast"
import { useCrudActions } from "@/hooks/useCrudActions"
import { useCrudResource } from "@/hooks/useCrudResource"

import { EVENTO_PATHS } from "@/routes/paths"
import { EventoFormContent } from "./components/EventoFormContent"
import { EVENTO_LABEL } from "./constants"
import type { EventoForm, EventoItem } from "./types"
import { useEventoCatalogs } from "./useEventoCatalogs"
import { useEventoOrigen } from "./useEventoOrigen"

/**
 * Crear (`/eventos/nuevo`, con `?fecha=YYYY-MM-DD`; `?cotizacion=id` abre su evento) y editar
 * (`/eventos/:id/editar`). Un evento de cliente se crea completando el evento de su cotización aceptada.
 */
export default function EventoFormPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const eventos = useCrudResource<EventoItem>({ endpoint: "/eventos" })
  const actions = useCrudActions(eventos, EVENTO_LABEL, (e) => e.nombre)
  const catalogs = useEventoCatalogs()
  const origen = useEventoOrigen(eventos, catalogs)
  const { id } = origen

  const title = id ? "Editar evento" : "Crear evento"
  const goToList = () => void navigate(EVENTO_PATHS.list)

  const handleUpdate = async (eventoId: string, form: EventoForm) => {
    const saved = await actions.update(eventoId, form)
    if (!saved) return
    saved.avisos?.forEach((aviso) => toast.info(aviso))
    goToList()
  }

  const handleCreate = async (form: EventoForm) => {
    // El evento de cliente ya existe desde su cotización: se completa ese registro
    if (form.id) return handleUpdate(form.id, form)
    if (await actions.create(form)) goToList()
  }

  const fallback = origen.loading ? null : origen.getFallback()
  if (fallback) return <Navigate to={fallback} replace />

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1024px] mx-auto w-full px-4 py-5 sm:px-6 space-y-4">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={goToList}
              aria-label="Volver a Eventos"
              title="Volver a Eventos"
              className="icon-btn hover:!bg-fill"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <h1 className="text-[20px] leading-7 font-semibold text-ink">{title}</h1>
          </div>
          {origen.loading ? (
            <FormSkeleton />
          ) : (
            <EventoFormContent
              eventoId={id}
              initialForm={origen.getInitialForm()}
              eventos={eventos.items}
              catalogs={catalogs}
              submitLabel={id ? "Guardar cambios" : "Crear evento"}
              saving={actions.saving}
              onSave={(form) => void (id ? handleUpdate(id, form) : handleCreate(form))}
              onCancel={goToList}
            />
          )}
        </div>
      </main>
    </div>
  )
}
