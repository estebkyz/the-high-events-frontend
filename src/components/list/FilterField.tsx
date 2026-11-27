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
      <span aria-hidden="true" className="text-[13px] font-medium text-ink mb-1 block">
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

interface FilterDateProps {
  label: string
  /** `YYYY-MM-DD` o vacío. */
  value: string
  min?: string
  disabled?: boolean
  onChange: (value: string) => void
}

/** Filtro de fecha. */
export function FilterDate({ label, onChange, ...input }: FilterDateProps) {
  return (
    <FilterField label={label}>
      <input
        {...input}
        type="date"
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
        className="field"
      />
    </FilterField>
  )
}
