import { Inbox, type LucideIcon } from "lucide-react"
import { Button } from "./Button"

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

/** Estado vacío accionable: qué falta y cómo resolverlo. */
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
      <div className="size-14 rounded-full bg-brand-soft flex items-center justify-center text-brand-ink mb-3.5">
        <Icon size={24} strokeWidth={1.75} aria-hidden="true" />
      </div>

      {/* Heading */}
      <h3 className="text-[15px] font-semibold text-ink mb-1 leading-snug">{title}</h3>

      {/* Subtitle / Guidance */}
      {description && (
        <p className="text-[13px] text-ink-muted max-w-sm leading-relaxed mb-4">
          {description}
        </p>
      )}

      {/* Action Buttons */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-2 flex-wrap justify-center pt-1">
          {secondaryAction && (
            <Button onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>
          )}
          {action && (
            <Button variant="primary" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
