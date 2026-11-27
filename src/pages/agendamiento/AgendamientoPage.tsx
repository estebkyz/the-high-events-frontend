import { useMemo, useState, type SubmitEvent } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { PageHeader } from "@/components/PageHeader"
import { useToast } from "@/components/Toast"
import { FilterSelect } from "@/components/list/FilterField"
import { IndexCard } from "@/components/list/IndexCard"
import { IndexFilters } from "@/components/list/IndexFilters"
import { ListPage } from "@/components/list/ListPage"
import { useCrudActions } from "@/hooks/useCrudActions"
import { useCrudResource } from "@/hooks/useCrudResource"
import { useListFilters } from "@/hooks/useListFilters"
import { useRecordModal } from "@/hooks/useRecordModal"
import type { ClienteItem } from "@/pages/clientes/types"
import type { EmpleadoItem } from "@/pages/empleados/types"
import type { EquipoItem } from "@/pages/equipos/types"
import { rutaDocumento } from "@/pages/eventos/documentos"
import { EventoDetailDrawer } from "@/pages/eventos/drawers/EventoDetailDrawer"
import { EMPTY_EVENTO } from "@/pages/eventos/form"
import type { EventoForm, EventoItem } from "@/pages/eventos/types"
import { EVENTO_PATHS, ROUTE_PATHS } from "@/routes/paths"
import { todayISO } from "@/utils/format"
import { matchesSearch, withAllOption } from "@/utils/list"
import { buildAgenda, reunionToCotizacion } from "./agenda"
import { AgendaSidebar } from "./components/AgendaSidebar"
import { AgendamientoCalendar } from "./components/AgendamientoCalendar"
import {
  AGENDA_FILTERS,
  ESTADO_FILTER_OPTIONS,
  REUNION_LABEL,
  TIPO_FILTER_OPTIONS,
} from "./constants"
import { AgendamientoDetailDrawer } from "./drawers/AgendamientoDetailDrawer"
import { AgendamientoFormDrawer } from "./drawers/AgendamientoFormDrawer"
import { agendaToForm, agendaToPayload, EMPTY_AGENDA, validateAgenda } from "./form"
import type {
  AgendaEntry,
  AgendaEvent,
  AgendaForm,
  CalendarMonth,
  EstadoAgendamiento,
} from "./types"
import { findConflict, formatMonth, parseISO, shiftMonth } from "./utils"
import { MODULE_ACCESS } from "@/constants/access"
import { useCan } from "@/hooks/useAccess"

