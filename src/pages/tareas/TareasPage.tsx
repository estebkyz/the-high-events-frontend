import { useMemo, useState, type SubmitEvent } from "react"
import { CheckSquare, ClipboardList, Clock, Trash2 } from "lucide-react"
import { BulkActionsBar } from "@/components/BulkActionsBar"
import { PageHeader } from "@/components/PageHeader"
import { SegmentedControl } from "@/components/SegmentedControl"
import { useToast } from "@/components/Toast"
import { DataTable } from "@/components/list/DataTable"
import { FilterSelect } from "@/components/list/FilterField"
import { IndexCard } from "@/components/list/IndexCard"
import { IndexFilters } from "@/components/list/IndexFilters"
import { ListPage } from "@/components/list/ListPage"
import { useCrudActions } from "@/hooks/useCrudActions"
import { useCrudResource } from "@/hooks/useCrudResource"
import { FILTER_ALL, useListFilters } from "@/hooks/useListFilters"
import { useRecordModal } from "@/hooks/useRecordModal"
import { useSelection } from "@/hooks/useSelection"
import type { EmpleadoItem } from "@/pages/empleados/types"
import type { EventoItem } from "@/pages/eventos/types"
import {
  buildTabs,
  matchesSearch,
  toOptions,
  uniqueValues,
  withAllOption,
} from "@/utils/list"
import { CatalogoPanel } from "./components/CatalogoPanel"
import { getTareaColumns } from "./components/tareaColumns"
import {
  ESTADO_TAREA_TABS,
  FASE_OPTIONS,
  PRIORIDAD_OPTIONS,
  TAREA_FILTERS,
  TAREA_LABEL,
  TAREA_VIEWS,
} from "./constants"
import { TareaDetailDrawer } from "./drawers/TareaDetailDrawer"
import { TareaFormDrawer } from "./drawers/TareaFormDrawer"
import { EMPTY_CATALOGO, EMPTY_TAREA, validateTarea } from "./form"
import type {
  EstadoTarea,
  TareaCatalogoForm,
  TareaCatalogoItem,
  TareaForm,
  TareaItem,
  TareaView,
} from "./types"
import { MODULE_ACCESS } from "@/constants/access"

