import type { SubmitEvent } from "react"
import { useToast } from "@/components/Toast"
import type { useCategoryCatalog } from "@/hooks/useCategoryCatalog"
import { useCrudActions } from "@/hooks/useCrudActions"
import type { CrudResource } from "@/hooks/useCrudResource"
import { useRecordModal } from "@/hooks/useRecordModal"
import { SERVICIO_LABEL } from "./constants"
import { EMPTY_SERVICIO, normalizeServicio, validateServicio } from "./form"
import type { ServicioForm, ServicioItem } from "./types"

/**
 * Alta de un servicio sin salir del formulario que lo necesita:
 * `<ServicioFormDrawer {...crearServicio.drawer} />`.
 */
export function useCrearServicio(
  servicios: CrudResource<ServicioItem>,
  categorias: ReturnType<typeof useCategoryCatalog>,
  onCreated: (nombre: string) => void,
) {
  const toast = useToast()
  const actions = useCrudActions(servicios, SERVICIO_LABEL, (s) => s.nombre)
  const modal = useRecordModal<ServicioItem, ServicioForm>(
    servicios.items,
    EMPTY_SERVICIO,
  )

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const error = validateServicio(modal.editForm)
    if (error) {
      toast.error(error)
      return
    }
    const data = normalizeServicio(modal.editForm)
    if (!(await actions.create(data))) return
    onCreated(data.nombre)
    modal.close()
  }

  return {
    open: (nombre = "") =>
      modal.openCreate({ nombre, categoria: categorias.names[0] ?? "" }),
    drawer: {
      isOpen: modal.mode === "form",
      isEditing: false,
      saving: actions.saving,
      form: modal.editForm,
      setForm: modal.setEditForm,
      onClose: modal.close,
      onSubmit: (e: SubmitEvent<HTMLFormElement>) => void handleSubmit(e),
      categorias: categorias.names,
      onCreateCategoria: categorias.quickCreate,
    },
  }
}
