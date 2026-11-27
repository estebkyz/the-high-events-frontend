import { useMemo, type SubmitEvent } from "react"
import { AlertTriangle, CheckCircle2, TrendingUp, Trash2 } from "lucide-react"
import { BulkActionsBar } from "@/components/BulkActionsBar"
import { PageHeader } from "@/components/PageHeader"
import { useToast } from "@/components/Toast"
import { DataTable } from "@/components/list/DataTable"
import { FilterSelect } from "@/components/list/FilterField"
import { IndexCard } from "@/components/list/IndexCard"
import { IndexFilters } from "@/components/list/IndexFilters"
import { ListPage } from "@/components/list/ListPage"
import { useCrudActions } from "@/hooks/useCrudActions"
import { useCrudResource } from "@/hooks/useCrudResource"
import { useListFilters } from "@/hooks/useListFilters"
import { useRecordModal } from "@/hooks/useRecordModal"
import { useSelection } from "@/hooks/useSelection"
import type { EmpleadoItem } from "@/pages/empleados/types"
import type { EventoItem } from "@/pages/eventos/types"
import { buildTabs, matchesSearch, withAllOption } from "@/utils/list"
import { appendAccion } from "./bitacora"
import { getIncidenteColumns } from "./components/incidenteColumns"
import {
  CRITICIDAD_OPTIONS,
  ESTADO_INCIDENTE_OPTIONS,
  ESTADO_INCIDENTE_TABS,
  INCIDENTE_FILTERS,
  INCIDENTE_LABEL,
} from "./constants"
import { IncidenteDetailDrawer } from "./drawers/IncidenteDetailDrawer"
import { IncidenteFormDrawer } from "./drawers/IncidenteFormDrawer"
import { EMPTY_INCIDENTE, nuevoIncidente, validateIncidente } from "./form"
import type { AccionForm, EstadoIncidente, IncidenteForm, IncidenteItem } from "./types"
import { MODULE_ACCESS } from "@/constants/access"

export default function IncidentesPage() {
  const toast = useToast()
  const incidentes = useCrudResource<IncidenteItem>({ endpoint: "/incidentes" })
  const eventos = useCrudResource<EventoItem>({ endpoint: "/eventos" })
  const empleados = useCrudResource<EmpleadoItem>({ endpoint: "/empleados" })
  const actions = useCrudActions(incidentes, INCIDENTE_LABEL, (i) => i.codigo)
  const filters = useListFilters(INCIDENTE_FILTERS)
  const selection = useSelection()
  const modal = useRecordModal<IncidenteItem, IncidenteForm>(
    incidentes.items,
    EMPTY_INCIDENTE,
  )

  const { search, matches } = filters
  const filteredData = useMemo(
    () =>
      incidentes.items.filter(
        (i) =>
          matches("criticidad", i.criticidad) &&
          matches("estado", i.estado) &&
          matchesSearch(search, [i.titulo, i.evento, i.codigo]),
      ),
    [incidentes.items, search, matches],
  )

  const openCreate = () => modal.openCreate()
  const openEdit = (item: IncidenteItem) => modal.openEdit(item, { ...item })

  const handleStatusChange = (id: string, estado: EstadoIncidente) =>
    actions.changeStatus(id, { estado }, estado)

  const handleAddAccion = (item: IncidenteItem, form: AccionForm) =>
    actions.update(
      item.id,
      {
        estado: form.estado,
        acciones_tomadas: appendAccion(item.acciones_tomadas, form),
      },
      "Acción registrada en la bitácora",
    )

  const handleDelete = async (item: IncidenteItem) => {
    if (await actions.remove(item)) selection.clear()
  }

  const handleBulkEstado = async (estado: EstadoIncidente) => {
    await actions.updateMany(selection.ids, { estado }, estado.toLowerCase())
    selection.clear()
  }

  const handleBulkDelete = async () => {
    if (await actions.removeMany(selection.ids)) selection.clear()
  }

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const error = validateIncidente(modal.editForm)
    if (error) {
      toast.error(error)
      return
    }
    const saved = modal.selected
      ? await actions.update(modal.selected.id, modal.editForm)
      : await actions.create(nuevoIncidente(modal.editForm))
    if (saved) modal.close()
  }

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
                label: "Solucionar",
                needs: MODULE_ACCESS.incidentes.status,
                onClick: () => void handleBulkEstado("Solucionado"),
                variant: "success",
                icon: CheckCircle2,
              },
              {
                label: "Escalar",
                onClick: () => void handleBulkEstado("Escalado"),
                variant: "secondary",
                icon: TrendingUp,
              },
              {
                label: "Eliminar",
                needs: MODULE_ACCESS.incidentes.remove,
                onClick: () => void handleBulkDelete(),
                variant: "danger",
                icon: Trash2,
              },
            ]}
          />
          <IncidenteDetailDrawer
            isOpen={modal.mode === "view"}
            item={modal.selected}
            onClose={modal.close}
            onEdit={openEdit}
            saving={actions.saving}
            onAddAccion={handleAddAccion}
          />
          <IncidenteFormDrawer
            isOpen={modal.mode === "form"}
            isEditing={modal.isEditing}
            saving={actions.saving}
            form={modal.editForm}
            setForm={modal.setEditForm}
            onClose={modal.close}
            onSubmit={(e) => void handleSubmit(e)}
            eventos={eventos.items}
            empleados={empleados.items}
          />
        </>
      }
    >
      <PageHeader
        title="Incidentes"
        actionLabel="Crear incidente"
        onAction={openCreate}
      />

      <IndexCard>
        <IndexFilters
          tabs={buildTabs(incidentes.items, (i) => i.estado, ESTADO_INCIDENTE_TABS)}
          activeTab={filters.get("estado")}
          onTabChange={(tab) => filters.set("estado", tab)}
          loading={incidentes.loading}
          {...filters.indexProps}
        >
          <FilterSelect
            label="Criticidad"
            value={filters.get("criticidad")}
            onChange={(val) => filters.set("criticidad", val)}
            options={withAllOption("Todas las criticidades", CRITICIDAD_OPTIONS)}
          />
          <FilterSelect
            label="Estado"
            value={filters.get("estado")}
            onChange={(val) => filters.set("estado", val)}
            options={withAllOption("Todos los estados", ESTADO_INCIDENTE_OPTIONS)}
          />
        </IndexFilters>
        <DataTable
          itemLabel={INCIDENTE_LABEL.plural}
          columns={getIncidenteColumns(handleStatusChange)}
          data={filteredData}
          getName={(i) => i.codigo}
          loading={incidentes.loading}
          error={incidentes.error}
          onRetry={() => void incidentes.refresh()}
          resetKey={filters.resetKey}
          isFiltered={filters.isFiltered}
          onResetFilters={filters.resetAll}
          selection={selection}
          onCreate={openCreate}
          onView={modal.openView}
          onEdit={openEdit}
          onDelete={(item) => void handleDelete(item)}
          empty={{
            icon: AlertTriangle,
            title: "Sin incidentes creados",
            description: "Registra novedades asociadas a un evento.",
            createLabel: "Crear incidente",
          }}
        />
      </IndexCard>
    </ListPage>
  )
}
