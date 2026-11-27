import type { Dispatch, SetStateAction } from "react"

/** `const set = fieldSetter(setForm)` → `set({ nombre: "..." })`. */
export function fieldSetter<F extends object>(setForm: Dispatch<SetStateAction<F>>) {
  return (changes: Partial<F>) => setForm((form) => ({ ...form, ...changes }))
}
