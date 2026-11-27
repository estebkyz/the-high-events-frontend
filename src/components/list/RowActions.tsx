import { Edit2, Eye, Trash2, type LucideIcon } from "lucide-react"
import { useCan, useModuleAccess } from "@/hooks/useAccess"

type ActionTone = "accent" | "info" | "success" | "warning" | "danger"

export interface RowAction<T> {
  label: string
  icon: LucideIcon
  onClick: (item: T) => void
  tone?: ActionTone
  /** Oculta la acción en las filas donde no aplica. */
  isVisible?: (item: T) => boolean
  /** Privilegios que la habilitan (basta uno); sin ellos no se muestra. */
  needs?: readonly string[]
}

const TONES: Record<ActionTone, string> = {
  accent: "hover:!text-brand-ink hover:!bg-brand-soft",
  info: "hover:!text-info-ink hover:!bg-info-soft",
  success: "hover:!text-ok-ink hover:!bg-ok-soft",
  warning: "hover:!text-warn-ink hover:!bg-warn-soft",
  danger: "hover:!text-danger-ink hover:!bg-danger-soft",
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
  const can = useCan()
  const { canEdit, canRemove } = useModuleAccess()
  const actions = extra.filter(
    ({ isVisible, needs }) => (isVisible?.(item) ?? true) && (!needs || can(needs)),
  )
  if (onView) {
    actions.push({ label: "Ver detalles", icon: Eye, onClick: onView, tone: "accent" })
  }
  if (canEdit && onEdit) {
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
      className={`icon-btn ${TONES[tone]}`}
    >
      <Icon size={16} aria-hidden="true" />
    </button>
  )

  return (
    <div className="inline-flex items-center justify-end gap-0.5">
      {actions.map(renderButton)}
      {canRemove && onDelete && (
        <>
          <span aria-hidden="true" className="w-px h-5 bg-line mx-1" />
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
