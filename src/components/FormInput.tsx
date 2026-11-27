import { useId, type InputHTMLAttributes, type ReactNode } from "react"

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode
  error?: string
  hint?: string
  hideRequiredAsterisk?: boolean
  /** La etiqueta queda solo para lectores de pantalla (campos en renglones). */
  hideLabel?: boolean
}

/** Tope por defecto; cada campo puede fijar el suyo. */
const MAX_TEXT = 120

export function FormInput({
  label,
  error,
  hint,
  id,
  className = "",
  hideRequiredAsterisk = false,
  hideLabel = false,
  ...props
}: FormInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const message = error ?? hint

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className={
          hideLabel ? "sr-only" : "text-[13px] font-medium text-ink flex items-center"
        }
      >
        <span>{label}</span>
        {props.required && !hideRequiredAsterisk && (
          <span
            className="text-danger-ink ml-1 leading-none"
            title="Campo obligatorio"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? `${inputId}-msg` : undefined}
        maxLength={MAX_TEXT}
        className={`field ${className}`.trim()}
        {...props}
      />
      {message && (
        <span
          id={`${inputId}-msg`}
          className={`text-xs ${error ? "text-danger-ink" : "text-ink-muted"}`}
        >
          {message}
        </span>
      )}
    </div>
  )
}
