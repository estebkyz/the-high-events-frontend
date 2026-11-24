import { useMemo, useState, type SubmitEvent } from "react"
import { ArrowLeftCircle, FileCheck } from "lucide-react"
import { IndexTabs } from "@/components/IndexTabs"
import { PageHeader } from "@/components/PageHeader"
import { useToast } from "@/components/Toast"
import { DataTable } from "@/components/list/DataTable"
import { FilterSelect } from "@/components/list/FilterField"
import { ListPage } from "@/components/list/ListPage"
import { useCrudActions } from "@/hooks/useCrudActions"
import { useCrudResource } from "@/hooks/useCrudResource"
import { useListFilters } from "@/hooks/useListFilters"
import { useRecordModal } from "@/hooks/useRecordModal"
import type { EmpleadoItem } from "@/pages/empleados/types"
import type { EquipoItem } from "@/pages/equipos/types"
import type { EventoItem } from "@/pages/eventos/types"
import type { ProveedorItem } from "@/pages/proveedores/types"
import { todayISO } from "@/utils/format"
import { buildTabs, matchesSearch, withAllOption } from "@/utils/list"
import { RecepcionesKPIs } from "./components/RecepcionesKPIs"
import { getRecepcionColumns } from "./components/recepcionColumns"
import {
  ESTADO_RECEPCION_OPTIONS,
  ESTADO_RECEPCION_TABS,
  RECEPCION_FILTERS,
  RECEPCION_LABEL,
  TIPO_RECEPCION_OPTIONS,
} from "./constants"
import { RecepcionDetailDrawer } from "./drawers/RecepcionDetailDrawer"
import { RecepcionDevolucionDrawer } from "./drawers/RecepcionDevolucionDrawer"
import { RecepcionFormDrawer } from "./drawers/RecepcionFormDrawer"
import {
  admiteDevolucion,
  devolucionInicial,
  EMPTY_DEVOLUCION,
  EMPTY_RECEPCION,
  normalizeRecepcion,
  nuevaDevolucion,
  validateRecepcion,
} from "./form"
import type { DevolucionForm, EstadoRecepcion, Recepcion, RecepcionForm } from "./types"

export default function RecepcionesPage() {
  const toast = useToast()
  const recepciones = useCrudResource<Recepcion>({ endpoint: "/recepciones" })
  const eventos = useCrudResource<EventoItem>({ endpoint: "/eventos" })
  const proveedores = useCrudResource<ProveedorItem>({ endpoint: "/proveedores" })
  const equipos = useCrudResource<EquipoItem>({ endpoint: "/equipos" })
  const empleados = useCrudResource<EmpleadoItem>({ endpoint: "/empleados" })
  const actions = useCrudActions(recepciones, RECEPCION_LABEL, (r) => r.codigo)
  const filters = useListFilters(RECEPCION_FILTERS)
  const modal = useRecordModal<Recepcion, RecepcionForm, "devolucion">(
    recepciones.items,
    EMPTY_RECEPCION,
  )
  const [devolucion, setDevolucion] = useState<DevolucionForm>(EMPTY_DEVOLUCION)

  const { search, matches } = filters
  const filteredData = useMemo(
    () =>
      recepciones.items.filter(
        (r) =>
          matches("tipo", r.tipo) &&
          matches("estado", r.estado) &&
          matchesSearch(search, [r.codigo, r.evento, r.proveedor, r.responsable]),
      ),
    [recepciones.items, search, matches],
  )

  const openCreate = () => modal.openCreate({ fecha: todayISO() })
  const openEdit = (item: Recepcion) => modal.openEdit(item, { ...item })
  const openDevolucion = (item: Recepcion) => {
    setDevolucion(devolucionInicial(item))
    modal.open("devolucion", item)
  }

  const handleStatusChange = (id: string, estado: EstadoRecepcion) =>
    actions.changeStatus(id, { estado }, estado)

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const error = validateRecepcion(modal.editForm)
    if (error) {
      toast.error(error)
      return
    }
    const data = normalizeRecepcion(modal.editForm)
    const saved = modal.selected
      ? await actions.update(modal.selected.id, data)
      : await actions.create(data)
    if (saved) modal.close()
  }

  const handleDevolucion = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!modal.selected) return
    if (await actions.create(nuevaDevolucion(modal.selected, devolucion))) modal.close()
  }

  return (
    <ListPage
      overlays={
        <>
          <RecepcionDetailDrawer
            isOpen={modal.mode === "view"}
            item={modal.selected}
            onClose={modal.close}
            onEdit={openEdit}
            onDevolucion={openDevolucion}
          />
          <RecepcionFormDrawer
            isOpen={modal.mode === "form"}
            isEditing={modal.isEditing}
            saving={actions.saving}
            form={modal.editForm}
            setForm={modal.setEditForm}
            onClose={modal.close}
            onSubmit={(e) => void handleSubmit(e)}
            eventos={eventos.items}
            proveedores={proveedores.items}
            equipos={equipos.items}
            empleados={empleados.items}
          />
          <RecepcionDevolucionDrawer
            isOpen={modal.mode === "devolucion"}
            origen={modal.selected}
            empleados={empleados.items}
            saving={actions.saving}
            form={devolucion}
            setForm={setDevolucion}
            onClose={modal.close}
            onSubmit={(e) => void handleDevolucion(e)}
          />
        </>
      }
    >
      <PageHeader
        title="Recepciones"
        actionLabel="Crear recepción"
        onAction={openCreate}
        {...filters.headerProps}
      >
        <FilterSelect
          label="Tipo"
          value={filters.get("tipo")}
          onChange={(val) => filters.set("tipo", val)}
          options={withAllOption("Todos los tipos", TIPO_RECEPCION_OPTIONS)}
        />
        <FilterSelect
          label="Estado"
          value={filters.get("estado")}
          onChange={(val) => filters.set("estado", val)}
          options={withAllOption("Todos los estados", ESTADO_RECEPCION_OPTIONS)}
        />
      </PageHeader>

      <RecepcionesKPIs recepciones={recepciones.items} />

      <IndexTabs
        tabs={buildTabs(
          recepciones.items,
          (r) => r.estado,
          ESTADO_RECEPCION_TABS,
          "Todas",
        )}
        activeTab={filters.get("estado")}
        onTabChange={(tab) => filters.set("estado", tab)}
      />

      <DataTable
        itemLabel={RECEPCION_LABEL.plural}
        columns={getRecepcionColumns(handleStatusChange)}
        data={filteredData}
        getName={(r) => r.codigo}
        loading={recepciones.loading}
        error={recepciones.error}
        onRetry={() => void recepciones.refresh()}
        resetKey={filters.resetKey}
        isFiltered={filters.isFiltered}
        onResetFilters={filters.resetAll}
        onCreate={openCreate}
        onView={modal.openView}
        onEdit={openEdit}
        onDelete={(item) => void actions.remove(item)}
        extraActions={[
          {
            label: "Registrar devolución",
            icon: ArrowLeftCircle,
            onClick: openDevolucion,
            tone: "success",
            isVisible: admiteDevolucion,
          },
        ]}
        empty={{
          icon: FileCheck,
          title: "Aún no tienes recepciones registradas",
          description: "Registra entregas y devoluciones de equipos con proveedores.",
          createLabel: "Crear recepción",
        }}
      />
    </ListPage>
  )
}
