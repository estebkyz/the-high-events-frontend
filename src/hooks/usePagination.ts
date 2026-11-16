import { useMemo, useState } from "react"

export function usePagination<T>(items: T[], initialPageSize = 10) {
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, currentPage, pageSize])

  return {
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  }
}
