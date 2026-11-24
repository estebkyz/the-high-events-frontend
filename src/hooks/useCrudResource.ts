import { useCallback, useEffect, useState } from "react"
import { apiClient } from "@/services/apiClient"
import { getErrorMessage } from "@/utils/errors"

interface UseCrudResourceOptions {
  /** Endpoint de la API (ej. "/clientes"). */
  endpoint: string
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
  items: T[]
  error: string | null
}

/**
 * Acceso a un recurso de la API. La lista local solo cambia cuando el servidor
 * confirma la operación, y toda mutación rechaza la promesa si falla: quien la
 * llama decide cómo avisar (normalmente a través de `useCrudActions`).
 */
export function useCrudResource<T extends { id: string }>({
  endpoint,
}: UseCrudResourceOptions): CrudResource<T> {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async (): Promise<LoadResult<T>> => {
    try {
      const data = await apiClient.get<T[]>(endpoint)
      return { items: Array.isArray(data) ? data : [], error: null }
    } catch (err) {
      return { items: [], error: getErrorMessage(err) }
    }
  }, [endpoint])

  const applyResult = useCallback((result: LoadResult<T>) => {
    setItems(result.items)
    setError(result.error)
    setLoading(false)
  }, [])

  useEffect(() => {
    let cancelled = false
    void fetchAll().then((result) => {
      if (!cancelled) applyResult(result)
    })
    return () => {
      cancelled = true
    }
  }, [fetchAll, applyResult])

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    applyResult(await fetchAll())
  }, [fetchAll, applyResult])

  const createItem = useCallback(
    async (data: Partial<Omit<T, "id">>) => {
      const created = await apiClient.post<T>(endpoint, data)
      setItems((prev) => [created, ...prev])
      return created
    },
    [endpoint],
  )

  const updateItem = useCallback(
    async (id: string, changes: Partial<T>) => {
      // PUT reemplaza el registro: se envía completo para no borrar columnas.
      const current = items.find((item) => item.id === id)
      const saved = await apiClient.put<T>(`${endpoint}/${id}`, {
        ...current,
        ...changes,
      })
      setItems((prev) => prev.map((item) => (item.id === id ? saved : item)))
      return saved
    },
    [endpoint, items],
  )

  const removeItem = useCallback(
    async (id: string) => {
      await apiClient.delete(`${endpoint}/${id}`)
      setItems((prev) => prev.filter((item) => item.id !== id))
    },
    [endpoint],
  )

  return { items, loading, error, refresh, createItem, updateItem, removeItem }
}
