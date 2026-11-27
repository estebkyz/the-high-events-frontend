import { useCallback, useState } from "react"

/** Selección múltiple de filas para acciones masivas. */
export function useSelection() {
  const [ids, setIds] = useState<string[]>([])

  const toggle = useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }, [])

  const toggleMany = useCallback((pageIds: string[]) => {
    setIds((prev) =>
      pageIds.length > 0 && pageIds.every((id) => prev.includes(id))
        ? prev.filter((id) => !pageIds.includes(id))
        : Array.from(new Set([...prev, ...pageIds])),
    )
  }, [])

  const clear = useCallback(() => setIds([]), [])

  return { ids, toggle, toggleMany, clear }
}

export type Selection = ReturnType<typeof useSelection>
