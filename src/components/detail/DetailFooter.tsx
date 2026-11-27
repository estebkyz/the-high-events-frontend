import type { ReactNode } from "react"
import { Edit2 } from "lucide-react"
import { Button } from "@/components/Button"
import { useModuleAccess } from "@/hooks/useAccess"

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
  const { canEdit } = useModuleAccess()
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {children}
      <Button onClick={onClose}>Cerrar</Button>
      {canEdit && onEdit && (
        <Button variant="primary" icon={Edit2} onClick={onEdit}>
          {editLabel}
        </Button>
      )}
    </div>
  )
}
