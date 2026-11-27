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
      className="icon-btn hover:!text-danger-ink hover:!bg-danger-soft"
    >
      <Trash2 size={15} aria-hidden="true" />
    </button>
  )
}
