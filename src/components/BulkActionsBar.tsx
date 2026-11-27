import { X, type LucideIcon } from "lucide-react"
import { useCan } from "@/hooks/useAccess"
import { Button } from "./Button"

export interface BulkActionItem {
  label: string
  onClick: () => void
  icon?: LucideIcon
  variant?: "primary" | "secondary" | "danger" | "success"
  /** Privilegios que la habilitan (basta uno); sin ellos no se muestra. */
  needs?: readonly string[]
}

export interface BulkActionsBarProps {
  /** Cantidad de elementos actualmente seleccionados */
  selectedCount: number
  /** Cantidad total de elementos en la página o lista */
  totalCount?: number
  /** Callback para limpiar la selección actual */
  onClearSelection: () => void
  /** Lista de acciones masivas a ejecutar */
  actions: BulkActionItem[]
}

/** Barra flotante con las acciones sobre las filas seleccionadas. */
export function BulkActionsBar({
  selectedCount,
  totalCount,
  onClearSelection,
  actions,
}: BulkActionsBarProps) {
  const can = useCan()
  const allowed = actions.filter(({ needs }) => !needs || can(needs))
  if (selectedCount === 0) return null

  return (
    <div
      role="toolbar"
      aria-label="Acciones en lote para elementos seleccionados"
      className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-surface shadow-modal rounded-xl p-2 pl-3 flex items-center gap-2 max-w-[95vw] overflow-x-auto mb-[env(safe-area-inset-bottom)]"
    >
      {/* Indicador de recuento */}
      <div className="pr-1 shrink-0">
        <span className="text-[13px] font-semibold text-ink whitespace-nowrap">
          {selectedCount} {selectedCount === 1 ? "seleccionado" : "seleccionados"}
          {totalCount ? ` de ${totalCount}` : ""}
        </span>
      </div>

      {/* Separador vertical */}
      <div className="h-5 w-px bg-line shrink-0" aria-hidden="true" />

      {/* Acciones configuradas */}
      <div className="flex items-center gap-1.5 shrink-0">
        {allowed.map((act) => {
          const variant = act.variant === "success" ? "secondary" : act.variant
          return (
            <Button
              key={act.label}
              variant={variant}
              icon={act.icon}
              onClick={act.onClick}
            >
              {act.label}
            </Button>
          )
        })}
      </div>

      {/* Separador vertical */}
      <div className="h-5 w-px bg-line shrink-0" aria-hidden="true" />

      {/* Botón de deseleccionar */}
      <button
        type="button"
        onClick={onClearSelection}
        aria-label="Deseleccionar todos los elementos"
        title="Deseleccionar todos"
        className="btn btn-plain shrink-0"
      >
        <X size={15} aria-hidden="true" />
        <span className="hidden sm:inline">Deseleccionar</span>
      </button>
    </div>
  )
}
