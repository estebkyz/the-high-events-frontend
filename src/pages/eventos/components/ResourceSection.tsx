import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { CustomSelect, type SelectOption } from "@/components/CustomSelect"
import { EmptyState } from "@/components/EmptyState"

interface ResourceSectionProps {
  label: string
  /** Sin `picker` la sección es de solo lectura. */
  picker?: {
    placeholder: string
    options: SelectOption[]
    onAdd: (id: string) => void
    createLabel?: string
    onCreate?: (query: string) => void
  }
  summary?: ReactNode
  empty: { icon: LucideIcon; title: string; description: string }
  isEmpty: boolean
  children: ReactNode
}

/** Estructura común de Servicios, Equipos y Empleados del evento. */
export function ResourceSection({
  label,
  picker,
  summary,
  empty,
  isEmpty,
  children,
}: ResourceSectionProps) {
  return (
    <section aria-label={label} className="space-y-4">
      {picker && (
        <CustomSelect
          ariaLabel={picker.placeholder}
          value=""
          options={picker.options}
          searchable
          clearOnSelect
          placeholder={picker.placeholder}
          onChange={picker.onAdd}
          allowCreate={Boolean(picker.onCreate)}
          createLabel={picker.createLabel}
          onCreate={picker.onCreate}
        />
      )}
      {summary}
      {isEmpty ? (
        <EmptyState compact {...empty} />
      ) : (
        <div className="divide-y divide-[#2D3748]/60">{children}</div>
      )}
    </section>
  )
}
