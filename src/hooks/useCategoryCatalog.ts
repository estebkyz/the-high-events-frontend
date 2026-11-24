import { useMemo } from "react"
import { useToast } from "@/components/Toast"
import { useCrudResource } from "@/hooks/useCrudResource"
import type { CategoriaItem } from "@/types"
import { getErrorMessage } from "@/utils/errors"

/** Catálogo de categorías con creación rápida desde un selector. */
export function useCategoryCatalog(endpoint: string) {
  const toast = useToast()
  const resource = useCrudResource<CategoriaItem>({ endpoint })
  const names = useMemo(() => resource.items.map((c) => c.nombre), [resource.items])

  const create = async (nombre: string) => {
    try {
      await resource.createItem({ nombre, descripcion: "", estado: "Activo" })
      toast.success("Categoría creada exitosamente")
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const quickCreate = (value: string) => {
    const nombre = value.trim()
    const exists = names.some((n) => n.toLowerCase() === nombre.toLowerCase())
    if (nombre && !exists) void create(nombre)
  }

  return { resource, names, quickCreate }
}
