import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { IndexTabs } from "@/components/IndexTabs"
import { PageHeader } from "@/components/PageHeader"
import { SegmentedControl } from "@/components/SegmentedControl"
import { DataTable } from "@/components/list/DataTable"
import { FilterSegmented, FilterSelect } from "@/components/list/FilterField"
import { ListPage } from "@/components/list/ListPage"
import { useCrudActions } from "@/hooks/useCrudActions"
import { useCrudResource } from "@/hooks/useCrudResource"
import { useListFilters } from "@/hooks/useListFilters"
import { useRecordModal } from "@/hooks/useRecordModal"
import type { EquipoItem } from "@/pages/equipos/types"
import { EVENTO_PATHS } from "@/routes/paths"
import { buildTabs, matchesSearch, withAllOption } from "@/utils/list"
import { EventoCard } from "./components/EventoCard"
import { getEventoColumns } from "./components/eventoColumns"
import {
  EMPTY_EVENTOS,
  ESTADO_EVENTO_OPTIONS,
  EVENTO_FILTERS,
  EVENTO_LABEL,
  EVENTO_VIEWS,
  MODALIDAD_FILTER_OPTIONS,
  MODALIDAD_TABS,
} from "./constants"
import { EventoDetailDrawer } from "./drawers/EventoDetailDrawer"
import { EMPTY_EVENTO } from "./form"
import type { EstadoEvento, EventoForm, EventoItem } from "./types"

/** Listado de eventos; crear y editar tienen ruta propia (`EventoFormPage`). */
export default function EventosPage() {
  const navigate = useNavigate()
  const [view, setView] = useState("grid")
  const eventos = useCrudResource<EventoItem>({ endpoint: "/eventos" })
  const equipos = useCrudResource<EquipoItem>({ endpoint: "/equipos" })
  const actions = useCrudActions(eventos, EVENTO_LABEL, (e) => e.nombre)
  const filters = useListFilters(EVENTO_FILTERS)
  const modal = useRecordModal<EventoItem, EventoForm>(eventos.items, EMPTY_EVENTO)

  const { search, matches } = filters
  const filteredData = useMemo(
    () =>
      eventos.items.filter(
        (e) =>
          matches("modalidad", e.modalidad) &&
          matches("estado", e.estado) &&
          matchesSearch(search, [
            e.nombre,
            e.cliente_nombre,
            e.direccion,
            e.cotizacion_codigo,
          ]),
      ),
    [eventos.items, search, matches],
  )

  const openCreate = () => void navigate(EVENTO_PATHS.create)
  const openEdit = (item: EventoItem) => void navigate(EVENTO_PATHS.edit(item.id))
  const handleDelete = (item: EventoItem) => void actions.remove(item)

  const handleStatusChange = (id: string, estado: EstadoEvento) =>
    actions.changeStatus(id, { estado }, estado)

  const showGrid = view === "grid" && filteredData.length > 0

  return (
    <ListPage
      overlays={
        <EventoDetailDrawer
          isOpen={modal.mode === "view"}
          item={modal.selected}
          onClose={modal.close}
          onEdit={openEdit}
          equipos={equipos.items}
        />
      }
    >
      <PageHeader
        title="Eventos"
        actionLabel="Crear evento"
        onAction={openCreate}
        {...filters.headerProps}
        extraControls={
          <SegmentedControl
            label="Vista"
            value={view}
            options={EVENTO_VIEWS}
            onChange={setView}
          />
        }
      >
        <FilterSegmented
          label="Modalidad"
          value={filters.get("modalidad")}
          onChange={(val) => filters.set("modalidad", val)}
          options={withAllOption("Todos", MODALIDAD_FILTER_OPTIONS)}
        />
        <FilterSelect
          label="Estado"
          value={filters.get("estado")}
          onChange={(val) => filters.set("estado", val)}
          options={withAllOption("Todos los estados", ESTADO_EVENTO_OPTIONS)}
        />
      </PageHeader>

      <IndexTabs
        tabs={buildTabs(eventos.items, (e) => e.modalidad, MODALIDAD_TABS)}
        activeTab={filters.get("modalidad")}
        onTabChange={(tab) => filters.set("modalidad", tab)}
      />

      {showGrid ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((evento) => (
            <EventoCard
              key={evento.id}
              evento={evento}
              onView={modal.openView}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <DataTable
          itemLabel={EVENTO_LABEL.plural}
          columns={getEventoColumns(handleStatusChange)}
          data={filteredData}
          getName={(e) => e.nombre}
          loading={eventos.loading}
          error={eventos.error}
          onRetry={() => void eventos.refresh()}
          resetKey={filters.resetKey}
          isFiltered={filters.isFiltered}
          onResetFilters={filters.resetAll}
          onCreate={openCreate}
          onView={modal.openView}
          onEdit={openEdit}
          onDelete={handleDelete}
          empty={EMPTY_EVENTOS}
        />
      )}
    </ListPage>
  )
}
