import { useMemo, useState, type SubmitEvent } from "react"
import { HandHelping, PackageCheck, RotateCcw } from "lucide-react"
import { useNavigate } from "react-router-dom"
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
import { useDisponibilidad } from "@/pages/equipos/useDisponibilidad"
import type { EventoItem } from "@/pages/eventos/types"
import { isOpenRecord } from "@/routes/navigationState"
import { ROUTE_PATHS } from "@/routes/paths"
import { todayISO } from "@/utils/format"
import { buildTabs, matchesSearch, withAllOption } from "@/utils/list"
import { getPrestamoColumns } from "./components/prestamoColumns"
import {
  ESTADO_PRESTAMO_OPTIONS,
  ESTADO_PRESTAMO_TABS,
  PRESTAMO_FILTERS,
  PRESTAMO_LABEL,
} from "./constants"
import { PrestamoDetailDrawer } from "./drawers/PrestamoDetailDrawer"
import { PrestamoFormDrawer } from "./drawers/PrestamoFormDrawer"
import { PrestamoReturnDrawer } from "./drawers/PrestamoReturnDrawer"
import {
  admiteDevolucion,
  admiteSalida,
  devolucionInicial,
  devolucionToChanges,
  EMPTY_DEVOLUCION,
  EMPTY_PRESTAMO,
  rangoPrestamo,
  validateDevolucion,
  validatePrestamo,
} from "./form"
import type { PrestamoEstado, PrestamoForm, PrestamoItem } from "./types"
import { MODULE_ACCESS } from "@/constants/access"

export default function PrestamosPage() {
  const toast = useToast()
  const navigate = useNavigate()
  const prestamos = useCrudResource<PrestamoItem>({ endpoint: "/prestamos" })
  const empleados = useCrudResource<EmpleadoItem>({ endpoint: "/empleados" })
  const eventos = useCrudResource<EventoItem>({ endpoint: "/eventos" })
  const equipos = useCrudResource<EquipoItem>({ endpoint: "/equipos" })
  const actions = useCrudActions(prestamos, PRESTAMO_LABEL, (p) => p.codigo)
  const filters = useListFilters(PRESTAMO_FILTERS)
  const modal = useRecordModal<PrestamoItem, PrestamoForm, "return">(
    prestamos.items,
    EMPTY_PRESTAMO,
  )
  const disponibilidad = useDisponibilidad(
    rangoPrestamo(modal.editForm, eventos.items),
    modal.editForm.evento_id === undefined ? undefined : String(modal.editForm.evento_id),
  )
  const [devolucion, setDevolucion] = useState(EMPTY_DEVOLUCION)

  useNavigationState(isOpenRecord, ({ openId }) => modal.openById(openId))

  const { search, matches } = filters
  const filteredData = useMemo(
    () =>
      prestamos.items.filter(
        (p) =>
          matches("estado", p.estado) &&
          matchesSearch(search, [p.responsable, p.evento, p.codigo]),
      ),
    [prestamos.items, search, matches],
  )

  const openCreate = () => modal.openCreate({ fechaSalida: todayISO() })
  const openEdit = (item: PrestamoItem) => modal.openEdit(item, { ...item })
  const openReturn = (item: PrestamoItem) => {
    setDevolucion(devolucionInicial(item))
    modal.open("return", item)
  }

  const handleStatusChange = (id: string, estado: PrestamoEstado) =>
    actions.changeStatus(id, { estado }, estado)

  const handleSalida = (item: PrestamoItem) => handleStatusChange(item.id, "Activo")

  /** `RCP-007` → `7`. */
  const openRecepcion = (codigo: string) =>
    void navigate(ROUTE_PATHS.recepciones, {
      state: { openId: String(Number(codigo.replace(/\D/g, ""))) },
    })

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const error = validatePrestamo(modal.editForm)
    if (error) {
      toast.error(error)
      return
    }
    const saved = modal.selected
      ? await actions.update(modal.selected.id, modal.editForm)
      : await actions.create({ ...modal.editForm, estado: "Activo" })
    if (saved) modal.close()
  }

  const handleReturn = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!modal.selected) return
    const error = validateDevolucion(devolucion, modal.selected)
    if (error) {
      toast.error(error)
      return
    }
    const changes = devolucionToChanges(modal.selected, devolucion)
    const message = `Devolución registrada: ${changes.estado}`
    if (await actions.update(modal.selected.id, changes, message)) modal.close()
  }

  return (
    <ListPage
      overlays={
        <>
          <PrestamoDetailDrawer
            isOpen={modal.mode === "view"}
            item={modal.selected}
            onClose={modal.close}
            onEdit={openEdit}
            onSalida={(item) => void handleSalida(item)}
            onDevolucion={openReturn}
            onOpenRecepcion={openRecepcion}
          />
          <PrestamoFormDrawer
            isOpen={modal.mode === "form"}
            isEditing={modal.isEditing}
            saving={actions.saving}
            form={modal.editForm}
            setForm={modal.setEditForm}
            onClose={modal.close}
            onSubmit={(e) => void handleSubmit(e)}
            empleados={empleados.items}
            eventos={eventos.items}
            equipos={equipos.items}
            getDisponibilidad={disponibilidad.get}
          />
          <PrestamoReturnDrawer
            isOpen={modal.mode === "return"}
            prestamo={modal.selected}
            saving={actions.saving}
            form={devolucion}
            setForm={setDevolucion}
            onClose={modal.close}
            onSubmit={(e) => void handleReturn(e)}
          />
        </>
      }
    >
      <PageHeader title="Préstamos" actionLabel="Crear préstamo" onAction={openCreate} />

      <IndexCard>
        <IndexFilters
          tabs={buildTabs(prestamos.items, (p) => p.estado, ESTADO_PRESTAMO_TABS)}
          activeTab={filters.get("estado")}
          onTabChange={(tab) => filters.set("estado", tab)}
          loading={prestamos.loading}
          {...filters.indexProps}
        >
          <FilterSelect
            label="Estado"
            value={filters.get("estado")}
            onChange={(val) => filters.set("estado", val)}
            options={withAllOption("Todos los estados", ESTADO_PRESTAMO_OPTIONS)}
          />
        </IndexFilters>
        <DataTable
          itemLabel={PRESTAMO_LABEL.plural}
          columns={getPrestamoColumns(handleStatusChange)}
          data={filteredData}
          getName={(p) => p.codigo}
          loading={prestamos.loading}
          error={prestamos.error}
          onRetry={() => void prestamos.refresh()}
          resetKey={filters.resetKey}
          isFiltered={filters.isFiltered}
          onResetFilters={filters.resetAll}
          onCreate={openCreate}
          onView={modal.openView}
          onEdit={openEdit}
          onDelete={(item) => void actions.remove(item)}
          extraActions={[
            {
              label: "Confirmar salida",
              icon: PackageCheck,
              onClick: (item) => void handleSalida(item),
              tone: "success",
              isVisible: admiteSalida,
              needs: MODULE_ACCESS.prestamos.status,
            },
            {
              label: "Registrar devolución",
              icon: RotateCcw,
              onClick: openReturn,
              tone: "success",
              isVisible: admiteDevolucion,
            },
          ]}
          empty={{
            icon: HandHelping,
            title: "Aún no tienes préstamos creados",
            description:
              "Registra la entrega de equipos propios a un responsable y evento.",
            createLabel: "Crear préstamo",
          }}
        />
      </IndexCard>
    </ListPage>
  )
}
