import type { ReactNode } from "react"

interface TitleCellProps {
  title: ReactNode
  subtitle?: ReactNode
}

/** Identidad principal: título + subtítulo. */
export function TitleCell({ title, subtitle }: TitleCellProps) {
  return (
    <div className="min-w-0">
      <p className="font-semibold text-ink leading-snug">{title}</p>
      {subtitle && <p className="text-xs text-ink-muted mt-0.5">{subtitle}</p>}
    </div>
  )
}

interface TagsCellProps {
  tags: string[]
  max?: number
}

/** Etiquetas compactas: muestra las primeras y resume el resto en "+N". */
export function TagsCell({ tags, max = 2 }: TagsCellProps) {
  const hidden = tags.slice(max)
  return (
    <div className="flex flex-wrap gap-1 max-w-[240px]">
      {tags.slice(0, max).map((tag) => (
        <span
          key={tag}
          className="px-2 py-0.5 rounded-lg text-xs font-medium bg-neutral-soft text-ink-soft"
        >
          {tag}
        </span>
      ))}
      {hidden.length > 0 && (
        <span
          title={hidden.join(", ")}
          className="px-1.5 py-0.5 rounded-lg text-xs font-medium bg-neutral-soft text-ink-soft"
        >
          +{hidden.length}
        </span>
      )}
    </div>
  )
}

/** Clases de celda reutilizables (`Column.className`). */
export const CELL = {
  muted: "text-ink-muted tabular-nums",
  money: "font-medium text-ink tabular-nums whitespace-nowrap",
  code: "font-semibold text-ink tabular-nums whitespace-nowrap",
} as const
