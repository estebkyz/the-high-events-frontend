import React from "react"

export interface ResourceAttribute {
  label: string
  value: React.ReactNode
  icon?: React.ElementType
}

export interface MobileResourceCardProps {
  id: string | number
  isSelected?: boolean
  onToggleSelect?: (id: string) => void
  title: React.ReactNode
  subtitle?: React.ReactNode
  badge?: React.ReactNode
  attributes?: ResourceAttribute[]
  primaryValue?: React.ReactNode
  actions?: React.ReactNode
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
      className={`relative w-full bg-[#181B22] border rounded-2xl p-4 transition-all duration-150 ${
        isSelected
          ? "border-[#7C3AED] bg-[#7C3AED]/5 shadow-md shadow-[#7C3AED]/10"
          : "border-[#262D3D] hover:border-[#3B4254] active:scale-[0.99]"
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
                className="rounded border-[#262D3D] bg-[#111318] text-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED] focus:outline-none cursor-pointer w-4.5 h-4.5"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-semibold text-[#F1F5F9] leading-snug truncate">
              {title}
            </div>
            {subtitle && (
              <div className="text-[12px] text-[#94A3B8] leading-tight mt-0.5 truncate">
                {subtitle}
              </div>
            )}
          </div>
        </div>

        {badge && <div className="shrink-0">{badge}</div>}
      </div>

      {/* Attributes List */}
      {attributes.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#262D3D]/60 text-[12px]">
          {attributes.map((attr, idx) => {
            const Icon = attr.icon
            return (
              <div key={idx} className="flex items-center gap-1.5 min-w-0">
                {Icon && (
                  <Icon
                    size={13}
                    className="text-[#64748B] shrink-0"
                    aria-hidden="true"
                  />
                )}
                <div className="min-w-0 truncate text-[#94A3B8]">
                  <span className="text-[#64748B] mr-1">{attr.label}:</span>
                  <span className="text-[#CBD5E1] font-medium">
                    {attr.value}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Bottom Footer Row: Primary value (e.g. price/status) + Action buttons */}
      {(primaryValue || actions) && (
        <div
          className="flex items-center justify-between gap-3 mt-3 pt-2.5 border-t border-[#262D3D]/40"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="min-w-0 font-semibold text-[14px] text-[#F1F5F9]">
            {primaryValue}
          </div>
          {actions && (
            <div className="flex items-center gap-1 shrink-0">{actions}</div>
          )}
        </div>
      )}
    </div>
  )
}
