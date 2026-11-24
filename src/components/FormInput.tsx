import { useId, type InputHTMLAttributes, type ReactNode } from "react"

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode
  error?: string
  hint?: string
  hideRequiredAsterisk?: boolean
}

export function FormInput({
  label,
  error,
  hint,
  id,
  className = "",
  hideRequiredAsterisk = false,
  ...props
}: FormInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const message = error ?? hint

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-[13px] font-medium text-[#F1F5F9] flex items-center"
      >
        <span>{label}</span>
        {props.required && !hideRequiredAsterisk && (
          <span
            className="text-[#EF4444] ml-1 text-sm leading-none"
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
        className={`h-[40px] px-3.5 bg-[#111318] border border-[var(--field-border)] rounded-lg text-[13px] text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all ${className}`}
        {...props}
      />
      {message && (
        <span
          id={`${inputId}-msg`}
          className={`text-[11px] ${error ? "text-[#EF4444]" : "text-[#64748B]"}`}
        >
          {message}
        </span>
      )}
    </div>
  )
}
