import { useCallback, useMemo, useState } from "react"

/** Valor que significa "sin filtrar". */
export const FILTER_ALL = "Todos"

/**
 * Búsqueda + filtros de un listado. Recibe el mapa `clave → etiqueta` (constante
 * fuera del componente) y deriva píldoras, contador y botones de limpiar.
 */
export function useListFilters<K extends string>(labels: Record<K, string>) {
  const [search, setSearch] = useState("")
  const [values, setValues] = useState<Partial<Record<K, string>>>({})

  const get = useCallback((key: K): string => values[key] ?? FILTER_ALL, [values])

  const set = useCallback((key: K, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }, [])

  const matches = useCallback(
    (key: K, value: string | undefined) => get(key) === FILTER_ALL || get(key) === value,
    [get],
  )

  const resetFilters = useCallback(() => setValues({}), [])
  const resetAll = useCallback(() => {
    setSearch("")
    setValues({})
  }, [])

  const pills = useMemo(
    () =>
      (Object.keys(labels) as K[])
        .filter((key) => get(key) !== FILTER_ALL)
        .map((key) => ({
          key,
          label: `${labels[key]}: ${get(key)}`,
          onClear: () => set(key, FILTER_ALL),
        })),
    [labels, get, set],
  )

  return {
    search,
    get,
    set,
    matches,
    resetAll,
    isFiltered: Boolean(search.trim()) || pills.length > 0,
    /** Cambia con cualquier filtro: se pasa a `DataTable` para volver a la página 1. */
    resetKey: JSON.stringify([search, values]),
    /** Props listas para `<PageHeader {...filters.headerProps} />`. */
    headerProps: {
      searchValue: search,
      onSearchChange: setSearch,
      activeFilterCount: pills.length,
      activeFilterPills: pills,
      onResetFilters: resetFilters,
    },
  }
}
