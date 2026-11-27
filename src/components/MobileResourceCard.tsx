import type { ElementType, ReactNode } from "react"

export interface ResourceAttribute {
  label: string
  value: ReactNode
  icon?: ElementType
}

export interface MobileResourceCardProps {
  id: string | number
  isSelected?: boolean
  onToggleSelect?: (id: string) => void
  title: ReactNode
  subtitle?: ReactNode
  badge?: ReactNode
  attributes?: ResourceAttribute[]
  primaryValue?: ReactNode
  actions?: ReactNode
  onClick?: () => void
}

export function MobileResourceCard({
  id,
  isSelected = false,
  onToggleSelect,
  title,
  subtitle,
  badge,
  attributes = [],
  primaryValue,
  actions,
  onClick,
}: MobileResourceCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative w-full p-4 transition-colors ${
        isSelected ? "bg-brand-soft" : "active:bg-surface-2"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      {/* Top Header Row: Checkbox + Title + Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          {onToggleSelect && (
            <div
              className="pt-0.5 shrink-0"
              onClick={(e) => {
                e.stopPropagation()
                onToggleSelect(String(id))
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}}
                aria-label={`Seleccionar elemento ${id}`}
                className="size-4.5 cursor-pointer"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-semibold text-ink leading-snug truncate">
              {title}
            </div>
            {subtitle && (
              <div className="text-xs text-ink-muted leading-tight mt-0.5 truncate">
                {subtitle}
              </div>
            )}
          </div>
        </div>

        {badge && <div className="shrink-0">{badge}</div>}
      </div>

      {/* Attributes List */}
      {attributes.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-line-soft text-xs">
          {attributes.map((attr) => {
            const Icon = attr.icon
            return (
              <div key={attr.label} className="flex items-center gap-1.5 min-w-0">
                {Icon && (
                  <Icon
                    size={13}
                    className="text-ink-muted shrink-0"
                    aria-hidden="true"
                  />
                )}
                <div className="min-w-0 truncate text-ink-muted">
                  <span className="text-ink-muted mr-1">{attr.label}:</span>
                  <span className="text-ink-soft font-medium">{attr.value}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Bottom Footer Row: Primary value (e.g. price/status) + Action buttons */}
      {(primaryValue || actions) && (
        <div
          className="flex items-center justify-between gap-3 mt-3 pt-2.5 border-t border-line-soft"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="min-w-0 font-semibold text-[14px] text-ink">{primaryValue}</div>
          {actions && <div className="flex items-center gap-1 shrink-0">{actions}</div>}
        </div>
      )}
    </div>
  )
}
