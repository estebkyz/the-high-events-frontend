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
    <header className={`space-y-2 pb-3.5 border-b border-line ${className}`.trim()}>
      {badges && <div className="flex items-center gap-2 flex-wrap">{badges}</div>}
      <div className="min-w-0">
        <h3 className="text-[16px] font-semibold text-ink leading-snug break-words">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-ink-muted mt-0.5 break-words">{subtitle}</p>
        )}
      </div>
      {meta && (
        <div className="flex items-center gap-x-3 gap-y-1 flex-wrap text-xs text-ink-muted">
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
      className={`${noBorder ? "" : "border-t border-line-soft pt-4"} space-y-2.5 ${className}`.trim()}
    >
      <div className="flex items-center justify-between gap-2">
        <h4 className="flex items-center gap-2 text-[13px] font-semibold text-ink">
          {Icon && (
            <Icon size={14} className="text-ink-muted shrink-0" aria-hidden="true" />
          )}
          <span>{title}</span>
        </h4>
        {(count !== undefined || action) && (
          <div className="flex items-center gap-2 shrink-0">
            {count !== undefined && (
              <span className="text-xs text-ink-muted tabular-nums">{count}</span>
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
      <dt className="text-xs text-ink-muted flex items-center gap-1.5">
        {Icon && <Icon size={12} className="shrink-0" aria-hidden="true" />}
        <span>{label}</span>
      </dt>
      <dd
        className={`text-[13px] font-medium text-ink mt-0.5 break-words ${valueClassName}`.trim()}
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
    container: "bg-surface-2",
    icon: "text-ink-muted",
    value: "text-ink",
  },
  accent: {
    container: "bg-brand-soft",
    icon: "text-brand-ink",
    value: "text-ink",
  },
  success: {
    container: "bg-ok-soft",
    icon: "text-ok-ink",
    value: "text-ok-ink",
  },
  warning: {
    container: "bg-warn-soft",
    icon: "text-warn-ink",
    value: "text-warn-ink",
  },
  danger: {
    container: "bg-danger-soft",
    icon: "text-danger-ink",
    value: "text-danger-ink",
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
      className={`rounded-xl px-3.5 py-3 flex items-center justify-between gap-3 ${styles.container} ${className}`.trim()}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-ink-muted">
          {Icon && (
            <Icon size={13} className={`${styles.icon} shrink-0`} aria-hidden="true" />
          )}
          <span className="truncate">{label}</span>
        </div>
        <div
          className={`text-[18px] leading-6 font-semibold tabular-nums mt-0.5 ${styles.value}`}
        >
          {value}
        </div>
        {sublabel && <p className="text-xs text-ink-muted mt-0.5">{sublabel}</p>}
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
  return <div className={`divide-y divide-line-soft ${className}`.trim()}>{children}</div>
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
    <p className={`text-[13px] text-ink-muted py-2 ${className}`.trim()}>
      {children ?? text}
    </p>
  )
}
