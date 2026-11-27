import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { FormInput } from "@/components/FormInput"

interface PasswordFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  autoComplete: "current-password" | "new-password"
  placeholder?: string
  hint?: string
}

/** Contraseña con botón para mostrarla u ocultarla. */
export function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  hint,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const Icono = visible ? EyeOff : Eye
  return (
    <div className="space-y-1.5">
      <div className="relative">
        <FormInput
          label={label}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="!pr-10"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? `Ocultar: ${label}` : `Mostrar: ${label}`}
          className="icon-btn !size-7 absolute right-1.5 bottom-1.5 sm:bottom-1"
        >
          <Icono size={15} aria-hidden="true" />
        </button>
      </div>
      {hint && <p className="text-xs text-ink-muted">{hint}</p>}
    </div>
  )
}
