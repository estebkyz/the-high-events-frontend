import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PageHeader } from "@/components/PageHeader"
import { SegmentedControl } from "@/components/SegmentedControl"
import { useConfirm } from "@/components/ConfirmDialog"
import { useToast } from "@/components/Toast"
import { DataTable } from "@/components/list/DataTable"
import { FilterSegmented, FilterSelect } from "@/components/list/FilterField"
import { IndexCard } from "@/components/list/IndexCard"
import { IndexFilters } from "@/components/list/IndexFilters"
import { ListPage } from "@/components/list/ListPage"
import { useCrudActions } from "@/hooks/useCrudActions"
import { useCrudResource } from "@/hooks/useCrudResource"
import { useListFilters } from "@/hooks/useListFilters"
import { useRecordModal } from "@/hooks/useRecordModal"
import { useCan } from "@/hooks/useAccess"
import { MODULE_ACCESS } from "@/constants/access"
import type { EquipoItem } from "@/pages/equipos/types"
import type { VentaItem } from "@/pages/ventas/types"
import type { EventoToVentaState } from "@/routes/navigationState"
import { EVENTO_PATHS, ROUTE_PATHS } from "@/routes/paths"
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
import { rutaDocumento } from "./documentos"
import { EventoDetailDrawer } from "./drawers/EventoDetailDrawer"
import { EMPTY_EVENTO } from "./form"
import type { EstadoEvento, EventoForm, EventoItem } from "./types"

/** Listado de eventos; crear y editar tienen ruta propia (`EventoFormPage`). */
export default function EventosPage() {
  const navigate = useNavigate()
  const [view, setView] = useState("grid")
  const eventos = useCrudResource<EventoItem>({ endpoint: "/eventos" })
  const equipos = useCrudResource<EquipoItem>({ endpoint: "/equipos" })
  const can = useCan()
  const confirm = useConfirm()
  const toast = useToast()
  // Para saber si a un evento confirmado le falta su venta
  const puedeVerVentas = can(MODULE_ACCESS.ventas.view)
  const ventas = useCrudResource<VentaItem>({
    endpoint: "/ventas",
    enabled: puedeVerVentas,
  })
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

  const tieneVenta = (id: string) =>
    puedeVerVentas
      ? ventas.items.some((v) => v.evento_id === id && v.estado_venta === "Confirmada")
      : undefined

  const handleStatusChange = async (id: string, estado: EstadoEvento) => {
    const ok = await actions.changeStatus(id, { estado }, estado)
    const evento = eventos.items.find((e) => e.id === id)
    if (
      ok &&
      estado === "Confirmado" &&
      evento?.modalidad === "Cliente" &&
      tieneVenta(id) === false
    )
      toast.info("Siguiente paso: registra la venta del evento")
  }

  const handleCancelar = async (item: EventoItem) => {
    const accepted = await confirm({
      title: "Cancelar evento",
      message: `El evento "${item.nombre}" quedará cancelado: sus equipos quedan libres para otros eventos y se descartan sus préstamos y recepciones en borrador.`,
      confirmLabel: "Cancelar evento",
    })
    if (accepted)
      await actions.changeStatus(item.id, { estado: "Cancelado" }, "Cancelado")
  }

  const registrarVenta = (item: EventoItem) => {
    const state: EventoToVentaState = { ventaDeEvento: item.id }
    void navigate(ROUTE_PATHS.ventas, { state })
  }

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
          tieneVenta={modal.selected ? tieneVenta(modal.selected.id) : undefined}
          onStatusChange={(item, estado) => void handleStatusChange(item.id, estado)}
          onCancelar={(item) => void handleCancelar(item)}
          onRegistrarVenta={registrarVenta}
          onOpenDocumento={(doc) =>
            void navigate(rutaDocumento(doc), { state: { openId: doc.id } })
          }
        />
      }
    >
      <PageHeader
        title="Eventos"
        actionLabel="Crear evento"
        onAction={openCreate}
        extraControls={
          <SegmentedControl
            label="Vista"
            value={view}
            options={EVENTO_VIEWS}
            onChange={setView}
          />
        }
      />

      <IndexCard>
        <IndexFilters
          tabs={buildTabs(eventos.items, (e) => e.modalidad, MODALIDAD_TABS)}
          activeTab={filters.get("modalidad")}
          onTabChange={(tab) => filters.set("modalidad", tab)}
          loading={eventos.loading}
          {...filters.indexProps}
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
        </IndexFilters>
        {showGrid ? (
          <div className="p-4 grid grid-cols-1 @xl:grid-cols-2 @4xl:grid-cols-3 gap-3">
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
            columns={getEventoColumns(
              (id, estado) => void handleStatusChange(id, estado),
            )}
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
      </IndexCard>
    </ListPage>
  )
}
