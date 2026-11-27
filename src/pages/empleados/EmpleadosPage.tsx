import { useMemo, type SubmitEvent } from "react"
import { UserCheck } from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import { useToast } from "@/components/Toast"
import { DataTable } from "@/components/list/DataTable"
import { FilterSegmented, FilterSelect } from "@/components/list/FilterField"
import { IndexCard } from "@/components/list/IndexCard"
import { IndexFilters } from "@/components/list/IndexFilters"
import { ListPage } from "@/components/list/ListPage"
import { ESTADO_ACTIVO_OPTIONS, type EstadoActivo } from "@/constants/common"
import { useCrudActions } from "@/hooks/useCrudActions"
import { useCrudResource } from "@/hooks/useCrudResource"
import { useListFilters } from "@/hooks/useListFilters"
import { useRecordModal } from "@/hooks/useRecordModal"
import { buildTabs, matchesSearch, toOptions, withAllOption } from "@/utils/list"
import { getEmpleadoColumns } from "./components/empleadoColumns"
import {
  EMPLEADO_FILTERS,
  EMPLEADO_LABEL,
  VINCULACION_FILTER_OPTIONS,
  VINCULACION_TABS,
} from "./constants"
import { EmpleadoDetailDrawer } from "./drawers/EmpleadoDetailDrawer"
import { EmpleadoFormDrawer } from "./drawers/EmpleadoFormDrawer"
import { EMPTY_EMPLEADO, normalizeEmpleado, validateEmpleado } from "./form"
import type { EmpleadoForm, EmpleadoItem } from "./types"
import { getEmpleadoFullName } from "./utils"

export default function EmpleadosPage() {
  const toast = useToast()
  const empleados = useCrudResource<EmpleadoItem>({ endpoint: "/empleados" })
  const actions = useCrudActions(empleados, EMPLEADO_LABEL, getEmpleadoFullName)
  const filters = useListFilters(EMPLEADO_FILTERS)
  const modal = useRecordModal<EmpleadoItem, EmpleadoForm>(
    empleados.items,
    EMPTY_EMPLEADO,
  )

  const cargos = [...new Set(empleados.items.map((e) => e.cargo))].sort()
  const { search, matches } = filters
  const filteredData = useMemo(
    () =>
      empleados.items.filter(
        (e) =>
          matches("cargo", e.cargo) &&
          matches("vinculacion", e.vinculacion ?? "Fijo") &&
          matches("estado", e.estado) &&
          matchesSearch(search, [
            getEmpleadoFullName(e),
            e.cargo,
            e.numero_documento,
            e.correo,
          ]),
      ),
    [empleados.items, search, matches],
  )

  const openCreate = () => modal.openCreate()
  const openEdit = (item: EmpleadoItem) => modal.openEdit(item, { ...item })

  const handleStatusChange = (id: string, estado: EstadoActivo) =>
    actions.changeStatus(id, { estado }, estado)

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const error = validateEmpleado(modal.editForm)
    if (error) {
      toast.error(error)
      return
    }
    const data = normalizeEmpleado(modal.editForm)
    const saved = modal.selected
      ? await actions.update(modal.selected.id, data)
      : await actions.create(data)
    if (saved) modal.close()
  }

  return (
    <ListPage
      overlays={
        <>
          <EmpleadoDetailDrawer
            isOpen={modal.mode === "view"}
            item={modal.selected}
            onClose={modal.close}
            onEdit={openEdit}
            onStatusChange={handleStatusChange}
          />
          <EmpleadoFormDrawer
            isOpen={modal.mode === "form"}
            isEditing={modal.isEditing}
            saving={actions.saving}
            form={modal.editForm}
            setForm={modal.setEditForm}
            onClose={modal.close}
            onSubmit={(e) => void handleSubmit(e)}
          />
        </>
      }
    >
      <PageHeader title="Empleados" actionLabel="Crear empleado" onAction={openCreate} />

      <IndexCard>
        <IndexFilters
          tabs={buildTabs(
            empleados.items,
            (e) => e.vinculacion ?? "Fijo",
            VINCULACION_TABS,
          )}
          activeTab={filters.get("vinculacion")}
          onTabChange={(tab) => filters.set("vinculacion", tab)}
          loading={empleados.loading}
          {...filters.indexProps}
        >
          <FilterSelect
            label="Cargo"
            value={filters.get("cargo")}
            onChange={(val) => filters.set("cargo", val)}
            options={withAllOption("Todos los cargos", toOptions(cargos))}
          />
          <FilterSegmented
            label="Vinculación"
            value={filters.get("vinculacion")}
            onChange={(val) => filters.set("vinculacion", val)}
            options={withAllOption("Todos", VINCULACION_FILTER_OPTIONS)}
          />
          <FilterSelect
            label="Estado"
            value={filters.get("estado")}
            onChange={(val) => filters.set("estado", val)}
            options={withAllOption("Todos los estados", ESTADO_ACTIVO_OPTIONS)}
          />
        </IndexFilters>
        <DataTable
          itemLabel={EMPLEADO_LABEL.plural}
          columns={getEmpleadoColumns(handleStatusChange)}
          data={filteredData}
          getName={getEmpleadoFullName}
          loading={empleados.loading}
          error={empleados.error}
          onRetry={() => void empleados.refresh()}
          resetKey={filters.resetKey}
          isFiltered={filters.isFiltered}
          onResetFilters={filters.resetAll}
          onCreate={openCreate}
          onView={modal.openView}
          onEdit={openEdit}
          onDelete={(item) => void actions.remove(item)}
          empty={{
            icon: UserCheck,
            title: "Aún no tienes empleados creados",
            description: "Registra empleados para asignarlos al staff de tus eventos.",
            createLabel: "Crear empleado",
          }}
        />
      </IndexCard>
    </ListPage>
  )
}
