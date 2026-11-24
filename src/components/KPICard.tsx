import type { LucideIcon } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  onClick?: () => void
}

const CARD =
  "w-full text-left bg-[#181B22] border border-[#262D3D] rounded-2xl p-4 flex flex-col justify-between gap-2.5 transition-colors shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"

export function KPICard({ title, value, subtitle, icon: Icon, onClick }: KPICardProps) {
  const content = (
    <>
      <span className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-[#94A3B8] truncate">{title}</span>
        <Icon size={14} className="text-[#94A3B8] shrink-0" aria-hidden="true" />
      </span>
      <span className="block text-[19px] font-semibold text-[#F8FAFC] tracking-tight leading-none whitespace-nowrap tabular-nums">
        {value}
      </span>
      {subtitle && (
        <span className="block text-[11px] text-[#94A3B8] truncate">{subtitle}</span>
      )}
    </>
  )

  if (!onClick) return <div className={CARD}>{content}</div>
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${CARD} cursor-pointer hover:border-[#3B455A] hover:bg-[#1E222B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]`}
    >
      {content}
    </button>
  )
}
