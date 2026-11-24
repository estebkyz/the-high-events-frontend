import { useMemo, type SubmitEvent } from "react"
import { Users } from "lucide-react"
import { IndexTabs } from "@/components/IndexTabs"
import { PageHeader } from "@/components/PageHeader"
import { useToast } from "@/components/Toast"
import { DataTable } from "@/components/list/DataTable"
import { FilterSegmented, FilterSelect } from "@/components/list/FilterField"
import { ListPage } from "@/components/list/ListPage"
import { ESTADO_ACTIVO_OPTIONS, type EstadoActivo } from "@/constants/common"
import { useCrudActions } from "@/hooks/useCrudActions"
import { useCrudResource } from "@/hooks/useCrudResource"
import { useListFilters } from "@/hooks/useListFilters"
import { useRecordModal } from "@/hooks/useRecordModal"
import { buildTabs, matchesSearch, withAllOption } from "@/utils/list"
import { getClienteColumns } from "./components/clienteColumns"
import {
  CLIENTE_FILTERS,
  CLIENTE_LABEL,
  TIPO_CLIENTE_OPTIONS,
  TIPO_CLIENTE_TABS,
} from "./constants"
import { ClienteDetailDrawer } from "./drawers/ClienteDetailDrawer"
import { ClienteFormDrawer } from "./drawers/ClienteFormDrawer"
import { EMPTY_CLIENTE, validateCliente } from "./form"
import type { ClienteForm, ClienteItem } from "./types"
import { getClienteName } from "./utils"

export default function ClientesPage() {
  const toast = useToast()
  const clientes = useCrudResource<ClienteItem>({ endpoint: "/clientes" })
  const actions = useCrudActions(clientes, CLIENTE_LABEL, getClienteName)
  const filters = useListFilters(CLIENTE_FILTERS)
  const modal = useRecordModal<ClienteItem, ClienteForm>(clientes.items, EMPTY_CLIENTE)

  const { search, matches } = filters
  const filteredData = useMemo(
    () =>
      clientes.items.filter(
        (c) =>
          matches("tipo", c.tipo_cliente) &&
          matches("estado", c.estado) &&
          matchesSearch(search, [
            getClienteName(c),
            c.contacto_nombre,
            c.numero_documento,
            c.correo,
          ]),
      ),
    [clientes.items, search, matches],
  )

  const openCreate = () => modal.openCreate()
  const openEdit = (item: ClienteItem) => modal.openEdit(item, { ...item })

  const handleStatusChange = (id: string, estado: EstadoActivo) =>
    actions.changeStatus(id, { estado }, estado)

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const error = validateCliente(modal.editForm)
    if (error) {
      toast.error(error)
      return
    }
    const saved = modal.selected
      ? await actions.update(modal.selected.id, modal.editForm)
      : await actions.create({
          ...modal.editForm,
          fecha_creacion: new Date().toISOString(),
        })
    if (saved) modal.close()
  }

  return (
    <ListPage
      overlays={
        <>
          <ClienteDetailDrawer
            isOpen={modal.mode === "view"}
            item={modal.selected}
            onClose={modal.close}
            onEdit={openEdit}
            onStatusChange={handleStatusChange}
          />
          <ClienteFormDrawer
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
      <PageHeader
        title="Clientes"
        actionLabel="Crear cliente"
        onAction={openCreate}
        {...filters.headerProps}
      >
        <FilterSegmented
          label="Tipo de cliente"
          value={filters.get("tipo")}
          onChange={(val) => filters.set("tipo", val)}
          options={withAllOption("Todos", TIPO_CLIENTE_OPTIONS)}
        />
        <FilterSelect
          label="Estado"
          value={filters.get("estado")}
          onChange={(val) => filters.set("estado", val)}
          options={withAllOption("Todos los estados", ESTADO_ACTIVO_OPTIONS)}
        />
      </PageHeader>

      <IndexTabs
        tabs={buildTabs(clientes.items, (c) => c.tipo_cliente, TIPO_CLIENTE_TABS)}
        activeTab={filters.get("tipo")}
        onTabChange={(tab) => filters.set("tipo", tab)}
      />

      <DataTable
        itemLabel={CLIENTE_LABEL.plural}
        columns={getClienteColumns(handleStatusChange)}
        data={filteredData}
        getName={getClienteName}
        loading={clientes.loading}
        error={clientes.error}
        onRetry={() => void clientes.refresh()}
        resetKey={filters.resetKey}
        isFiltered={filters.isFiltered}
        onResetFilters={filters.resetAll}
        onCreate={openCreate}
        onView={modal.openView}
        onEdit={openEdit}
        onDelete={(item) => void actions.remove(item)}
        empty={{
          icon: Users,
          title: "Aún no tienes clientes registrados",
          description:
            "Agrega personas naturales o empresas para vincularlas a tus eventos.",
          createLabel: "Crear cliente",
        }}
      />
    </ListPage>
  )
}
