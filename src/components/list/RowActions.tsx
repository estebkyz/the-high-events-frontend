import { Edit2, Eye, Trash2, type LucideIcon } from "lucide-react"

type ActionTone = "accent" | "info" | "success" | "warning" | "danger"

export interface RowAction<T> {
  label: string
  icon: LucideIcon
  onClick: (item: T) => void
  tone?: ActionTone
  /** Oculta la acción en las filas donde no aplica. */
  isVisible?: (item: T) => boolean
}

const TONES: Record<ActionTone, string> = {
  accent: "hover:text-[#A78BFA] hover:bg-[#7C3AED]/20",
  info: "hover:text-[#60A5FA] hover:bg-[#3B82F6]/20",
  success: "hover:text-[#10B981] hover:bg-[#10B981]/20",
  warning: "hover:text-[#F59E0B] hover:bg-[#F59E0B]/20",
  danger: "hover:text-[#F87171] hover:bg-[#EF4444]/20",
}

interface RowActionsProps<T> {
  item: T
  itemName: string
  onView?: (item: T) => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  extra?: RowAction<T>[]
}

/** Orden fijo: acciones propias · ver · editar | eliminar. */
export function RowActions<T>({
  item,
  itemName,
  onView,
  onEdit,
  onDelete,
  extra = [],
}: RowActionsProps<T>) {
  const actions = extra.filter((action) => action.isVisible?.(item) ?? true)
  if (onView) {
    actions.push({ label: "Ver detalles", icon: Eye, onClick: onView, tone: "accent" })
  }
  if (onEdit) {
    actions.push({ label: "Editar", icon: Edit2, onClick: onEdit, tone: "info" })
  }

  const renderButton = ({
    label,
    icon: Icon,
    onClick,
    tone = "accent",
  }: RowAction<T>) => (
    <button
      key={label}
      type="button"
      onClick={() => onClick(item)}
      title={label}
      aria-label={`${label}: ${itemName}`}
      className={`p-2 text-[#94A3B8] rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/70 ${TONES[tone]}`}
    >
      <Icon size={16} aria-hidden="true" />
    </button>
  )

  return (
    <div className="inline-flex items-center justify-end gap-1">
      {actions.map(renderButton)}
      {onDelete && (
        <>
          <span aria-hidden="true" className="w-px h-5 bg-[#262D3D] mx-1" />
          {renderButton({
            label: "Eliminar",
            icon: Trash2,
            onClick: onDelete,
            tone: "danger",
          })}
        </>
      )}
    </div>
  )
}
