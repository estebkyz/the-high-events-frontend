import type { LucideIcon } from "lucide-react"

type DetailActionTone = "default" | "accent" | "success" | "info"

const TONES: Record<DetailActionTone, string> = {
  default: "text-[#CBD5E1] border-[#2D3748] hover:bg-[#222734]",
  accent: "text-[#A78BFA] border-[#7C3AED]/40 bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20",
  success: "text-[#10B981] border-[#10B981]/40 bg-[#10B981]/10 hover:bg-[#10B981]/20",
  info: "text-[#60A5FA] border-[#3B82F6]/40 bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20",
}

interface DetailActionProps {
  icon: LucideIcon
  label: string
  onClick: () => void
  tone?: DetailActionTone
}

/** Botón de acción propia del módulo dentro del detalle. */
export function DetailAction({
  icon: Icon,
  label,
  onClick,
  tone = "default",
}: DetailActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${TONES[tone]}`}
    >
      <Icon size={13} aria-hidden="true" />
      {label}
    </button>
  )
}
