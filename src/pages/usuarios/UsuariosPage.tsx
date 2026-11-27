import { useMemo, type SubmitEvent } from "react"
import { User } from "lucide-react"
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
import { useCrudResource } from "@/hooks/useCrudResource"
import { useListFilters } from "@/hooks/useListFilters"
import { useRecordModal } from "@/hooks/useRecordModal"
import type { Rol } from "@/pages/roles/types"
import { buildTabs, matchesSearch, toOptions, withAllOption } from "@/utils/list"
import { getUsuarioColumns } from "./components/usuarioColumns"
import { USUARIO_FILTERS, USUARIO_LABEL } from "./constants"
import { UsuarioDetailDrawer } from "./drawers/UsuarioDetailDrawer"
import { UsuarioFormDrawer } from "./drawers/UsuarioFormDrawer"
import { EMPTY_USUARIO, usuarioToForm, usuarioToPayload, validateUsuario } from "./form"
import type { UsuarioForm, UsuarioItem } from "./types"
import { getUsuarioFullName } from "./utils"

export default function UsuariosPage() {
  const toast = useToast()
  const usuarios = useCrudResource<UsuarioItem>({ endpoint: "/usuarios" })
  const roles = useCrudResource<Rol>({ endpoint: "/roles" })
  const actions = useCrudActions(usuarios, USUARIO_LABEL, getUsuarioFullName)
  const filters = useListFilters(USUARIO_FILTERS)
  const modal = useRecordModal<UsuarioItem, UsuarioForm>(usuarios.items, EMPTY_USUARIO)

  const { search, matches } = filters
  const filteredData = useMemo(
    () =>
      usuarios.items.filter(
        (u) =>
          matches("rol", u.rol) &&
          matches("estado", u.estado) &&
          matchesSearch(search, [
            getUsuarioFullName(u),
            u.correo,
            u.numero_documento,
            u.rol,
          ]),
      ),
    [usuarios.items, search, matches],
  )

  const rolesActivos = toOptions(
    roles.items.filter((r) => r.estado === "Activo").map((r) => r.nombre),
  )

  const openCreate = () => modal.openCreate({ rol: rolesActivos[0]?.value ?? "" })
  const openEdit = (item: UsuarioItem) => modal.openEdit(item, usuarioToForm(item))

  const handleStatusChange = (id: string, estado: EstadoActivo) =>
    actions.changeStatus(id, { estado }, estado)

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const error = validateUsuario(modal.editForm, modal.isEditing)
    if (error) {
      toast.error(error)
      return
    }
    const data = usuarioToPayload(modal.editForm)
    const saved = modal.selected
      ? await actions.update(modal.selected.id, data)
      : await actions.create({
          ...data,
          ultimoAcceso: "Nunca",
          fecha_creacion: new Date().toISOString(),
        })
    if (saved) modal.close()
  }

  return (
    <ListPage
      overlays={
        <>
          <UsuarioDetailDrawer
            isOpen={modal.mode === "view"}
            item={modal.selected}
            onClose={modal.close}
            onEdit={openEdit}
          />
          <UsuarioFormDrawer
            isOpen={modal.mode === "form"}
            isEditing={modal.isEditing}
            saving={actions.saving}
            form={modal.editForm}
            setForm={modal.setEditForm}
            onClose={modal.close}
            onSubmit={(e) => void handleSubmit(e)}
            rolOptions={rolesActivos}
          />
        </>
      }
    >
      <PageHeader title="Usuarios" actionLabel="Crear usuario" onAction={openCreate} />

      <IndexCard>
        <IndexFilters
          tabs={buildTabs(usuarios.items, (u) => u.estado, ESTADO_ACTIVO_TABS)}
          activeTab={filters.get("estado")}
          onTabChange={(tab) => filters.set("estado", tab)}
          loading={usuarios.loading}
          {...filters.indexProps}
        >
          <FilterSelect
            label="Rol"
            value={filters.get("rol")}
            onChange={(val) => filters.set("rol", val)}
            options={withAllOption(
              "Todos los roles",
              toOptions(roles.items.map((r) => r.nombre)),
            )}
          />
          <FilterSelect
            label="Estado"
            value={filters.get("estado")}
            onChange={(val) => filters.set("estado", val)}
            options={withAllOption("Todos los estados", ESTADO_ACTIVO_OPTIONS)}
          />
        </IndexFilters>
        <DataTable
          itemLabel={USUARIO_LABEL.plural}
          columns={getUsuarioColumns(handleStatusChange)}
          data={filteredData}
          getName={getUsuarioFullName}
          loading={usuarios.loading}
          error={usuarios.error}
          onRetry={() => void usuarios.refresh()}
          resetKey={filters.resetKey}
          isFiltered={filters.isFiltered}
          onResetFilters={filters.resetAll}
          onCreate={openCreate}
          onView={modal.openView}
          onEdit={openEdit}
          onDelete={(item) => void actions.remove(item)}
          empty={{
            icon: User,
            title: "Aún no tienes usuarios creados",
            description: "Crea cuentas para dar acceso a los colaboradores del equipo.",
            createLabel: "Crear usuario",
          }}
        />
      </IndexCard>
    </ListPage>
  )
}
