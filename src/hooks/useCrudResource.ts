import { useState, useEffect, useCallback } from "react"
import { apiClient } from "../services/apiClient"

interface UseCrudResourceOptions<T> {
  /** Endpoint de la API en el Backend (ej. "/clientes", "/eventos") */
  endpoint: string
  /** Clave opcional legacy (no se usa en modo 100% Base de Datos) */
  storageKey?: string
  /** Valor inicial opcional antes de que responda la BD (por defecto []) */
  initialData?: T[]
}

/**
 * Hook CRUD 100% Base de Datos (Producción):
 * - NO guarda ni lee nada de `localStorage`.
 * - Toda operación (Listar, Crear, Actualizar, Eliminar) va directamente
 *   al Backend (`VITE_API_URL`) y a la base de datos MySQL.
 */
export function useCrudResource<T extends { id: string }>({
  endpoint,
}: UseCrudResourceOptions<T>) {
  const [items, setItemsState] = useState<T[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiClient.get<T[]>(endpoint)
      setItemsState(Array.isArray(data) ? data : [])
      setIsBackendConnected(true)
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "No se pudo conectar con el servidor de base de datos"
      setError(msg)
      setIsBackendConnected(false)
      setItemsState([])
    } finally {
      setLoading(false)
    }
  }, [endpoint])

  useEffect(() => {
    void fetchAll()
  }, [fetchAll])

  const createItem = useCallback(
    async (newItem: Partial<T>): Promise<T> => {
      const created = await apiClient.post<T>(endpoint, newItem)
      setItemsState((prev) => [created, ...prev])
      return created
    },
    [endpoint],
  )

  const updateItem = useCallback(
    async (id: string, changes: Partial<T>): Promise<T> => {
      const updated = await apiClient.put<T>(`${endpoint}/${id}`, changes)
      setItemsState((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updated } : item)),
      )
      return updated
    },
    [endpoint],
  )

  const removeItem = useCallback(
    async (id: string): Promise<void> => {
      await apiClient.delete(`${endpoint}/${id}`)
      setItemsState((prev) => prev.filter((item) => item.id !== id))
    },
    [endpoint],
  )

  /**
   * Wrapper compatible con `setState` para páginas que actualizan la lista:
   * Detecta automáticamente si se creó, editó o eliminó un registro en la lista
   * y sincroniza la operación contra el Backend MySQL (`POST`, `PUT`, `DELETE`).
   */
  const setItems: React.Dispatch<React.SetStateAction<T[]>> = useCallback(
    (updater) => {
      setItemsState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater

        // 1. Detectar creación (hay un item en `next` que no existía en `prev`)
        if (next.length > prev.length) {
          const prevIds = new Set(prev.map((i) => i.id))
          const added = next.filter((i) => !prevIds.has(i.id))
          added.forEach((item) => {
            void apiClient
              .post<T>(endpoint, item)
              .then((saved) => {
                setItemsState((curr) =>
                  curr.map((c) => (c.id === item.id ? { ...c, ...saved } : c)),
                )
              })
              .catch((err) => {
                console.error(`[API POST ${endpoint}] Error:`, err)
                void fetchAll()
              })
          })
        }
        // 2. Detectar eliminación (hay items en `prev` que ya no están en `next`)
        else if (next.length < prev.length) {
          const nextIds = new Set(next.map((i) => i.id))
          const removed = prev.filter((i) => !nextIds.has(i.id))
          removed.forEach((item) => {
            void apiClient.delete(`${endpoint}/${item.id}`).catch((err) => {
              console.error(`[API DELETE ${endpoint}/${item.id}] Error:`, err)
              void fetchAll()
            })
          })
        }
        // 3. Detectar actualización (mismo tamaño, cambió algún objeto)
        else {
          const prevMap = new Map(prev.map((i) => [i.id, i]))
          next.forEach((item) => {
            const oldItem = prevMap.get(item.id)
            if (oldItem && JSON.stringify(oldItem) !== JSON.stringify(item)) {
              void apiClient
                .put<T>(`${endpoint}/${item.id}`, item)
                .then((saved) => {
                  setItemsState((curr) =>
                    curr.map((c) => (c.id === item.id ? { ...c, ...saved } : c)),
                  )
                })
                .catch((err) => {
                  console.error(`[API PUT ${endpoint}/${item.id}] Error:`, err)
                  void fetchAll()
                })
            }
          })
        }

        return next
      })
    },
    [endpoint, fetchAll],
  )

  return {
    items,
    setItems,
    loading,
    error,
    isBackendConnected,
    refresh: fetchAll,
    createItem,
    updateItem,
    removeItem,
  }
}
