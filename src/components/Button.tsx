import type { ButtonHTMLAttributes, ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

export type ButtonVariant = "primary" | "secondary" | "plain" | "danger"

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant
  icon?: LucideIcon
  children: ReactNode
}

/** Botón único del sistema. Una sola acción `primary` por pantalla o modal. */
export function Button({
  variant = "secondary",
  icon: Icon,
  type = "button",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button {...props} type={type} className={`btn btn-${variant} ${className}`.trim()}>
      {Icon && <Icon size={15} aria-hidden="true" className="shrink-0" />}
      {children}
    </button>
  )
}
