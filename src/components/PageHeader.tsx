import type { ReactNode } from "react"
import { useModuleAccess } from "@/hooks/useAccess"
import { Button } from "./Button"

export interface PageHeaderProps {
  title: string
  actionLabel?: string
  onAction?: () => void
  /** Controles secundarios, a la izquierda de la acción principal. */
  extraControls?: ReactNode
}

/** Título de la pantalla y sus acciones. La búsqueda y los filtros van en `IndexFilters`. */
export function PageHeader({
  title,
  actionLabel,
  onAction,
  extraControls,
}: PageHeaderProps) {
  const { canCreate } = useModuleAccess()
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
      <h1 className="text-[20px] leading-7 font-semibold text-ink">{title}</h1>
      <div className="flex flex-wrap items-center gap-2">
        {extraControls}
        {canCreate && actionLabel && onAction && (
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
