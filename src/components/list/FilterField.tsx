import type { ReactNode } from "react"
import { CustomSelect, type SelectOption } from "@/components/CustomSelect"
import { SegmentedControl } from "@/components/SegmentedControl"

interface FilterFieldProps {
  label: string
  children: ReactNode
}

/** Etiqueta + control dentro del panel de filtros. */
function FilterField({ label, children }: FilterFieldProps) {
  return (
    <div>
      <span
        aria-hidden="true"
        className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block"
      >
        {label}
      </span>
      {children}
    </div>
  )
}

interface FilterControlProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
}

/** Filtro desplegable (más de 3 opciones). */
export function FilterSelect({ label, ...select }: FilterControlProps) {
  return (
    <FilterField label={label}>
      <CustomSelect {...select} ariaLabel={label} />
    </FilterField>
  )
}

/** Filtro segmentado (hasta 3 opciones). */
export function FilterSegmented(props: FilterControlProps) {
  return (
    <FilterField label={props.label}>
      <SegmentedControl {...props} />
    </FilterField>
  )
}
