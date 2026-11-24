import { useMemo, type SubmitEvent } from "react"
import { Truck } from "lucide-react"
import { IndexTabs } from "@/components/IndexTabs"
import { PageHeader } from "@/components/PageHeader"
import { useToast } from "@/components/Toast"
import { DataTable } from "@/components/list/DataTable"
import { FilterSelect } from "@/components/list/FilterField"
import { ListPage } from "@/components/list/ListPage"
import {
  ESTADO_ACTIVO_OPTIONS,
  ESTADO_ACTIVO_TABS,
  type EstadoActivo,
} from "@/constants/common"
import { useCrudActions } from "@/hooks/useCrudActions"
import { useCrudResource } from "@/hooks/useCrudResource"
import { FILTER_ALL, useListFilters } from "@/hooks/useListFilters"
import { useRecordModal } from "@/hooks/useRecordModal"
import type { EquipoItem } from "@/pages/equipos/types"
import type { ServicioItem } from "@/pages/servicios/types"
import { buildTabs, matchesSearch, toOptions, withAllOption } from "@/utils/list"
import { getProveedorColumns } from "./components/proveedorColumns"
import { PROVEEDOR_FILTERS, PROVEEDOR_LABEL } from "./constants"
import { ProveedorDetailDrawer } from "./drawers/ProveedorDetailDrawer"
import { ProveedorFormDrawer } from "./drawers/ProveedorFormDrawer"
import { EMPTY_PROVEEDOR, proveedorToForm, validateProveedor } from "./form"
import type { ProveedorForm, ProveedorItem } from "./types"
import { getProveedorContacto } from "./utils"

export default function ProveedoresPage() {
  const toast = useToast()
  const proveedores = useCrudResource<ProveedorItem>({ endpoint: "/proveedores" })
  const servicios = useCrudResource<ServicioItem>({ endpoint: "/servicios" })
  const equipos = useCrudResource<EquipoItem>({ endpoint: "/equipos" })
  const actions = useCrudActions(proveedores, PROVEEDOR_LABEL, (p) => p.razon_social)
  const filters = useListFilters(PROVEEDOR_FILTERS)
  const modal = useRecordModal<ProveedorItem, ProveedorForm>(
    proveedores.items,
    EMPTY_PROVEEDOR,
  )

  const nombresServicio = useMemo(
    () => servicios.items.map((s) => s.nombre),
    [servicios.items],
  )

  const { search, matches } = filters
  const servicio = filters.get("servicio")
  const filteredData = useMemo(
    () =>
      proveedores.items.filter(
        (p) =>
          matches("estado", p.estado) &&
          (servicio === FILTER_ALL || (p.servicios ?? []).includes(servicio)) &&
          matchesSearch(search, [
            p.razon_social,
            p.nit_documento,
            p.correo,
            getProveedorContacto(p),
            ...(p.servicios ?? []),
            ...(p.equipos ?? []),
          ]),
      ),
    [proveedores.items, search, servicio, matches],
  )

  const { selected } = modal
  const equiposDelProveedor = equipos.items.filter(
    (eq) =>
      eq.propiedad === "Alquilado" &&
      (String(eq.proveedor_id) === selected?.id ||
        eq.proveedor_nombre === selected?.razon_social),
  )

  const openCreate = () => modal.openCreate()
  const openEdit = (item: ProveedorItem) => modal.openEdit(item, proveedorToForm(item))

  const handleStatusChange = (id: string, estado: EstadoActivo) =>
    actions.changeStatus(id, { estado }, estado)

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const error = validateProveedor(modal.editForm)
    if (error) {
      toast.error(error)
      return
    }
    const saved = selected
      ? await actions.update(selected.id, modal.editForm)
      : await actions.create({
          ...modal.editForm,
          contratosCount: 0,
          historial: [],
          fecha_creacion: new Date().toISOString(),
        })
    if (saved) modal.close()
  }

  return (
    <ListPage
      overlays={
        <>
          <ProveedorDetailDrawer
            isOpen={modal.mode === "view"}
            item={selected}
            onClose={modal.close}
            onEdit={openEdit}
            equipos={equiposDelProveedor}
            onStatusChange={handleStatusChange}
          />
          <ProveedorFormDrawer
            isOpen={modal.mode === "form"}
            isEditing={modal.isEditing}
            saving={actions.saving}
            form={modal.editForm}
            setForm={modal.setEditForm}
            onClose={modal.close}
            onSubmit={(e) => void handleSubmit(e)}
            servicios={nombresServicio}
          />
        </>
      }
    >
      <PageHeader
        title="Proveedores"
        actionLabel="Crear proveedor"
        onAction={openCreate}
        {...filters.headerProps}
      >
        <FilterSelect
          label="Estado"
          value={filters.get("estado")}
          onChange={(val) => filters.set("estado", val)}
          options={withAllOption("Todos los estados", ESTADO_ACTIVO_OPTIONS)}
        />
        <FilterSelect
          label="Servicio"
          value={servicio}
          onChange={(val) => filters.set("servicio", val)}
          options={withAllOption("Todos los servicios", toOptions(nombresServicio))}
        />
      </PageHeader>

      <IndexTabs
        tabs={buildTabs(proveedores.items, (p) => p.estado, ESTADO_ACTIVO_TABS)}
        activeTab={filters.get("estado")}
        onTabChange={(tab) => filters.set("estado", tab)}
      />

      <DataTable
        itemLabel={PROVEEDOR_LABEL.plural}
        columns={getProveedorColumns(handleStatusChange)}
        data={filteredData}
        getName={(p) => p.razon_social}
        loading={proveedores.loading}
        error={proveedores.error}
        onRetry={() => void proveedores.refresh()}
        resetKey={filters.resetKey}
        isFiltered={filters.isFiltered}
        onResetFilters={filters.resetAll}
        onCreate={openCreate}
        onView={modal.openView}
        onEdit={openEdit}
        onDelete={(item) => void actions.remove(item)}
        empty={{
          icon: Truck,
          title: "Aún no tienes proveedores registrados",
          description: "Registra aliados para gestionar suministros y recepciones.",
          createLabel: "Crear proveedor",
        }}
      />
    </ListPage>
  )
}
