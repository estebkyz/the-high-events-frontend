import { Inbox, type LucideIcon } from "lucide-react"

export interface EmptyStateAction {
  label: string
  onClick: () => void
}

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: EmptyStateAction
  secondaryAction?: EmptyStateAction
  compact?: boolean
}

/**
 * Shopify Polaris Empty State Pattern:
 * Presenta un estado vacío accionable y orientativo en lugar de un texto plano.
 * Combina icono sobrio, copy explicativo y llamadas directas a la acción (+ Crear / Limpiar filtros).
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  secondaryAction,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${
        compact ? "py-8 px-4" : "py-14 px-6"
      }`}
    >
      {/* Icon Frame */}
      <div className="w-14 h-14 rounded-2xl bg-[#1F2430] border border-[#2B3345] flex items-center justify-center text-[#94A3B8] mb-3.5 shadow-inner">
        <Icon size={26} strokeWidth={1.75} aria-hidden="true" />
      </div>

      {/* Heading */}
      <h3 className="text-[15px] font-semibold text-[#F1F5F9] mb-1 leading-snug">
        {title}
      </h3>

      {/* Subtitle / Guidance */}
      {description && (
        <p className="text-[12.5px] text-[#94A3B8] max-w-sm leading-relaxed mb-4">
          {description}
        </p>
      )}

      {/* Action Buttons */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-2.5 flex-wrap justify-center pt-1">
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#222734] border border-[#262D3D] transition-colors cursor-pointer"
            >
              {secondaryAction.label}
            </button>
          )}
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-md shadow-[#7C3AED]/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{action.label}</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
