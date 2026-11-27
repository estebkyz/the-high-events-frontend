import { useCallback, useEffect, useState } from "react"
import { apiClient } from "@/services/apiClient"
import { getCached, loadShared, setCached } from "@/services/resourceCache"
import { getErrorMessage } from "@/utils/errors"

interface UseCrudResourceOptions {
  /** Endpoint de la API (ej. "/clientes"). */
  endpoint: string
  /** `false`: la persona no puede leerlo, no se pide. */
  enabled?: boolean
}

export interface CrudResource<T extends { id: string }> {
  items: T[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  /** Sin `id` ni campos derivados (códigos, totales): los asigna el servidor. */
  createItem: (data: Partial<Omit<T, "id">>) => Promise<T>
  updateItem: (id: string, changes: Partial<T>) => Promise<T>
  removeItem: (id: string) => Promise<void>
}

interface LoadResult<T> {
  /** Sin `items`, se conserva lo que había en pantalla. */
  items?: T[]
  error: string | null
}

/**
 * Acceso a un recurso de la API. La lista local solo cambia cuando el servidor
 * confirma la operación, y toda mutación rechaza la promesa si falla: quien la
 * llama decide cómo avisar (normalmente a través de `useCrudActions`).
 */
export function useCrudResource<T extends { id: string }>({
  endpoint,
  enabled = true,
}: UseCrudResourceOptions): CrudResource<T> {
  const [items, setItems] = useState<T[]>(() => getCached<T>(endpoint) ?? [])
  const [loading, setLoading] = useState(() => enabled && !getCached(endpoint))
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async (): Promise<LoadResult<T>> => {
    try {
      const data = await loadShared(endpoint, async () => {
        const list = await apiClient.get<T[]>(endpoint)
        return Array.isArray(list) ? list : []
      })
      return { items: data, error: null }
    } catch (err) {
      return { items: getCached<T>(endpoint), error: getErrorMessage(err) }
    }
  }, [endpoint])

  const applyResult = useCallback((result: LoadResult<T>) => {
    setItems(result.items ?? [])
    setError(result.error)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    void fetchAll().then((result) => {
      if (!cancelled) applyResult(result)
    })
    return () => {
      cancelled = true
    }
  }, [enabled, fetchAll, applyResult])

  /** Cambia la lista en pantalla y la que verá la próxima visita. */
  const patch = useCallback(
    (change: (list: T[]) => T[]) => {
      setItems(change)
      const cached = getCached<T>(endpoint)
      if (cached) setCached(endpoint, change(cached))
    },
    [endpoint],
  )

  const refresh = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    setError(null)
    applyResult(await fetchAll())
  }, [enabled, fetchAll, applyResult])

  const createItem = useCallback(
    async (data: Partial<Omit<T, "id">>) => {
      const created = await apiClient.post<T>(endpoint, data)
      patch((prev) => [created, ...prev])
      return created
    },
    [endpoint, patch],
  )

  const updateItem = useCallback(
    async (id: string, changes: Partial<T>) => {
      // PUT reemplaza el registro: se envía completo para no borrar columnas.
      const current = items.find((item) => item.id === id)
      const saved = await apiClient.put<T>(`${endpoint}/${id}`, {
        ...current,
        ...changes,
      })
      patch((prev) => prev.map((item) => (item.id === id ? saved : item)))
      return saved
    },
    [endpoint, items, patch],
  )

  const removeItem = useCallback(
    async (id: string) => {
      await apiClient.delete(`${endpoint}/${id}`)
      patch((prev) => prev.filter((item) => item.id !== id))
    },
    [endpoint, patch],
  )

  return { items, loading, error, refresh, createItem, updateItem, removeItem }
}
