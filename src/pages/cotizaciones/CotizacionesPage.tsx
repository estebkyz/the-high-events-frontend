import { useMemo, type SubmitEvent } from "react"
import { CheckCircle2, Download, FileText, Send, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
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
import { useNavigationState } from "@/hooks/useNavigationState"
import { useRecordModal } from "@/hooks/useRecordModal"
import { useSelection } from "@/hooks/useSelection"
import type { ClienteItem } from "@/pages/clientes/types"
import type { EmpleadoItem } from "@/pages/empleados/types"
import type { ServicioItem } from "@/pages/servicios/types"
import { isAgendaToCotizacion } from "@/routes/navigationState"
import { EVENTO_PATHS } from "@/routes/paths"
import {
  buildTabs,
  matchesSearch,
  toOptions,
  uniqueValues,
  withAllOption,
} from "@/utils/list"
import { getCotizacionColumns } from "./components/cotizacionColumns"
import {
  COTIZACION_FILTERS,
  COTIZACION_LABEL,
  ESTADO_COTIZACION_OPTIONS,
  ESTADO_COTIZACION_TABS,
} from "./constants"
import { CotizacionDetailDrawer } from "./drawers/CotizacionDetailDrawer"
import { CotizacionFormDrawer } from "./drawers/CotizacionFormDrawer"
import {
  cotizacionDesdeAgenda,
  cotizacionToForm,
  EMPTY_COTIZACION,
  emptyCotizacionHoy,
  validateCotizacion,
} from "./form"
import type { CotizacionForm, CotizacionItem, EstadoCotizacion } from "./types"
import { printCotizacion } from "./utils"
import { MODULE_ACCESS } from "@/constants/access"

export default function CotizacionesPage() {
  const toast = useToast()
  const navigate = useNavigate()
  const cotizaciones = useCrudResource<CotizacionItem>({ endpoint: "/cotizaciones" })
  const clientes = useCrudResource<ClienteItem>({ endpoint: "/clientes" })
  const empleados = useCrudResource<EmpleadoItem>({ endpoint: "/empleados" })
  const servicios = useCrudResource<ServicioItem>({ endpoint: "/servicios" })
  const actions = useCrudActions(cotizaciones, COTIZACION_LABEL, (c) => c.codigo)
  const filters = useListFilters(COTIZACION_FILTERS)
  const selection = useSelection()
  const modal = useRecordModal<CotizacionItem, CotizacionForm>(
    cotizaciones.items,
    EMPTY_COTIZACION,
  )

  useNavigationState(isAgendaToCotizacion, (state) => {
    modal.openCreate(cotizacionDesdeAgenda(state))
    toast.info("Formulario precargado con los datos de la reunión")
  })

  const { search, matches } = filters
  const filteredData = useMemo(
    () =>
      cotizaciones.items.filter(
        (c) =>
          matches("estado", c.estado) &&
          matches("cliente", c.cliente) &&
          matchesSearch(search, [c.codigo, c.cliente, c.nombre_evento]),
      ),
    [cotizaciones.items, search, matches],
  )

  const openCreate = () => modal.openCreate(emptyCotizacionHoy())
  const openEdit = (item: CotizacionItem) => modal.openEdit(item, cotizacionToForm(item))

  const handleStatusChange = (id: string, estado: EstadoCotizacion) =>
    actions.changeStatus(id, { estado }, estado)

  const handleDelete = async (item: CotizacionItem) => {
    if (await actions.remove(item)) selection.clear()
  }

  const handleBulkEstado = async (estado: EstadoCotizacion) => {
    await actions.updateMany(selection.ids, { estado }, estado.toLowerCase())
    selection.clear()
  }

  const handleBulkDelete = async () => {
    if (await actions.removeMany(selection.ids)) selection.clear()
  }

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const error = validateCotizacion(modal.editForm)
    if (error) {
      toast.error(error)
      return
    }
    const saved = modal.selected
      ? await actions.update(modal.selected.id, modal.editForm)
      : await actions.create({ ...modal.editForm, estado: "Borrador" })
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
                label: "Aceptar",
                needs: MODULE_ACCESS.cotizaciones.status,
                onClick: () => void handleBulkEstado("Aceptada"),
                variant: "success",
                icon: CheckCircle2,
              },
              {
                label: "Marcar enviadas",
                needs: MODULE_ACCESS.cotizaciones.status,
                onClick: () => void handleBulkEstado("Enviada"),
                variant: "primary",
                icon: Send,
              },
              {
                label: "Eliminar",
                needs: MODULE_ACCESS.cotizaciones.remove,
                onClick: () => void handleBulkDelete(),
                variant: "danger",
                icon: Trash2,
              },
            ]}
          />
          <CotizacionDetailDrawer
            isOpen={modal.mode === "view"}
            item={modal.selected}
            correoCliente={
              clientes.items.find((c) => c.id === modal.selected?.cliente_id)?.correo
            }
            onClose={modal.close}
            onEdit={openEdit}
            onStatusChange={handleStatusChange}
            onOpenEvento={(item) => void navigate(EVENTO_PATHS.edit(item.evento_id))}
          />
          <CotizacionFormDrawer
            isOpen={modal.mode === "form"}
            isEditing={modal.isEditing}
            saving={actions.saving}
            form={modal.editForm}
            setForm={modal.setEditForm}
            onClose={modal.close}
            onSubmit={(e) => void handleSubmit(e)}
            clientes={clientes.items}
            empleados={empleados.items}
            servicios={servicios.items}
          />
        </>
      }
    >
      <PageHeader
        title="Cotizaciones"
        actionLabel="Crear cotización"
        onAction={openCreate}
      />

      <IndexCard>
        <IndexFilters
          tabs={buildTabs(
            cotizaciones.items,
            (c) => c.estado,
            ESTADO_COTIZACION_TABS,
            "Todas",
          )}
          activeTab={filters.get("estado")}
          onTabChange={(tab) => filters.set("estado", tab)}
          loading={cotizaciones.loading}
          {...filters.indexProps}
        >
          <FilterSelect
            label="Estado"
            value={filters.get("estado")}
            onChange={(val) => filters.set("estado", val)}
            options={withAllOption("Todos los estados", ESTADO_COTIZACION_OPTIONS)}
          />
          <FilterSelect
            label="Cliente"
            value={filters.get("cliente")}
            onChange={(val) => filters.set("cliente", val)}
            options={withAllOption(
              "Todos los clientes",
              toOptions(uniqueValues(cotizaciones.items.map((c) => c.cliente))),
            )}
          />
        </IndexFilters>
        <DataTable
          itemLabel={COTIZACION_LABEL.plural}
          columns={getCotizacionColumns(handleStatusChange)}
          data={filteredData}
          getName={(c) => c.codigo}
          loading={cotizaciones.loading}
          error={cotizaciones.error}
          onRetry={() => void cotizaciones.refresh()}
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
              label: "Descargar PDF",
              icon: Download,
              onClick: printCotizacion,
              needs: ["cotizaciones.pdf"],
              tone: "success",
            },
          ]}
          empty={{
            icon: FileText,
            title: "Aún no tienes cotizaciones creadas",
            description: "Crea cotizaciones para clientes y eventos.",
            createLabel: "Crear cotización",
          }}
        />
      </IndexCard>
    </ListPage>
  )
}
