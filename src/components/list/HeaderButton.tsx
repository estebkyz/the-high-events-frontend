import type { LucideIcon } from "lucide-react"

interface HeaderButtonProps {
  icon: LucideIcon
  label: string
  onClick: () => void
}

/** Botón secundario del encabezado (`PageHeader.extraControls`). */
export function HeaderButton({ icon: Icon, label, onClick }: HeaderButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-[36px] px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] bg-[#181B22] border-[#262D3D] text-[#CBD5E1] hover:border-[#3B455A] hover:text-[#F1F5F9]"
    >
      <Icon size={13} aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}
