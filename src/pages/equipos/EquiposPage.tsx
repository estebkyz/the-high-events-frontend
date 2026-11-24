import { useMemo, type SubmitEvent } from "react"
import { Boxes, Layers } from "lucide-react"
import { CategoryManagerDrawer } from "@/components/CategoryManagerDrawer"
import { IndexTabs } from "@/components/IndexTabs"
import { PageHeader } from "@/components/PageHeader"
import { useToast } from "@/components/Toast"
import { DataTable } from "@/components/list/DataTable"
import { FilterSelect } from "@/components/list/FilterField"
import { HeaderButton } from "@/components/list/HeaderButton"
import { ListPage } from "@/components/list/ListPage"
import { useCategoryCatalog } from "@/hooks/useCategoryCatalog"
import { useCrudActions } from "@/hooks/useCrudActions"
import { useCrudResource } from "@/hooks/useCrudResource"
import { useListFilters } from "@/hooks/useListFilters"
import { useRecordModal } from "@/hooks/useRecordModal"
import type { ProveedorItem } from "@/pages/proveedores/types"
import { buildTabs, matchesSearch, toOptions, withAllOption } from "@/utils/list"
import { EquiposKPIs } from "./components/EquiposKPIs"
import { getEquipoColumns } from "./components/equipoColumns"
import {
  EQUIPO_FILTERS,
  EQUIPO_LABEL,
  ESTADO_OPERATIVO_OPTIONS,
  ESTADO_OPERATIVO_TABS,
} from "./constants"
import { EquipoDetailDrawer } from "./drawers/EquipoDetailDrawer"
import { EquipoFormDrawer } from "./drawers/EquipoFormDrawer"
import { EMPTY_EQUIPO, normalizeEquipo, validateEquipo } from "./form"
import type { EquipoForm, EquipoItem, EstadoOperativo } from "./types"

export default function EquiposPage() {
  const toast = useToast()
  const equipos = useCrudResource<EquipoItem>({ endpoint: "/equipos" })
  const proveedores = useCrudResource<ProveedorItem>({ endpoint: "/proveedores" })
  const catalogo = useCategoryCatalog("/categorias-equipo")
  const actions = useCrudActions(equipos, EQUIPO_LABEL, (e) => e.nombre)
  const filters = useListFilters(EQUIPO_FILTERS)
  const modal = useRecordModal<EquipoItem, EquipoForm, "categorias">(
    equipos.items,
    EMPTY_EQUIPO,
  )

  const { search, matches } = filters
  const filteredData = useMemo(
    () =>
      equipos.items.filter(
        (e) =>
          matches("categoria", e.categoria) &&
          matches("estado", e.estadoOperativo) &&
          matchesSearch(search, [e.nombre, e.serie]),
      ),
    [equipos.items, search, matches],
  )

  const byCategoria = (nombre: string) =>
    equipos.items.filter((e) => e.categoria === nombre)

  const openCreate = () => modal.openCreate({ categoria: catalogo.names[0] ?? "" })
  const openEdit = (item: EquipoItem) => modal.openEdit(item, { ...item })

  const handleStatusChange = (id: string, estado: EstadoOperativo) =>
    actions.changeStatus(id, { estadoOperativo: estado }, estado)

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const error = validateEquipo(modal.editForm)
    if (error) {
      toast.error(error)
      return
    }
    const data = normalizeEquipo(modal.editForm)
    const saved = modal.selected
      ? await actions.update(modal.selected.id, data)
      : await actions.create(data)
    if (saved) modal.close()
  }

  return (
    <ListPage
      overlays={
        <>
          <EquipoDetailDrawer
            isOpen={modal.mode === "view"}
            item={modal.selected}
            onClose={modal.close}
            onEdit={openEdit}
            onStatusChange={handleStatusChange}
          />
          <EquipoFormDrawer
            isOpen={modal.mode === "form"}
            isEditing={modal.isEditing}
            saving={actions.saving}
            form={modal.editForm}
            setForm={modal.setEditForm}
            onClose={modal.close}
            onSubmit={(e) => void handleSubmit(e)}
            categorias={catalogo.names}
            proveedores={proveedores.items}
            onCreateCategoria={catalogo.quickCreate}
          />
          <CategoryManagerDrawer
            isOpen={modal.mode === "categorias"}
            onClose={modal.close}
            title="Categorías de equipos"
            placeholder="Ej. Accesorios"
            categories={catalogo.resource}
            countUsage={(nombre) => byCategoria(nombre).length}
            onRename={(previous, next) =>
              Promise.all(
                byCategoria(previous).map((e) =>
                  equipos.updateItem(e.id, { categoria: next }),
                ),
              )
            }
          />
        </>
      }
    >
      <PageHeader
        title="Equipos"
        actionLabel="Crear equipo"
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
          label="Estado operativo"
          value={filters.get("estado")}
          onChange={(val) => filters.set("estado", val)}
          options={withAllOption("Todos los estados", ESTADO_OPERATIVO_OPTIONS)}
        />
      </PageHeader>

      <EquiposKPIs equipos={equipos.items} />

      <IndexTabs
        tabs={buildTabs(equipos.items, (e) => e.estadoOperativo, ESTADO_OPERATIVO_TABS)}
        activeTab={filters.get("estado")}
        onTabChange={(tab) => filters.set("estado", tab)}
      />

      <DataTable
        itemLabel={EQUIPO_LABEL.plural}
        columns={getEquipoColumns(handleStatusChange)}
        data={filteredData}
        getName={(e) => e.nombre}
        loading={equipos.loading}
        error={equipos.error}
        onRetry={() => void equipos.refresh()}
        resetKey={filters.resetKey}
        isFiltered={filters.isFiltered}
        onResetFilters={filters.resetAll}
        onCreate={openCreate}
        onView={modal.openView}
        onEdit={openEdit}
        onDelete={(item) => void actions.remove(item)}
        empty={{
          icon: Boxes,
          title: "Aún no tienes equipos en el inventario",
          description:
            "Registra equipos técnicos, audiovisuales o mobiliario para gestionar su disponibilidad.",
          createLabel: "Crear equipo",
        }}
      />
    </ListPage>
  )
}
