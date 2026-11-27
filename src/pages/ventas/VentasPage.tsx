import { useMemo, type SubmitEvent } from "react"
import { DollarSign, Download, Trash2 } from "lucide-react"
import { BulkActionsBar } from "@/components/BulkActionsBar"
import { PageHeader } from "@/components/PageHeader"
import { useToast } from "@/components/Toast"
import { DataTable } from "@/components/list/DataTable"
import { FilterSegmented, FilterSelect } from "@/components/list/FilterField"
import { IndexCard } from "@/components/list/IndexCard"
import { IndexFilters } from "@/components/list/IndexFilters"
import { ListPage } from "@/components/list/ListPage"
import { useCrudActions } from "@/hooks/useCrudActions"
import { useCrudResource } from "@/hooks/useCrudResource"
import { useListFilters } from "@/hooks/useListFilters"
import { useNavigationState } from "@/hooks/useNavigationState"
import { useRecordModal } from "@/hooks/useRecordModal"
import { useSelection } from "@/hooks/useSelection"
import type { EventoItem } from "@/pages/eventos/types"
import { isEventoToVenta } from "@/routes/navigationState"
import { useAppNavigate } from "@/routes/useAppNavigate"
import { buildTabs, matchesSearch, withAllOption } from "@/utils/list"
import { VentasKPIs } from "./components/VentasKPIs"
import { getVentaColumns } from "./components/ventaColumns"
import {
  ESTADO_PAGO_OPTIONS,
  ESTADO_PAGO_TABS,
  ESTADO_VENTA_OPTIONS,
  TIPO_VENTA_OPTIONS,
  VENTA_FILTERS,
  VENTA_LABEL,
} from "./constants"
import { VentaDetailDrawer } from "./drawers/VentaDetailDrawer"
import { VentaFormDrawer } from "./drawers/VentaFormDrawer"
import {
  EMPTY_VENTA,
  emptyVentaHoy,
  validateVenta,
  ventaToForm,
  ventaToPayload,
} from "./form"
import type { EstadoVenta, VentaForm, VentaItem } from "./types"
import { printVenta } from "./utils"
import { MODULE_ACCESS } from "@/constants/access"

export default function VentasPage() {
  const toast = useToast()
  const goTo = useAppNavigate()
  const ventas = useCrudResource<VentaItem>({ endpoint: "/ventas" })
  const eventos = useCrudResource<EventoItem>({ endpoint: "/eventos" })
  const actions = useCrudActions(ventas, VENTA_LABEL, (v) => v.codigo)
  const filters = useListFilters(VENTA_FILTERS)
  const selection = useSelection()
  const modal = useRecordModal<VentaItem, VentaForm>(ventas.items, EMPTY_VENTA)

  const { search, matches } = filters
  const filteredData = useMemo(
    () =>
      ventas.items.filter(
        (v) =>
          matches("tipo", v.tipo) &&
          matches("pago", v.estadoPago) &&
          matches("estado", v.estado_venta) &&
          matchesSearch(search, [v.clienteEvento, v.codigo, v.numero_factura]),
      ),
    [ventas.items, search, matches],
  )

  const openCreate = () => modal.openCreate(emptyVentaHoy())
  // Desde el detalle de un evento confirmado: la venta llega con su evento elegido
  useNavigationState(isEventoToVenta, ({ ventaDeEvento }) =>
    modal.openCreate({ ...emptyVentaHoy(), evento_id: ventaDeEvento }),
  )
  const openEdit = (item: VentaItem) => modal.openEdit(item, ventaToForm(item))

  const handleStatusChange = (id: string, estado_venta: EstadoVenta) =>
    actions.changeStatus(id, { estado_venta }, estado_venta)

  const handleDelete = async (item: VentaItem) => {
    if (await actions.remove(item)) selection.clear()
  }

  const handleBulkDelete = async () => {
    if (await actions.removeMany(selection.ids)) selection.clear()
  }

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const error = validateVenta(
      modal.editForm,
      eventos.items.find((e) => e.id === modal.editForm.evento_id),
    )
    if (error) {
      toast.error(error)
      return
    }
    const data = ventaToPayload(modal.editForm)
    const saved = modal.selected
      ? await actions.update(modal.selected.id, data)
      : await actions.create(data)
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
                label: "Eliminar",
                needs: MODULE_ACCESS.ventas.remove,
                onClick: () => void handleBulkDelete(),
                variant: "danger",
                icon: Trash2,
              },
            ]}
          />
          <VentaDetailDrawer
            isOpen={modal.mode === "view"}
            item={modal.selected}
            onClose={modal.close}
            onEdit={openEdit}
            onStatusChange={handleStatusChange}
            onVerAbonos={() => void goTo("abonos")}
          />
          <VentaFormDrawer
            isOpen={modal.mode === "form"}
            isEditing={modal.isEditing}
            saving={actions.saving}
            form={modal.editForm}
            setForm={modal.setEditForm}
            onClose={modal.close}
            onSubmit={(e) => void handleSubmit(e)}
            eventos={eventos.items}
          />
        </>
      }
    >
      <PageHeader title="Ventas" actionLabel="Crear venta" onAction={openCreate} />

      <VentasKPIs loading={ventas.loading} ventas={ventas.items} />

      <IndexCard>
        <IndexFilters
          tabs={buildTabs(ventas.items, (v) => v.estadoPago, ESTADO_PAGO_TABS, "Todas")}
          activeTab={filters.get("pago")}
          onTabChange={(tab) => filters.set("pago", tab)}
          loading={ventas.loading}
          {...filters.indexProps}
        >
          <FilterSegmented
            label="Tipo de venta"
            value={filters.get("tipo")}
            onChange={(val) => filters.set("tipo", val)}
            options={withAllOption("Todos", TIPO_VENTA_OPTIONS)}
          />
          <FilterSelect
            label="Estado de pago"
            value={filters.get("pago")}
            onChange={(val) => filters.set("pago", val)}
            options={withAllOption("Todos los pagos", ESTADO_PAGO_OPTIONS)}
          />
          <FilterSelect
            label="Estado de la venta"
            value={filters.get("estado")}
            onChange={(val) => filters.set("estado", val)}
            options={withAllOption("Todos los estados", ESTADO_VENTA_OPTIONS)}
          />
        </IndexFilters>
        <DataTable
          itemLabel={VENTA_LABEL.plural}
          columns={getVentaColumns(handleStatusChange)}
          data={filteredData}
          getName={(v) => v.codigo}
          loading={ventas.loading}
          error={ventas.error}
          onRetry={() => void ventas.refresh()}
          resetKey={filters.resetKey}
          isFiltered={filters.isFiltered}
          onResetFilters={filters.resetAll}
          selection={selection}
          onCreate={openCreate}
          onView={modal.openView}
          onEdit={openEdit}
          onDelete={(item) => void handleDelete(item)}
          extraActions={[
            {
              label: "Descargar comprobante",
              icon: Download,
              onClick: printVenta,
              needs: ["ventas.comprobante"],
              tone: "success",
            },
          ]}
          empty={{
            icon: DollarSign,
            title: "Aún no tienes ventas creadas",
            description:
              "Registra ventas a clientes o eventos propios para su seguimiento.",
            createLabel: "Crear venta",
          }}
        />
      </IndexCard>
    </ListPage>
  )
}
