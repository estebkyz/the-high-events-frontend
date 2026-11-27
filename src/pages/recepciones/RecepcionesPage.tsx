import { useMemo, useState, type SubmitEvent } from "react"
import { ArrowLeftCircle, FileCheck } from "lucide-react"
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
import type { EmpleadoItem } from "@/pages/empleados/types"
import type { EquipoItem } from "@/pages/equipos/types"
import type { EventoItem } from "@/pages/eventos/types"
import type { ProveedorItem } from "@/pages/proveedores/types"
import { isOpenRecord } from "@/routes/navigationState"
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
  devolucionPendiente,
  EMPTY_DEVOLUCION,
  EMPTY_RECEPCION,
  getOrigen,
  normalizeRecepcion,
  nuevaDevolucion,
  recepcionToForm,
  validateRecepcion,
} from "./form"
import type { DevolucionForm, EstadoRecepcion, Recepcion, RecepcionForm } from "./types"
import { MODULE_ACCESS } from "@/constants/access"

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

  useNavigationState(isOpenRecord, ({ openId }) => modal.openById(openId))

  const { search, matches } = filters
  const filteredData = useMemo(
    () =>
      recepciones.items.filter(
        (r) =>
          matches("tipo", r.tipo) &&
          matches("estado", r.estado) &&
          matchesSearch(search, [r.codigo, r.evento, getOrigen(r), r.responsable]),
      ),
    [recepciones.items, search, matches],
  )

  const openCreate = () => modal.openCreate({ fecha: todayISO() })
  const openEdit = (item: Recepcion) => modal.openEdit(item, recepcionToForm(item))
  const openDevolucion = (item: Recepcion) => {
    setDevolucion(devolucionInicial(item))
    modal.open("devolucion", item)
  }

  const puedeDevolver = (item: Recepcion) => admiteDevolucion(item, recepciones.items)

  // Confirmar un montaje prepara su devolución en el servidor: se vuelve a leer la lista.
  const handleStatusChange = async (id: string, estado: EstadoRecepcion) => {
    if (await actions.changeStatus(id, { estado }, estado)) await recepciones.refresh()
  }

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
    if (!saved) return
    modal.close()
    await recepciones.refresh()
  }

  const handleDevolucion = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!modal.selected) return
    const data = nuevaDevolucion(modal.selected, devolucion)
    const borrador = devolucionPendiente(modal.selected, recepciones.items)
    const saved = borrador
      ? await actions.update(borrador.id, data, "Devolución registrada")
      : await actions.create(data)
    if (saved) modal.close()
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
            admiteDevolucion={modal.selected !== null && puedeDevolver(modal.selected)}
            onConfirmar={(item) => void handleStatusChange(item.id, "Conforme")}
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
      />

      <RecepcionesKPIs loading={recepciones.loading} recepciones={recepciones.items} />

      <IndexCard>
        <IndexFilters
          tabs={buildTabs(
            recepciones.items,
            (r) => r.estado,
            ESTADO_RECEPCION_TABS,
            "Todas",
          )}
          activeTab={filters.get("estado")}
          onTabChange={(tab) => filters.set("estado", tab)}
          loading={recepciones.loading}
          {...filters.indexProps}
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
        </IndexFilters>
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
              isVisible: puedeDevolver,
              needs: MODULE_ACCESS.recepciones.create,
            },
          ]}
          empty={{
            icon: FileCheck,
            title: "Aún no tienes recepciones creadas",
            description:
              "Se preparan al asignar equipos a un evento; también puedes crearlas.",
            createLabel: "Crear recepción",
          }}
        />
      </IndexCard>
    </ListPage>
  )
}
