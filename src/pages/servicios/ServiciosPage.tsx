import { useMemo, type SubmitEvent } from "react"
import { Layers } from "lucide-react"
import { CategoryManagerDrawer } from "@/components/CategoryManagerDrawer"
import { IndexTabs } from "@/components/IndexTabs"
import { PageHeader } from "@/components/PageHeader"
import { useToast } from "@/components/Toast"
import { DataTable } from "@/components/list/DataTable"
import { FilterSelect } from "@/components/list/FilterField"
import { HeaderButton } from "@/components/list/HeaderButton"
import { ListPage } from "@/components/list/ListPage"
import {
  ESTADO_ACTIVO_OPTIONS,
  ESTADO_ACTIVO_TABS,
  type EstadoActivo,
} from "@/constants/common"
import { useCategoryCatalog } from "@/hooks/useCategoryCatalog"
import { useCrudActions } from "@/hooks/useCrudActions"
import { useCrudResource } from "@/hooks/useCrudResource"
import { useListFilters } from "@/hooks/useListFilters"
import { useRecordModal } from "@/hooks/useRecordModal"
import type { ProveedorItem } from "@/pages/proveedores/types"
import { buildTabs, matchesSearch, toOptions, withAllOption } from "@/utils/list"
import { getServicioColumns } from "./components/servicioColumns"
import { SERVICIO_FILTERS, SERVICIO_LABEL } from "./constants"
import { ServicioDetailDrawer } from "./drawers/ServicioDetailDrawer"
import { ServicioFormDrawer } from "./drawers/ServicioFormDrawer"
import { EMPTY_SERVICIO, normalizeServicio, validateServicio } from "./form"
import type { ServicioForm, ServicioItem } from "./types"
import { findProveedoresDeServicio } from "./utils"

export default function ServiciosPage() {
  const toast = useToast()
  const servicios = useCrudResource<ServicioItem>({ endpoint: "/servicios" })
  const proveedores = useCrudResource<ProveedorItem>({ endpoint: "/proveedores" })
  const catalogo = useCategoryCatalog("/categorias-servicio")
  const actions = useCrudActions(servicios, SERVICIO_LABEL, (s) => s.nombre)
  const filters = useListFilters(SERVICIO_FILTERS)
  const modal = useRecordModal<ServicioItem, ServicioForm, "categorias">(
    servicios.items,
    EMPTY_SERVICIO,
  )

  const { search, matches } = filters
  const filteredData = useMemo(
    () =>
      servicios.items.filter(
        (s) =>
          matches("categoria", s.categoria) &&
          matches("estado", s.estado) &&
          matchesSearch(search, [s.nombre, s.descripcion]),
      ),
    [servicios.items, search, matches],
  )

  const byCategoria = (nombre: string) =>
    servicios.items.filter((s) => s.categoria === nombre)

  const openCreate = () => modal.openCreate({ categoria: catalogo.names[0] ?? "" })
  const openEdit = (item: ServicioItem) => modal.openEdit(item, { ...item })

  const handleStatusChange = (id: string, estado: EstadoActivo) =>
    actions.changeStatus(id, { estado }, estado)

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const error = validateServicio(modal.editForm)
    if (error) {
      toast.error(error)
      return
    }
    const data = normalizeServicio(modal.editForm)
    const saved = modal.selected
      ? await actions.update(modal.selected.id, data)
      : await actions.create(data)
    if (saved) modal.close()
  }

  return (
    <ListPage
      overlays={
        <>
          <ServicioDetailDrawer
            isOpen={modal.mode === "view"}
            item={modal.selected}
            onClose={modal.close}
            onEdit={openEdit}
            proveedores={
              modal.selected
                ? findProveedoresDeServicio(modal.selected, proveedores.items)
                : []
            }
          />
          <ServicioFormDrawer
            isOpen={modal.mode === "form"}
            isEditing={modal.isEditing}
            saving={actions.saving}
            form={modal.editForm}
            setForm={modal.setEditForm}
            onClose={modal.close}
            onSubmit={(e) => void handleSubmit(e)}
            categorias={catalogo.names}
            onCreateCategoria={catalogo.quickCreate}
          />
          <CategoryManagerDrawer
            isOpen={modal.mode === "categorias"}
            onClose={modal.close}
            title="Categorías de servicios"
            placeholder="Ej. Efectos especiales"
            categories={catalogo.resource}
            countUsage={(nombre) => byCategoria(nombre).length}
            onRename={(previous, next) =>
              Promise.all(
                byCategoria(previous).map((s) =>
                  servicios.updateItem(s.id, { categoria: next }),
                ),
              )
            }
          />
        </>
      }
    >
      <PageHeader
        title="Servicios"
        actionLabel="Crear servicio"
        onAction={openCreate}
        {...filters.headerProps}
        extraControls={
          <HeaderButton
            icon={Layers}
            label={`Categorías (${catalogo.names.length})`}
            onClick={() => modal.open("categorias")}
          />
        }
      >
        <FilterSelect
          label="Categoría"
          value={filters.get("categoria")}
          onChange={(val) => filters.set("categoria", val)}
          options={withAllOption("Todas las categorías", toOptions(catalogo.names))}
        />
        <FilterSelect
          label="Estado"
          value={filters.get("estado")}
          onChange={(val) => filters.set("estado", val)}
          options={withAllOption("Todos los estados", ESTADO_ACTIVO_OPTIONS)}
        />
      </PageHeader>

      <IndexTabs
        tabs={buildTabs(servicios.items, (s) => s.estado, ESTADO_ACTIVO_TABS)}
        activeTab={filters.get("estado")}
        onTabChange={(tab) => filters.set("estado", tab)}
      />

      <DataTable
        itemLabel={SERVICIO_LABEL.plural}
        columns={getServicioColumns(handleStatusChange)}
        data={filteredData}
        getName={(s) => s.nombre}
        loading={servicios.loading}
        error={servicios.error}
        onRetry={() => void servicios.refresh()}
        resetKey={filters.resetKey}
        isFiltered={filters.isFiltered}
        onResetFilters={filters.resetAll}
        onCreate={openCreate}
        onView={modal.openView}
        onEdit={openEdit}
        onDelete={(item) => void actions.remove(item)}
        empty={{
          icon: Layers,
          title: "Aún no tienes servicios en el catálogo",
          description:
            "Crea servicios técnicos o logísticos con tarifas base para cotizar.",
          createLabel: "Crear servicio",
        }}
      />
    </ListPage>
  )
}
