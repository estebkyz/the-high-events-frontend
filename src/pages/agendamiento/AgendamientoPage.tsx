import { useMemo, useState, type SubmitEvent } from "react"
import { useNavigate } from "react-router-dom"
import { PageHeader } from "@/components/PageHeader"
import { useToast } from "@/components/Toast"
import { FilterSelect } from "@/components/list/FilterField"
import { ListPage } from "@/components/list/ListPage"
import { useCrudActions } from "@/hooks/useCrudActions"
import { useCrudResource } from "@/hooks/useCrudResource"
import { useListFilters } from "@/hooks/useListFilters"
import { useRecordModal } from "@/hooks/useRecordModal"
import type { ClienteItem } from "@/pages/clientes/types"
import type { EventoItem } from "@/pages/eventos/types"
import type { AgendaToCotizacionState } from "@/routes/navigationState"
import { ROUTE_PATHS } from "@/routes/paths"
import { todayISO } from "@/utils/format"
import { matchesSearch, withAllOption } from "@/utils/list"
import { AgendaSidebar } from "./components/AgendaSidebar"
import { AgendamientoCalendar } from "./components/AgendamientoCalendar"
import {
  AGENDA_FILTERS,
  AGENDA_LABEL,
  ESTADO_AGENDA_OPTIONS,
  TIPO_OPTIONS,
} from "./constants"
import { AgendamientoDetailDrawer } from "./drawers/AgendamientoDetailDrawer"
import { AgendamientoFormDrawer } from "./drawers/AgendamientoFormDrawer"
import { agendaToForm, agendaToPayload, EMPTY_AGENDA, validateAgenda } from "./form"
import type { AgendaEvent, AgendaForm, CalendarMonth, EstadoAgendamiento } from "./types"
import { findConflict, formatMonth, getToday, parseISO, shiftMonth } from "./utils"

export default function AgendamientoPage() {
  const toast = useToast()
  const navigate = useNavigate()
  const agenda = useCrudResource<AgendaEvent>({ endpoint: "/agendamientos" })
  const clientes = useCrudResource<ClienteItem>({ endpoint: "/clientes" })
  const eventos = useCrudResource<EventoItem>({ endpoint: "/eventos" })
  const actions = useCrudActions(agenda, AGENDA_LABEL, (ev) => ev.title)
  const filters = useListFilters(AGENDA_FILTERS)
  const modal = useRecordModal<AgendaEvent, AgendaForm>(agenda.items, EMPTY_AGENDA)
  const [month, setMonth] = useState<CalendarMonth>(getToday)
  const [selectedDate, setSelectedDate] = useState(() => todayISO())

  const { search, matches } = filters
  const filteredData = useMemo(
    () =>
      agenda.items.filter(
        (ev) =>
          matches("tipo", ev.tipo_agendamiento) &&
          matches("estado", ev.estado) &&
          matchesSearch(search, [ev.title, ev.client, ev.venue, ev.modalidadCita]),
      ),
    [agenda.items, search, matches],
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

  const handleStatusChange = (id: string, estado: EstadoAgendamiento) =>
    actions.changeStatus(id, { estado }, estado)

  const handleDelete = async (item: AgendaEvent) => {
    if (await actions.remove(item)) modal.close()
  }

  const handleCreateCotizacion = (item: AgendaEvent) => {
    const state: AgendaToCotizacionState = {
      fromAgenda: true,
      clientName: item.client,
      fechaTentativa: item.fechaTentativaEvento,
      tipoEvento: item.tipoEventoTentativo,
      lugar: item.lugarTentativo,
      notas: item.notas,
    }
    void navigate(ROUTE_PATHS.cotizaciones, { state })
  }

  const { editForm } = modal
  const conflict = findConflict(
    agenda.items,
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
            onCreateCotizacion={handleCreateCotizacion}
            onDelete={(item) => void handleDelete(item)}
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
            eventos={eventos.items}
            conflict={conflict}
          />
        </>
      }
    >
      <PageHeader
        title="Agendamiento"
        actionLabel="Crear agendamiento"
        onAction={() => openCreate(selectedDate)}
        {...filters.headerProps}
      >
        <FilterSelect
          label="Tipo"
          value={filters.get("tipo")}
          onChange={(val) => filters.set("tipo", val)}
          options={withAllOption("Todos los tipos", TIPO_OPTIONS)}
        />
        <FilterSelect
          label="Estado"
          value={filters.get("estado")}
          onChange={(val) => filters.set("estado", val)}
          options={withAllOption("Todos los estados", ESTADO_AGENDA_OPTIONS)}
        />
      </PageHeader>

      <div className="bg-[#181B22] border border-[#262D3D] rounded-2xl p-5 flex flex-col lg:flex-row gap-6">
        <AgendamientoCalendar
          month={month}
          selectedDate={selectedDate}
          events={filteredData}
          onShiftMonth={(delta) => setMonth((current) => shiftMonth(current, delta))}
          onToday={() => handleSelectDate(todayISO())}
          onSelectDate={handleSelectDate}
          onCreate={openCreate}
          onOpenEvent={modal.openView}
        />
        <AgendaSidebar
          monthLabel={formatMonth(month)}
          selectedDate={selectedDate}
          events={delMes}
          loading={agenda.loading}
          error={agenda.error}
          onRetry={() => void agenda.refresh()}
          onOpenEvent={modal.openView}
          onCreate={() => openCreate(selectedDate)}
        />
      </div>
    </ListPage>
  )
}
