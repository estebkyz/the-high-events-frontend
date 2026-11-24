import type React from "react"

export interface DetailHeaderProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  badges?: React.ReactNode
  meta?: React.ReactNode
  className?: string
}

/** Encabezado limpio para paneles de detalle sin recuadros internos. */
export function DetailHeader({
  title,
  subtitle,
  badges,
  meta,
  className = "",
}: DetailHeaderProps) {
  return (
    <header className={`space-y-2 pb-3.5 border-b border-[#2D3748] ${className}`.trim()}>
      {badges && <div className="flex items-center gap-2 flex-wrap">{badges}</div>}
      <div className="min-w-0">
        <h3 className="text-[15px] font-bold text-[#F1F5F9] leading-snug break-words">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-[#94A3B8] mt-0.5 break-words">{subtitle}</p>
        )}
      </div>
      {meta && (
        <div className="flex items-center gap-x-3 gap-y-1 flex-wrap text-[11px] text-[#94A3B8]">
          {meta}
        </div>
      )}
    </header>
  )
}

export interface DetailSectionProps {
  title: string
  icon?: React.ElementType
  count?: number | string
  action?: React.ReactNode
  noBorder?: boolean
  children: React.ReactNode
  className?: string
}

/** Sección semántica separada por divisor sutil superior. */
export function DetailSection({
  title,
  icon: Icon,
  count,
  action,
  noBorder = false,
  children,
  className = "",
}: DetailSectionProps) {
  return (
    <section
      className={`${noBorder ? "" : "border-t border-[#2D3748]/60 pt-4"} space-y-2.5 ${className}`.trim()}
    >
      <div className="flex items-center justify-between gap-2">
        <h4 className="flex items-center gap-2 text-xs font-semibold text-[#F1F5F9]">
          {Icon && (
            <Icon size={14} className="text-[#A78BFA] shrink-0" aria-hidden="true" />
          )}
          <span>{title}</span>
        </h4>
        {(count !== undefined || action) && (
          <div className="flex items-center gap-2 shrink-0">
            {count !== undefined && (
              <span className="text-[11px] text-[#94A3B8] tabular-nums">{count}</span>
            )}
            {action}
          </div>
        )}
      </div>
      {children}
    </section>
  )
}

export interface DetailGridProps {
  children: React.ReactNode
  className?: string
}

/** Lista de definición semántica en grilla de 1 a 2 columnas. */
export function DetailGrid({ children, className = "" }: DetailGridProps) {
  return (
    <dl className={`grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 ${className}`.trim()}>
      {children}
    </dl>
  )
}

export interface DetailFieldProps {
  label: string
  value?: React.ReactNode
  children?: React.ReactNode
  span?: 1 | 2
  icon?: React.ElementType
  valueClassName?: string
  className?: string
}

/** Par etiqueta/valor semántico (<dt>/<dd>) sin bordes ni fondos por campo. */
export function DetailField({
  label,
  value,
  children,
  span = 1,
  icon: Icon,
  valueClassName = "",
  className = "",
}: DetailFieldProps) {
  const content = value !== undefined ? value : children

  return (
    <div className={`min-w-0 ${span === 2 ? "sm:col-span-2" : ""} ${className}`.trim()}>
      <dt className="text-[11px] text-[#94A3B8] flex items-center gap-1.5">
        {Icon && <Icon size={12} className="shrink-0" aria-hidden="true" />}
        <span>{label}</span>
      </dt>
      <dd
        className={`text-[13px] font-medium text-[#F1F5F9] mt-0.5 break-words ${valueClassName}`.trim()}
      >
        {content}
      </dd>
    </div>
  )
}

export type DetailHighlightTone = "default" | "accent" | "success" | "warning" | "danger"

export interface DetailHighlightProps {
  label: string
  value: React.ReactNode
  sublabel?: React.ReactNode
  badge?: React.ReactNode
  icon?: React.ElementType
  tone?: DetailHighlightTone
  className?: string
}

const HIGHLIGHT_TONES: Record<
  DetailHighlightTone,
  { container: string; icon: string; value: string }
> = {
  default: {
    container: "border-[#2D3748] bg-[#14171D]",
    icon: "text-[#94A3B8]",
    value: "text-[#F1F5F9]",
  },
  accent: {
    container: "border-[#7C3AED]/30 bg-[#7C3AED]/10",
    icon: "text-[#A78BFA]",
    value: "text-[#F1F5F9]",
  },
  success: {
    container: "border-emerald-500/30 bg-emerald-500/10",
    icon: "text-emerald-400",
    value: "text-emerald-300",
  },
  warning: {
    container: "border-amber-500/30 bg-amber-500/10",
    icon: "text-amber-400",
    value: "text-amber-300",
  },
  danger: {
    container: "border-rose-500/30 bg-rose-500/10",
    icon: "text-rose-400",
    value: "text-rose-300",
  },
}

/** Destaque sutil único para métricas financieras o totales principales. */
export function DetailHighlight({
  label,
  value,
  sublabel,
  badge,
  icon: Icon,
  tone = "default",
  className = "",
}: DetailHighlightProps) {
  const styles = HIGHLIGHT_TONES[tone]

  return (
    <div
      className={`rounded-lg border px-3.5 py-2.5 flex items-center justify-between gap-3 ${styles.container} ${className}`.trim()}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8]">
          {Icon && (
            <Icon size={13} className={`${styles.icon} shrink-0`} aria-hidden="true" />
          )}
          <span className="truncate">{label}</span>
        </div>
        <div className={`text-base font-bold tabular-nums mt-0.5 ${styles.value}`}>
          {value}
        </div>
        {sublabel && <p className="text-[11px] text-[#94A3B8] mt-0.5">{sublabel}</p>}
      </div>
      {badge && <div className="shrink-0">{badge}</div>}
    </div>
  )
}

export interface DetailListProps {
  children: React.ReactNode
  className?: string
}

/** Contenedor limpio para filas de ítems, servicios o historial con divisores sutiles. */
export function DetailList({ children, className = "" }: DetailListProps) {
  return (
    <div className={`divide-y divide-[#2D3748]/60 ${className}`.trim()}>{children}</div>
  )
}

export interface DetailEmptyNoteProps {
  children?: React.ReactNode
  text?: string
  className?: string
}

/** Nota de estado vacío sutil sin bordes pesados. */
export function DetailEmptyNote({
  children,
  text,
  className = "",
}: DetailEmptyNoteProps) {
  return (
    <p className={`text-xs text-[#94A3B8] italic py-2 ${className}`.trim()}>
      {children ?? text}
    </p>
  )
}
