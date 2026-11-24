import { Trash2 } from "lucide-react"

interface RemoveButtonProps {
  label: string
  onClick: () => void
}

/** Quita un renglón dentro de un formulario (servicios, equipos, ítems). */
export function RemoveButton({ label, onClick }: RemoveButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/15 transition-colors cursor-pointer shrink-0"
    >
      <Trash2 size={14} aria-hidden="true" />
    </button>
  )
}
