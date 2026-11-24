import { useId, type TextareaHTMLAttributes } from "react"

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

/** Área de texto con la misma etiqueta que `FormInput`. */
export function FormTextarea({ label, required, ...props }: FormTextareaProps) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-[#F1F5F9]">
        {label}
        {required && (
          <span className="text-[#EF4444] ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <textarea
        id={id}
        rows={3}
        required={required}
        className="px-3.5 py-2.5 bg-[#111318] border border-[var(--field-border)] rounded-lg text-[13px] text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] resize-none"
        {...props}
      />
    </div>
  )
}
