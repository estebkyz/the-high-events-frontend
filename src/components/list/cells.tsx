import type { ReactNode } from "react"

interface TitleCellProps {
  title: ReactNode
  subtitle?: ReactNode
}

/** Identidad principal: título + subtítulo. */
export function TitleCell({ title, subtitle }: TitleCellProps) {
  return (
    <div className="min-w-0">
      <p className="font-semibold text-[#F1F5F9] leading-snug">{title}</p>
      {subtitle && <p className="text-[11px] text-[#94A3B8] mt-0.5">{subtitle}</p>}
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
          className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#7C3AED]/15 text-[#A78BFA]"
        >
          {tag}
        </span>
      ))}
      {hidden.length > 0 && (
        <span
          title={hidden.join(", ")}
          className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#222734] text-[#94A3B8]"
        >
          +{hidden.length}
        </span>
      )}
    </div>
  )
}

/** Clases de celda reutilizables (`Column.className`). */
export const CELL = {
  muted: "text-[#94A3B8] tabular-nums",
  money: "font-semibold text-[#10B981] tabular-nums whitespace-nowrap",
  code: "font-mono font-semibold text-[#A78BFA] whitespace-nowrap",
} as const
