import React from "react"
import { CheckSquare, X, LucideIcon } from "lucide-react"

export interface BulkActionItem {
  label: string; onClick: () => void
  icon?: LucideIcon
  variant?: "primary" | "secondary" | "danger" | "success"
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
  /** Renderizado de acciones o botones personalizados opcionales */
  children?: React.ReactNode
}

/**
 * Shopify Polaris Bulk Actions Bar Pattern:
 * Barra flotante animada que aparece cuando el usuario selecciona 1 o más filas con checkboxes.
 * Proporciona un recuento visual claro y un menú de acciones rápidas (cambiar estado, exportar, eliminar)
 * sin romper el diseño de la tabla.
 */
export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  totalCount,
  onClearSelection,
  actions,
  children,
}) => {
  if (selectedCount === 0) return null

  return (
    <div
      role="toolbar"
      aria-label="Acciones en lote para elementos seleccionados"
      className="fixed bottom-18 md:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#181B22]/95 border border-[#262D3D] shadow-2xl backdrop-blur-md rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-3 animate-in slide-in-from-bottom-4 duration-200 max-w-[95vw] overflow-x-auto mb-[env(safe-area-inset-bottom)]"
    >
      {/* Indicador de recuento */}
      <div className="flex items-center gap-2 pl-1 pr-2 shrink-0">
        <div className="w-5 h-5 rounded-md bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-[#A78BFA] flex items-center justify-center">
          <CheckSquare size={13} aria-hidden="true" />
        </div>
        <span className="text-xs font-semibold text-[#F1F5F9] whitespace-nowrap">
          {selectedCount}{" "}
          {selectedCount === 1 ? "seleccionado" : "seleccionados"}
          {totalCount ? ` de ${totalCount}` : ""}
        </span>
      </div>

      {/* Separador vertical */}
      <div className="h-5 w-px bg-[#262D3D] shrink-0" aria-hidden="true" />

      {/* Acciones configuradas */}
      <div className="flex items-center gap-1.5 shrink-0">
        {actions.map((act, index) => {
          const Icon = act.icon
          const variantClasses =
            act.variant === "danger"
              ? "bg-[#EF4444]/15 text-[#EF4444] hover:bg-[#EF4444]/25"
              : act.variant === "success"
                ? "bg-[#10B981]/15 text-[#10B981] hover:bg-[#10B981]/25"
                : act.variant === "primary"
                  ? "bg-[#7C3AED] text-white hover:bg-[#6D28D9]"
                  : "bg-[#222734] text-[#CBD5E1] hover:bg-[#2A3142] hover:text-[#F1F5F9]"

          return (
            <button
              key={index}
              type="button"
              onClick={act.onClick}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${variantClasses}`}
            >
              {Icon && <Icon size={12} aria-hidden="true" />}
              <span>{act.label}</span>
            </button>
          )
        })}
        {children}
      </div>

      {/* Separador vertical */}
      <div className="h-5 w-px bg-[#262D3D] shrink-0" aria-hidden="true" />

      {/* Botón de deseleccionar */}
      <button
        type="button"
        onClick={onClearSelection}
        aria-label="Deseleccionar todos los elementos"
        title="Deseleccionar todos"
        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#222734] transition-colors cursor-pointer shrink-0"
      >
        <X size={13} aria-hidden="true" />
        <span className="hidden sm:inline">Deseleccionar</span>
      </button>
    </div>
  )
}
