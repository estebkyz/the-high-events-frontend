import { ArrowDownRight, ArrowUpRight, Equal, type LucideIcon } from "lucide-react"
import { Skeleton } from "@/components/Skeleton"

/** Cambio porcentual frente a un período de referencia. */
export interface KPITrend {
  percent: number
  /** Con qué se compara: `octubre a la fecha`. */
  label: string
}

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  onClick?: () => void
  loading?: boolean
  /** Reemplaza al subtítulo cuando hay con qué comparar. */
  trend?: KPITrend
}

/** Celda de `KPIStrip`. */
const CARD = "@container w-full text-left bg-surface px-4 py-3.5 flex flex-col gap-1.5"

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  onClick,
  loading = false,
  trend,
}: KPICardProps) {
  const content = (
    <>
      <span className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-ink-soft underline decoration-dotted decoration-line-strong underline-offset-4">
          {title}
        </span>
        <Icon size={14} className="text-ink-muted shrink-0" aria-hidden="true" />
      </span>
      {loading ? (
        <Skeleton className="h-6 w-24 max-w-full" />
      ) : (
        <span className="block text-[15px] @[7.5rem]:text-[17px] @[8.5rem]:text-[19px] font-semibold text-ink tracking-tight leading-6 tabular-nums">
          {value}
        </span>
      )}
      {trend && !loading ? (
        <TrendLine trend={trend} />
      ) : (
        subtitle && <span className="block text-xs text-ink-muted">{subtitle}</span>
      )}
    </>
  )

  if (!onClick) return <div className={CARD}>{content}</div>
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${CARD} group cursor-pointer transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand`}
    >
      {content}
    </button>
  )
}

function getTrendStyle(percent: number) {
  if (percent > 0) return { icon: ArrowUpRight, color: "text-ok-ink", verb: "Subió" }
  if (percent < 0) return { icon: ArrowDownRight, color: "text-danger-ink", verb: "Bajó" }
  return { icon: Equal, color: "text-ink-muted", verb: "Igual:" }
}

function TrendLine({ trend: { percent, label } }: { trend: KPITrend }) {
  const { icon: Icon, color, verb } = getTrendStyle(percent)
  return (
    <span className="flex flex-wrap items-center gap-x-1.5 text-xs text-ink-muted">
      <span className={`inline-flex items-center gap-0.5 font-semibold ${color}`}>
        <Icon size={12} aria-hidden="true" />
        <span className="sr-only">{verb} </span>
        {Math.abs(percent)} %
      </span>
      vs. {label}
    </span>
  )
}
