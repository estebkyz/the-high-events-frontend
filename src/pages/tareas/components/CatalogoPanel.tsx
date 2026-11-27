import { useMemo, type SubmitEvent } from "react"
import { BookOpen } from "lucide-react"
import { useToast } from "@/components/Toast"
import { DataTable } from "@/components/list/DataTable"
import { useCrudActions } from "@/hooks/useCrudActions"
import type { CrudResource } from "@/hooks/useCrudResource"
import type { useRecordModal } from "@/hooks/useRecordModal"
import { matchesSearch } from "@/utils/list"
import { TAREA_LABEL } from "../constants"
import { TareaCatalogoFormDrawer } from "../drawers/TareaCatalogoFormDrawer"
import { asignacionesDe, normalizeCatalogo, validateCatalogo } from "../form"
import type { TareaCatalogoForm, TareaCatalogoItem, TareaItem } from "../types"
import { getCatalogoColumns } from "./tareaColumns"

interface CatalogoPanelProps {
  catalogo: CrudResource<TareaCatalogoItem>
  tareas: CrudResource<TareaItem>
  modal: ReturnType<typeof useRecordModal<TareaCatalogoItem, TareaCatalogoForm>>
  search: string
  matchesFase: (fase: string) => boolean
  isFiltered: boolean
  onResetFilters: () => void
  resetKey: string
}

/** Vista "Catálogo": plantillas asignables al crear eventos. */
export function CatalogoPanel({
  catalogo,
  tareas,
  modal,
  search,
  matchesFase,
  isFiltered,
  onResetFilters,
  resetKey,
}: CatalogoPanelProps) {
  const toast = useToast()
  const actions = useCrudActions(catalogo, TAREA_LABEL, (c) => c.nombre_tarea)

  const filteredData = useMemo(
    () =>
      catalogo.items.filter(
        (c) =>
          matchesFase(c.fase_sugerida) &&
          matchesSearch(search, [c.nombre_tarea, c.descripcion, c.codigo]),
      ),
    [catalogo.items, search, matchesFase],
  )

  const openEdit = (item: TareaCatalogoItem) => modal.openEdit(item, { ...item })

  const handleDelete = (item: TareaCatalogoItem) => {
    if (asignacionesDe(item, tareas.items).length > 0) {
      toast.error(`No puedes eliminar "${item.nombre_tarea}": está asignada a un evento`)
      return
    }
    void actions.remove(item)
  }

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const error = validateCatalogo(modal.editForm)
    if (error) {
      toast.error(error)
      return
    }
    const { selected } = modal
    const data = normalizeCatalogo(modal.editForm)
    if (!selected) {
      if (await actions.create(data)) modal.close()
      return
    }
    if (!(await actions.update(selected.id, data))) return
    modal.close()
    // Las asignaciones muestran el nombre de su plantilla.
    await tareas.refresh()
  }

  return (
    <>
      <DataTable
        itemLabel={TAREA_LABEL.plural}
        columns={getCatalogoColumns(tareas.items)}
        data={filteredData}
        getName={(c) => c.nombre_tarea}
        loading={catalogo.loading}
        error={catalogo.error}
        onRetry={() => void catalogo.refresh()}
        resetKey={resetKey}
        isFiltered={isFiltered}
        onResetFilters={onResetFilters}
        onCreate={() => modal.openCreate()}
        onEdit={openEdit}
        onDelete={handleDelete}
        empty={{
          icon: BookOpen,
          title: "Aún no hay tareas en el catálogo",
          description: "Crea actividades estándar para asignarlas en tus eventos.",
          createLabel: "Crear tarea",
        }}
      />
      <TareaCatalogoFormDrawer
        isOpen={modal.mode === "form"}
        isEditing={modal.isEditing}
        saving={actions.saving}
        form={modal.editForm}
        setForm={modal.setEditForm}
        onClose={modal.close}
        onSubmit={(e) => void handleSubmit(e)}
      />
    </>
  )
}
