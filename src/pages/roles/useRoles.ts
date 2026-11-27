import { useCallback, useEffect, useMemo, useState } from "react"
import { useCrudResource, type CrudResource } from "@/hooks/useCrudResource"
import { apiClient } from "@/services/apiClient"
import { getErrorMessage } from "@/utils/errors"
import type { Rol } from "./types"

type RolBase = Omit<Rol, "permisos">
type PermisosPorRol = Record<string, string[]>

const permisosUrl = (id: string) => `/roles/${id}/permisos`

/**
 * Los permisos viven en un subrecurso del rol: este hook los une para que el
 * resto del módulo trabaje con un único `Rol`, como en los demás listados.
 */
export function useRoles(): CrudResource<Rol> {
  const base = useCrudResource<RolBase>({ endpoint: "/roles" })
  const [permisos, setPermisos] = useState<PermisosPorRol>({})
  const [error, setError] = useState<string | null>(null)

  const faltantes = base.items
    .filter((rol) => !(rol.id in permisos))
    .map((rol) => rol.id)
    .join(",")

  useEffect(() => {
    if (!faltantes) return
    let cancelled = false
    const load = async () => {
      try {
        const entries = await Promise.all(
          faltantes
            .split(",")
            .map(
              async (id) => [id, await apiClient.get<string[]>(permisosUrl(id))] as const,
            ),
        )
        if (!cancelled)
          setPermisos((prev) => ({ ...prev, ...Object.fromEntries(entries) }))
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err))
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [faltantes])

  const items = useMemo(
    () =>
      base.items
        .filter((rol) => rol.id in permisos)
        .map((rol) => ({ ...rol, permisos: permisos[rol.id] })),
    [base.items, permisos],
  )

  const savePermisos = async (id: string, next: string[]) => {
    const saved = await apiClient.put<string[]>(permisosUrl(id), next)
    setPermisos((prev) => ({ ...prev, [id]: saved }))
    return saved
  }

  const createItem = async ({
    permisos: nuevos = [],
    ...data
  }: Partial<Omit<Rol, "id">>) => {
    const created = await base.createItem(data)
    try {
      return { ...created, permisos: await savePermisos(created.id, nuevos) }
    } catch (err) {
      throw new Error(
        `El rol se creó sin permisos: edítalo para asignarlos. ${getErrorMessage(err)}`,
        { cause: err },
      )
    }
  }

  const updateItem = async (id: string, { permisos: nuevos, ...data }: Partial<Rol>) => {
    const saved = await base.updateItem(id, data)
    return {
      ...saved,
      permisos: nuevos ? await savePermisos(id, nuevos) : (permisos[id] ?? []),
    }
  }

  const { refresh: refreshBase } = base
  const refresh = useCallback(async () => {
    setError(null)
    setPermisos({})
    await refreshBase()
  }, [refreshBase])

  return {
    items,
    loading: base.loading || (Boolean(faltantes) && !error),
    error: base.error ?? error,
    refresh,
    createItem,
    updateItem,
    removeItem: base.removeItem,
  }
}
