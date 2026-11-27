import type { ComponentProps } from "react"
import { CustomSelect } from "@/components/CustomSelect"

interface FormSelectProps extends Omit<ComponentProps<typeof CustomSelect>, "ariaLabel"> {
  label: string
  required?: boolean
  hint?: string
}

/** Selector de formulario con la misma etiqueta que `FormInput`. */
export function FormSelect({ label, hint, required, ...select }: FormSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span aria-hidden="true" className="text-[13px] font-medium text-ink">
        {label}
        {required && <span className="text-danger-ink ml-1">*</span>}
      </span>
      <CustomSelect {...select} ariaLabel={required ? `${label} (obligatorio)` : label} />
      {hint && <span className="text-xs text-ink-muted">{hint}</span>}
    </div>
  )
}
