import { getStatusClasses } from "@/utils/statusTones"

interface StatusBadgeProps {
  status: string
  className?: string
}

/** Insignia de estado: punto de color + texto (no depende solo del color). */
export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const tone = getStatusClasses(status)
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-medium whitespace-nowrap ${tone.bg} ${tone.text} ${className}`}
    >
      <span aria-hidden="true" className={`size-1.5 rounded-full ${tone.dot}`} />
      {status}
    </span>
  )
}
