import { useCallback, useState } from "react"

export type BaseModalMode = "closed" | "view" | "form"

/**
 * Patrón único de modales por módulo: un solo `mode`, el registro seleccionado
 * derivado de la lista (siempre al día) y un único `editForm`.
 * `Extra` agrega flujos propios: `useRecordModal<T, F, "return">`.
 */
export function useRecordModal<
  T extends { id: string },
  F extends object,
  Extra extends string = never,
>(items: T[], emptyForm: F) {
  type Mode = BaseModalMode | Extra

  const [mode, setMode] = useState<Mode>("closed")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<F>(emptyForm)

  const selected = items.find((item) => item.id === selectedId) ?? null

  const open = useCallback((nextMode: Mode, item?: T) => {
    setSelectedId(item?.id ?? null)
    setIsEditing(false)
    setMode(nextMode)
  }, [])

  const openForm = useCallback((form: F, item?: T) => {
    setSelectedId(item?.id ?? null)
    setIsEditing(Boolean(item))
    setEditForm(form)
    setMode("form")
  }, [])

  const openCreate = useCallback(
    (overrides?: Partial<F>) => openForm({ ...emptyForm, ...overrides }),
    [emptyForm, openForm],
  )

  const close = useCallback(() => {
    setMode("closed")
    setSelectedId(null)
    setIsEditing(false)
  }, [])

  return {
    mode,
    selected,
    isEditing,
    editForm,
    setEditForm,
    /** Abre el formulario de creación (con valores iniciales opcionales). */
    openCreate,
    /** Abre el formulario de edición con el registro dado. */
    openEdit: (item: T, form: F) => openForm(form, item),
    openView: (item: T) => open("view", item),
    /** Abre el detalle de un registro que quizá aún se está cargando. */
    openById: (id: string) => {
      setSelectedId(id)
      setIsEditing(false)
      setMode("view")
    },
    open,
    close,
  }
}
