import React from "react"

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode
  error?: string
  hint?: string
  hideRequiredAsterisk?: boolean
}

export function FormInput({
  label,
  error,
  hint,
  className = "",
  hideRequiredAsterisk = false,
  ...props
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-[#F1F5F9] flex items-center">
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
        className={`h-[40px] px-3.5 bg-[#111318] border border-[var(--field-border)] rounded-lg text-[13px] text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all ${className}`}
        {...props}
      />
      {error && <span className="text-[11px] text-[#EF4444]">{error}</span>}
      {hint && !error && <span className="text-[11px] text-[#64748B]">{hint}</span>}
    </div>
  )
}
