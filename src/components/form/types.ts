import type { Dispatch, SetStateAction, SubmitEvent } from "react"

/** Props comunes de todo `*FormDrawer`. `F` es el tipo del formulario. */
export interface FormDrawerProps<F> {
  isOpen: boolean
  isEditing: boolean
  saving: boolean
  form: F
  setForm: Dispatch<SetStateAction<F>>
  onClose: () => void
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void
}

/** Props comunes de todo `*DetailDrawer`. */
export interface DetailDrawerProps<T> {
  isOpen: boolean
  item: T | null
  onClose: () => void
  onEdit: (item: T) => void
}
