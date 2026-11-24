import { getStatusClasses } from "@/utils/statusTones"

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const tone = getStatusClasses(status)
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium ${tone.bg} ${tone.text} ${className}`}
    >
      {status}
    </span>
  )
}
