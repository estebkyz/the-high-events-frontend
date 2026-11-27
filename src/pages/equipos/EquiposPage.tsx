import type { SubmitEvent } from "react"
import { Boxes, Layers } from "lucide-react"
import { CategoryManagerDrawer } from "@/components/CategoryManagerDrawer"
import { PageHeader } from "@/components/PageHeader"
import { useToast } from "@/components/Toast"
import { DataTable } from "@/components/list/DataTable"
import { FilterDate, FilterSelect } from "@/components/list/FilterField"
import { HeaderButton } from "@/components/list/HeaderButton"
import { IndexCard } from "@/components/list/IndexCard"
import { IndexFilters } from "@/components/list/IndexFilters"
import { ListPage } from "@/components/list/ListPage"
import { useCategoryCatalog } from "@/hooks/useCategoryCatalog"
import { useCrudActions } from "@/hooks/useCrudActions"
import { useCrudResource } from "@/hooks/useCrudResource"
import { FILTER_ALL, useListFilters } from "@/hooks/useListFilters"
import { useNavigationState } from "@/hooks/useNavigationState"
import { useRecordModal } from "@/hooks/useRecordModal"
import type { ProveedorItem } from "@/pages/proveedores/types"
import { isProveedorToEquipo } from "@/routes/navigationState"
import { buildTabs, matchesSearch, toOptions, withAllOption } from "@/utils/list"
import { EquiposKPIs } from "./components/EquiposKPIs"
import { getEquipoColumns } from "./components/equipoColumns"
import {
  DISPONIBILIDAD_OPTIONS,
  EQUIPO_FILTERS,
  EQUIPO_LABEL,
  ESTADO_OPERATIVO_OPTIONS,
  ESTADO_OPERATIVO_TABS,
} from "./constants"
import { EquipoDetailDrawer } from "./drawers/EquipoDetailDrawer"
import { EquipoFormDrawer } from "./drawers/EquipoFormDrawer"
import { EMPTY_EQUIPO, equipoDeProveedor, normalizeEquipo, validateEquipo } from "./form"
import type { EquipoForm, EquipoItem, EstadoOperativo } from "./types"
import { useDisponibilidad } from "./useDisponibilidad"
import { estadoDisponibilidad, rangoDeDias } from "./utils"

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

  useNavigationState(isProveedorToEquipo, (state) =>
    modal.openCreate(equipoDeProveedor(state)),
  )

  const fecha = (key: "desde" | "hasta") =>
    filters.get(key) === FILTER_ALL ? "" : filters.get(key)
  const setDesde = (val: string) => {
    filters.set("desde", val || FILTER_ALL)
    // Sin fecha inicial la final no aplica.
    if (!val) filters.set("hasta", FILTER_ALL)
  }
  const disponibilidad = useDisponibilidad(rangoDeDias(fecha("desde"), fecha("hasta")))

  const { search, matches } = filters
  const filteredData = equipos.items.filter(
    (e) =>
      matches("categoria", e.categoria) &&
      matches("estado", e.estadoOperativo) &&
      matches("disponibilidad", estadoDisponibilidad(disponibilidad.get(e.id))) &&
      matchesSearch(search, [e.nombre, e.serie]),
  )

  const byCategoria = (nombre: string) =>
    equipos.items.filter((e) => e.categoria === nombre)

  const openCreate = () => modal.openCreate({ categoria: catalogo.names[0] ?? "" })
  const openEdit = (item: EquipoItem) => modal.openEdit(item, { ...item })

  // La disponibilidad depende del estado: se vuelve a consultar.
  const handleStatusChange = async (id: string, estado: EstadoOperativo) => {
    const saved = await actions.changeStatus(id, { estadoOperativo: estado }, estado)
    if (saved) await disponibilidad.refresh()
  }

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
    if (!saved) return
    modal.close()
    await disponibilidad.refresh()
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
            disponibilidad={disponibilidad.get(modal.selected?.id ?? "")}
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
        extraControls={
          <HeaderButton
            icon={Layers}
            label={
              catalogo.resource.loading
                ? "Categorías"
                : `Categorías (${catalogo.names.length})`
            }
            needs={["equipos.categorias"]}
            onClick={() => modal.open("categorias")}
          />
        }
      />

      <EquiposKPIs loading={equipos.loading} equipos={equipos.items} />

      <IndexCard>
        <IndexFilters
          tabs={buildTabs(equipos.items, (e) => e.estadoOperativo, ESTADO_OPERATIVO_TABS)}
          activeTab={filters.get("estado")}
          onTabChange={(tab) => filters.set("estado", tab)}
          loading={equipos.loading}
          {...filters.indexProps}
        >
          <FilterDate
            label="Disponibilidad desde"
            value={fecha("desde")}
            onChange={setDesde}
          />
          <FilterDate
            label="Disponibilidad hasta"
            value={fecha("hasta")}
            min={fecha("desde")}
            disabled={!fecha("desde")}
            onChange={(val) => filters.set("hasta", val || FILTER_ALL)}
          />
          <FilterSelect
            label="Disponibilidad"
            value={filters.get("disponibilidad")}
            onChange={(val) => filters.set("disponibilidad", val)}
            options={withAllOption("Todas", DISPONIBILIDAD_OPTIONS)}
          />
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
        </IndexFilters>
        <DataTable
          itemLabel={EQUIPO_LABEL.plural}
          columns={getEquipoColumns(handleStatusChange, disponibilidad.get)}
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
            title: "Aún no tienes equipos en el inventario creados",
            description:
              "Registra equipos técnicos, audiovisuales o mobiliario para gestionar su disponibilidad.",
            createLabel: "Crear equipo",
          }}
        />
      </IndexCard>
    </ListPage>
  )
}
