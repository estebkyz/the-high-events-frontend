import { useMemo, type SubmitEvent } from "react"
import { ShieldCheck } from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import { useToast } from "@/components/Toast"
import { DataTable } from "@/components/list/DataTable"
import { FilterSelect } from "@/components/list/FilterField"
import { IndexCard } from "@/components/list/IndexCard"
import { IndexFilters } from "@/components/list/IndexFilters"
import { ListPage } from "@/components/list/ListPage"
import {
  ESTADO_ACTIVO_OPTIONS,
  ESTADO_ACTIVO_TABS,
  type EstadoActivo,
} from "@/constants/common"
import { useCrudActions } from "@/hooks/useCrudActions"
import { useListFilters } from "@/hooks/useListFilters"
import { useRecordModal } from "@/hooks/useRecordModal"
import { buildTabs, matchesSearch, withAllOption } from "@/utils/list"
import { getRolColumns } from "./components/rolColumns"
import { ROL_FILTERS, ROL_LABEL } from "./constants"
import { RolDetailDrawer } from "./drawers/RolDetailDrawer"
import { RolFormDrawer } from "./drawers/RolFormDrawer"
import { EMPTY_ROL, rolToForm, validateRol } from "./form"
import type { Rol, RolForm } from "./types"
import { useRoles } from "./useRoles"

export default function RolesPage() {
  const toast = useToast()
  const roles = useRoles()
  const actions = useCrudActions(roles, ROL_LABEL, (r) => r.nombre)
  const filters = useListFilters(ROL_FILTERS)
  const modal = useRecordModal<Rol, RolForm>(roles.items, EMPTY_ROL)

  const { search, matches } = filters
  const filteredData = useMemo(
    () =>
      roles.items.filter(
        (r) =>
          matches("estado", r.estado) && matchesSearch(search, [r.nombre, r.descripcion]),
      ),
    [roles.items, search, matches],
  )

  const openCreate = () => modal.openCreate()
  const openEdit = (item: Rol) => modal.openEdit(item, rolToForm(item))

  const handleStatusChange = (id: string, estado: EstadoActivo) =>
    actions.changeStatus(id, { estado }, estado)

  const handleDelete = (item: Rol) => {
    if (item.usuariosCount > 0) {
      toast.error(
        `No se puede eliminar "${item.nombre}": tiene ${item.usuariosCount} usuario(s) vinculado(s)`,
      )
      return
    }
    void actions.remove(item)
  }

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const error = validateRol(modal.editForm)
    if (error) {
      toast.error(error)
      return
    }
    const saved = modal.selected
      ? await actions.update(modal.selected.id, modal.editForm)
      : await actions.create(modal.editForm)
    if (saved) modal.close()
  }

  return (
    <ListPage
      overlays={
        <>
          <RolDetailDrawer
            isOpen={modal.mode === "view"}
            item={modal.selected}
            onClose={modal.close}
            onEdit={openEdit}
          />
          <RolFormDrawer
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
      <PageHeader title="Roles" actionLabel="Crear rol" onAction={openCreate} />

      <IndexCard>
        <IndexFilters
          tabs={buildTabs(roles.items, (r) => r.estado, ESTADO_ACTIVO_TABS)}
          activeTab={filters.get("estado")}
          onTabChange={(tab) => filters.set("estado", tab)}
          loading={roles.loading}
          {...filters.indexProps}
        >
          <FilterSelect
            label="Estado"
            value={filters.get("estado")}
            onChange={(val) => filters.set("estado", val)}
            options={withAllOption("Todos los estados", ESTADO_ACTIVO_OPTIONS)}
          />
        </IndexFilters>
        <DataTable
          itemLabel={ROL_LABEL.plural}
          columns={getRolColumns(handleStatusChange)}
          data={filteredData}
          getName={(r) => r.nombre}
          loading={roles.loading}
          error={roles.error}
          onRetry={() => void roles.refresh()}
          resetKey={filters.resetKey}
          isFiltered={filters.isFiltered}
          onResetFilters={filters.resetAll}
          onCreate={openCreate}
          onView={modal.openView}
          onEdit={openEdit}
          onDelete={handleDelete}
          empty={{
            icon: ShieldCheck,
            title: "Aún no tienes roles creados",
            description: "Crea roles para definir qué puede hacer cada usuario.",
            createLabel: "Crear rol",
          }}
        />
      </IndexCard>
    </ListPage>
  )
}
