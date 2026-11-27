import { FILTER_ALL } from "@/hooks/useListFilters"
import type { IndexTabItem } from "@/components/IndexTabs"

interface Option {
  label: string
  value: string
}

/** Normaliza para buscar sin distinguir mayúsculas ni tildes. */
function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
}

/** `true` si el término está vacío o aparece en alguno de los campos. */
export function matchesSearch(
  search: string,
  fields: (string | null | undefined)[],
): boolean {
  const term = normalize(search.trim())
  return !term || fields.some((field) => normalize(field ?? "").includes(term))
}

/** Pestañas de vista rápida con conteo: "Todos" + una por cada valor. */
export function buildTabs<T>(
  items: T[],
  getValue: (item: T) => string | undefined,
  tabs: { id: string; label: string }[],
  allLabel = "Todos",
): IndexTabItem[] {
  return [
    { id: FILTER_ALL, label: allLabel, count: items.length },
    ...tabs.map((tab) => ({
      ...tab,
      count: items.filter((item) => getValue(item) === tab.id).length,
    })),
  ]
}

/** Convierte textos en opciones de selector. */
export function toOptions(values: readonly string[]): Option[] {
  return values.map((value) => ({ label: value, value }))
}

/** Antepone la opción "sin filtrar" a una lista de opciones. */
export function withAllOption(label: string, options: Option[]): Option[] {
  return [{ label, value: FILTER_ALL }, ...options]
}

/** Valores únicos y no vacíos, en orden de aparición. */
export function uniqueValues(values: (string | null | undefined)[]): string[] {
  return Array.from(new Set(values.filter((v): v is string => Boolean(v))))
}

/** Agrega o quita un valor de una lista. */
export function toggleValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((v) => v !== value) : [...values, value]
}
