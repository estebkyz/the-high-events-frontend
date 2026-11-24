import type { ReactNode } from "react"
import { Edit2 } from "lucide-react"

interface DetailFooterProps {
  onClose: () => void
  onEdit?: () => void
  /** "Editar cliente" */
  editLabel?: string
  /** Acciones adicionales del módulo, a la izquierda. */
  children?: ReactNode
}

/** Pie único del detalle: Cerrar a la izquierda, Editar a la derecha. */
export function DetailFooter({
  onClose,
  onEdit,
  editLabel = "Editar",
  children,
}: DetailFooterProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2.5">
      {children}
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] border border-[#2D3748] transition-colors cursor-pointer"
      >
        Cerrar
      </button>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all cursor-pointer"
        >
          <Edit2 size={13} aria-hidden="true" />
          {editLabel}
        </button>
      )}
    </div>
  )
}
