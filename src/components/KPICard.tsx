import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string // e.g. "text-purple-400" or hex
  iconBg?: string // e.g. "bg-purple-500/10"
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
      className={`bg-[#181B22] border border-[#2D3748] rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col justify-between transition-all hover:border-[#4A5568] ${
        onClick ? "cursor-pointer hover:bg-[#2A303C]" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
        <span className="text-sm font-medium text-[#64748B]">{title}</span>
        <div className="p-1.5 sm:p-2 rounded-lg shrink-0">
          <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
        </div>
      </div>

      <div>
        <div className="flex items-baseline gap-1.5 sm:gap-2">
          <p className="text-[20px] sm:text-[28px] font-bold text-[#F1F5F9] tracking-tight leading-none">{value}</p>
          {change && (
            <span
              className={`inline-flex items-center text-[11px] font-medium px-1.5 py-0.5 rounded ${
                changeType === "positive"
                  ? "text-[#10B981] bg-[#10B981]/10"
                  : changeType === "negative"
                  ? "text-[#EF4444] bg-[#EF4444]/10"
                  : "text-[#94A3B8] bg-[#2D3748]"
              }`}
            >
              {changeType === "positive" ? <TrendingUp size={10} className="mr-0.5" /> : changeType === "negative" ? <TrendingDown size={10} className="mr-0.5" /> : null}
              {change}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-1">
          {subtitle && <p className="text-[12px] text-[#94A3B8]">{subtitle}</p>}
          {actionLabel && (
            <span className="text-[11px] text-[#A78BFA] font-medium hover:underline ml-auto">
              {actionLabel} →
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
