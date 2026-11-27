import { useId, type TextareaHTMLAttributes } from "react"

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

/** Lo que admite la columna más corta de observaciones. */
const MAX_TEXT = 255

/** Área de texto con la misma etiqueta que `FormInput`. */
export function FormTextarea({ label, required, ...props }: FormTextareaProps) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-ink">
        {label}
        {required && (
          <span className="text-danger-ink ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <textarea
        id={id}
        rows={3}
        required={required}
        maxLength={MAX_TEXT}
        className="field resize-y"
        {...props}
      />
    </div>
  )
}
