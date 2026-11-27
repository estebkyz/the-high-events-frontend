import type { LucideIcon } from "lucide-react"
import { useCan } from "@/hooks/useAccess"

export type DetailActionTone = "default" | "accent" | "success" | "info" | "danger"

const TONES: Record<DetailActionTone, string> = {
  default: "btn-secondary",
  accent:
    "bg-brand-soft text-brand-ink hover:ring-1 hover:ring-inset hover:ring-brand-line",
  success: "btn-secondary [&>svg]:text-ok",
  info: "btn-secondary [&>svg]:text-info",
  danger: "btn-secondary !text-danger-ink",
}

interface DetailActionProps {
  icon: LucideIcon
  label: string
  onClick: () => void
  tone?: DetailActionTone
  /** Privilegios que la habilitan (basta uno); sin ellos no se muestra. */
  needs?: readonly string[]
}

/** Botón de acción propia del módulo dentro del detalle. */
export function DetailAction({
  icon: Icon,
  label,
  onClick,
  tone = "default",
  needs,
}: DetailActionProps) {
  const can = useCan()
  if (needs && !can(needs)) return null
  return (
    <button type="button" onClick={onClick} className={`btn w-full ${TONES[tone]}`}>
      <Icon size={15} aria-hidden="true" className="shrink-0" />
      {label}
    </button>
  )
}
