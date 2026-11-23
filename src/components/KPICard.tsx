import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  size?: "sm" | "md" | "lg" | string
  onClick?: () => void
  actionLabel?: string
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  change,
  changeType = "positive",
  onClick,
  actionLabel,
}: KPICardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#181B22] border border-[#262D3D] rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-[#3B455A] ${
        onClick ? "cursor-pointer hover:bg-[#1E222B]" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className="text-xs font-medium text-[#94A3B8] truncate">
          {title}
        </span>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[#94A3B8] shrink-0">
          <Icon size={14} />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-baseline gap-1.5">
          <p className="text-[17px] sm:text-[19px] font-semibold text-[#F8FAFC] tracking-tight leading-none whitespace-nowrap tabular-nums">
            {value}
          </p>
          {change && (
            <span
              className={`inline-flex items-center text-[10.5px] font-medium px-1.5 py-0.5 rounded whitespace-nowrap ${
                changeType === "positive"
                  ? "text-[#10B981] bg-[#10B981]/10"
                  : changeType === "negative"
                    ? "text-[#EF4444] bg-[#EF4444]/10"
                    : "text-[#94A3B8] bg-[#2D3748]"
              }`}
            >
              {changeType === "positive" ? (
                <TrendingUp size={10} className="mr-0.5" />
              ) : changeType === "negative" ? (
                <TrendingDown size={10} className="mr-0.5" />
              ) : null}
              {change}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-0.5">
          {subtitle && (
            <p className="text-[11px] text-[#94A3B8] truncate">{subtitle}</p>
          )}
          {actionLabel && (
            <span className="text-[11px] text-[#A78BFA] font-medium hover:underline whitespace-nowrap shrink-0 ml-auto">
              {actionLabel} →
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