export default function TareasPage() {
  const toast = useToast()
  const [view, setView] = useState<TareaView>("table")
  const tareas = useCrudResource<TareaItem>({ endpoint: "/evento-tareas" })
  const catalogo = useCrudResource<TareaCatalogoItem>({ endpoint: "/tareas-catalogo" })
  const eventos = useCrudResource<EventoItem>({ endpoint: "/eventos" })
  const empleados = useCrudResource<EmpleadoItem>({ endpoint: "/empleados" })
  const actions = useCrudActions(tareas, TAREA_LABEL, (t) => t.tarea)
  const filters = useListFilters(TAREA_FILTERS)
  const selection = useSelection()
  const modal = useRecordModal<TareaItem, TareaForm>(tareas.items, EMPTY_TAREA)
  const catalogoModal = useRecordModal<TareaCatalogoItem, TareaCatalogoForm>(
    catalogo.items,
    EMPTY_CATALOGO,
  )

  const { search, matches } = filters
  const filteredData = useMemo(
    () =>
      tareas.items.filter(
        (t) =>
          matches("evento", t.evento) &&
          matches("fase", t.fase) &&
          matches("empleado", t.responsable) &&
          matches("prioridad", t.prioridad) &&
          matches("estado", t.estado) &&
          matchesSearch(search, [t.tarea, t.evento, t.responsable]),
      ),
    [tareas.items, search, matches],
  )

  const handleView = (next: TareaView) => {
    setView(next)
    selection.clear()
    // El catálogo no tiene estado.
    if (next === "catalogo") filters.set("estado", FILTER_ALL)
  }

  const openEdit = (item: TareaItem) => modal.openEdit(item, { ...item })

  const handleStatusChange = (id: string, estado: EstadoTarea) =>
    actions.changeStatus(id, { estado }, estado)

  const handleDelete = async (item: TareaItem) => {
    if (await actions.remove(item)) selection.clear()
  }

  const handleBulkEstado = async (estado: EstadoTarea) => {
    await actions.updateMany(selection.ids, { estado }, estado.toLowerCase())
    selection.clear()
  }

  const handleBulkDelete = async () => {
    if (await actions.removeMany(selection.ids)) selection.clear()
  }

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const error = validateTarea(modal.editForm)
    if (error) {
      toast.error(error)
      return
    }
    if (modal.selected && (await actions.update(modal.selected.id, modal.editForm))) {
      modal.close()
    }
  }

  const isCatalogo = view === "catalogo"

  return (
    <ListPage
      overlays={
        <>
          <BulkActionsBar
            selectedCount={selection.ids.length}
            totalCount={filteredData.length}
            onClearSelection={selection.clear}
            actions={[
              {
                label: "Completar",
                needs: MODULE_ACCESS.tareas.status,
                onClick: () => void handleBulkEstado("Completada"),
                variant: "success",
                icon: CheckSquare,
              },
              {
                label: "En proceso",
                onClick: () => void handleBulkEstado("En Proceso"),
                variant: "secondary",
                icon: Clock,
              },
              {
                label: "Eliminar",
                needs: MODULE_ACCESS.tareas.remove,
                onClick: () => void handleBulkDelete(),
                variant: "danger",
                icon: Trash2,
              },
            ]}
          />
          <TareaDetailDrawer
            isOpen={modal.mode === "view"}
            item={modal.selected}
            onClose={modal.close}
            onEdit={openEdit}
            onStatusChange={handleStatusChange}
          />
          <TareaFormDrawer
            isOpen={modal.mode === "form"}
            saving={actions.saving}
            form={modal.editForm}
            setForm={modal.setEditForm}
            onClose={modal.close}
            onSubmit={(e) => void handleSubmit(e)}
            catalogo={catalogo.items}
            eventos={eventos.items}
            empleados={empleados.items}
          />
        </>
      }
    >
      <PageHeader
        title="Tareas"
        actionLabel={isCatalogo ? "Crear tarea" : undefined}
        onAction={isCatalogo ? () => catalogoModal.openCreate() : undefined}
        extraControls={
          <SegmentedControl
            label="Vista"
            value={view}
            options={TAREA_VIEWS}
            onChange={(val) => handleView(val as TareaView)}
          />
        }
      />

      <IndexCard>
        <IndexFilters
          tabs={
            isCatalogo
              ? undefined
              : buildTabs(tareas.items, (t) => t.estado, ESTADO_TAREA_TABS, "Todas")
          }
          activeTab={filters.get("estado")}
          onTabChange={(tab) => filters.set("estado", tab)}
          loading={tareas.loading}
          {...filters.indexProps}
        >
          <FilterSelect
            label="Evento"
            value={filters.get("evento")}
            onChange={(val) => filters.set("evento", val)}
            options={withAllOption(
              "Todos los eventos",
              toOptions(uniqueValues(tareas.items.map((t) => t.evento))),
            )}
          />
          <FilterSelect
            label="Fase"
            value={filters.get("fase")}
            onChange={(val) => filters.set("fase", val)}
            options={withAllOption("Todas las fases", FASE_OPTIONS)}
          />
          <FilterSelect
            label="Responsable"
            value={filters.get("empleado")}
            onChange={(val) => filters.set("empleado", val)}
            options={withAllOption(
              "Todos los responsables",
              toOptions(uniqueValues(tareas.items.map((t) => t.responsable))),
            )}
          />
          <FilterSelect
            label="Prioridad"
            value={filters.get("prioridad")}
            onChange={(val) => filters.set("prioridad", val)}
            options={withAllOption("Todas las prioridades", PRIORIDAD_OPTIONS)}
          />
        </IndexFilters>
        {isCatalogo ? (
          <CatalogoPanel
            catalogo={catalogo}
            tareas={tareas}
            modal={catalogoModal}
            search={search}
            matchesFase={(fase) => matches("fase", fase)}
            isFiltered={filters.isFiltered}
            onResetFilters={filters.resetAll}
            resetKey={filters.resetKey}
          />
        ) : (
          <DataTable
            itemLabel={TAREA_LABEL.plural}
            columns={getTareaColumns(handleStatusChange)}
            data={filteredData}
            getName={(t) => t.tarea}
            loading={tareas.loading}
            error={tareas.error}
            onRetry={() => void tareas.refresh()}
            resetKey={filters.resetKey}
            isFiltered={filters.isFiltered}
            onResetFilters={filters.resetAll}
            selection={selection}
            onView={modal.openView}
            onEdit={openEdit}
            onDelete={(item) => void handleDelete(item)}
            empty={{
              icon: ClipboardList,
              title: "Sin tareas asignadas",
              description: "Las tareas se asignan al crear o editar un evento.",
            }}
          />
        )}
      </IndexCard>
    </ListPage>
  )
}
