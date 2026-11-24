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
      <span aria-hidden="true" className="text-[13px] font-medium text-[#F1F5F9]">
        {label}
        {required && <span className="text-[#EF4444] ml-1">*</span>}
      </span>
      <CustomSelect {...select} ariaLabel={required ? `${label} (obligatorio)` : label} />
      {hint && <span className="text-[11px] text-[#64748B]">{hint}</span>}
    </div>
  )
}
