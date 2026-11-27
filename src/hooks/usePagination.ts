import { useMemo, useState } from "react"

/**
 * Paginación en memoria. Vuelve a la página 1 cuando cambia `resetKey` y nunca
 * queda en una página inexistente (p. ej. tras eliminar el último registro).
 */
export function usePagination<T>(items: T[], resetKey = "", initialPageSize = 10) {
  const [pageSize, setPageSizeState] = useState(initialPageSize)
  const [page, setPage] = useState(1)
  const [lastKey, setLastKey] = useState(resetKey)

  // Ajuste durante el render (patrón recomendado por React frente a un efecto).
  if (lastKey !== resetKey) {
    setLastKey(resetKey)
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const currentPage = Math.min(page, totalPages)

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, currentPage, pageSize])

  const setPageSize = (size: number) => {
    setPageSizeState(size)
    setPage(1)
  }

  return {
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage: setPage,
    totalPages,
    paginatedData,
  }
}