/** Calendario de reuniones y eventos (`?fecha=YYYY-MM-DD` abre ese día). */
export default function AgendamientoPage() {
  const toast = useToast()
  const navigate = useNavigate()
  const can = useCan()
  const [searchParams] = useSearchParams()
  const reuniones = useCrudResource<AgendaEvent>({ endpoint: "/agendamientos" })
  const eventos = useCrudResource<EventoItem>({ endpoint: "/eventos" })
  const clientes = useCrudResource<ClienteItem>({ endpoint: "/clientes" })
  const empleados = useCrudResource<EmpleadoItem>({ endpoint: "/empleados" })
  const equipos = useCrudResource<EquipoItem>({ endpoint: "/equipos" })
  const actions = useCrudActions(reuniones, REUNION_LABEL, (ev) => ev.title)
  const filters = useListFilters(AGENDA_FILTERS)
  const modal = useRecordModal<AgendaEvent, AgendaForm>(reuniones.items, EMPTY_AGENDA)
  const eventoModal = useRecordModal<EventoItem, EventoForm>(eventos.items, EMPTY_EVENTO)
  const [selectedDate, setSelectedDate] = useState(
    () => searchParams.get("fecha") ?? todayISO(),
  )
  const [month, setMonth] = useState<CalendarMonth>(() => parseISO(selectedDate))

  const agenda = useMemo(
    () => buildAgenda(reuniones.items, eventos.items),
    [reuniones.items, eventos.items],
  )

  const { search, matches } = filters
  const filteredData = useMemo(
    () =>
      agenda.filter(
        (ev) =>
          matches("tipo", ev.tipo_agendamiento) &&
          matches("estado", ev.estado) &&
          matchesSearch(search, [ev.title, ev.client, ev.venue, ev.responsable]),
      ),
    [agenda, search, matches],
  )
  const delMes = filteredData.filter(
    (ev) => ev.year === month.year && ev.month === month.month,
  )

  const handleSelectDate = (iso: string) => {
    setSelectedDate(iso)
    setMonth(parseISO(iso))
  }

  const openCreate = (iso: string) => {
    handleSelectDate(iso)
    modal.openCreate({ dateISO: iso })
  }
  const openEdit = (item: AgendaEvent) => modal.openEdit(item, agendaToForm(item))

  const openEvento = (id: string) => {
    const evento = eventos.items.find((e) => e.id === id)
    if (!evento) return
    modal.close()
    eventoModal.openView(evento)
  }

  const openEntry = (entry: AgendaEntry) => {
    const reunion = reuniones.items.find((r) => r.id === entry.id)
    if (reunion) modal.openView(reunion)
    else if (entry.evento_id) openEvento(entry.evento_id)
  }

  const handleStatusChange = (id: string, estado: EstadoAgendamiento) =>
    actions.changeStatus(id, { estado }, estado)

  const handleDelete = async (item: AgendaEvent) => {
    if (await actions.remove(item)) modal.close()
  }

  const { editForm } = modal
  const conflict = findConflict(
    agenda,
    editForm.dateISO,
    editForm.time,
    modal.selected?.id,
  )

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const error =
      validateAgenda(editForm) ??
      (conflict ? `Ya existe "${conflict.title}" en esa fecha y hora` : null)
    if (error) {
      toast.error(error)
      return
    }
    const data = agendaToPayload(editForm)
    const saved = modal.selected
      ? await actions.update(modal.selected.id, data)
      : await actions.create(data)
    if (!saved) return
    handleSelectDate(editForm.dateISO)
    modal.close()
  }

  return (
    <ListPage
      overlays={
        <>
          <AgendamientoDetailDrawer
            isOpen={modal.mode === "view"}
            item={modal.selected}
            onClose={modal.close}
            onEdit={openEdit}
            onStatusChange={handleStatusChange}
            onOpenEvento={openEvento}
            onCreateCotizacion={(item) =>
              void navigate(ROUTE_PATHS.cotizaciones, {
                state: reunionToCotizacion(item),
              })
            }
            onDelete={(item) => void handleDelete(item)}
          />
          <EventoDetailDrawer
            isOpen={eventoModal.mode === "view"}
            item={eventoModal.selected}
            onClose={eventoModal.close}
            onEdit={
              can(MODULE_ACCESS.eventos.edit)
                ? (item) => void navigate(EVENTO_PATHS.edit(item.id))
                : undefined
            }
            equipos={equipos.items}
            onOpenDocumento={(doc) =>
              void navigate(rutaDocumento(doc), { state: { openId: doc.id } })
            }
          />
          <AgendamientoFormDrawer
            isOpen={modal.mode === "form"}
            isEditing={modal.isEditing}
            saving={actions.saving}
            form={editForm}
            setForm={modal.setEditForm}
            onClose={modal.close}
            onSubmit={(e) => void handleSubmit(e)}
            clientes={clientes.items}
            empleados={empleados.items}
            conflict={conflict}
          />
        </>
      }
    >
      <PageHeader
        title="Agendamiento"
        actionLabel="Agendar"
        onAction={() => openCreate(selectedDate)}
      />

      <IndexCard>
        <IndexFilters {...filters.indexProps}>
          <FilterSelect
            label="Tipo"
            value={filters.get("tipo")}
            onChange={(val) => filters.set("tipo", val)}
            options={withAllOption("Todos los tipos", TIPO_FILTER_OPTIONS)}
          />
          <FilterSelect
            label="Estado"
            value={filters.get("estado")}
            onChange={(val) => filters.set("estado", val)}
            options={withAllOption("Todos los estados", ESTADO_FILTER_OPTIONS)}
          />
        </IndexFilters>
        <div className="p-4 sm:p-5 flex flex-col lg:flex-row gap-6">
          <AgendamientoCalendar
            month={month}
            selectedDate={selectedDate}
            events={filteredData}
            loading={reuniones.loading || eventos.loading}
            onShiftMonth={(delta) => setMonth((current) => shiftMonth(current, delta))}
            onToday={() => handleSelectDate(todayISO())}
            onSelectDate={handleSelectDate}
            onCreate={openCreate}
            onOpenEvent={openEntry}
          />
          <AgendaSidebar
            monthLabel={formatMonth(month)}
            selectedDate={selectedDate}
            events={delMes}
            loading={reuniones.loading || eventos.loading}
            error={reuniones.error ?? eventos.error}
            onRetry={() => void Promise.all([reuniones.refresh(), eventos.refresh()])}
            onOpenEvent={openEntry}
            onCreate={() => openCreate(selectedDate)}
          />
        </div>
      </IndexCard>
    </ListPage>
  )
}
