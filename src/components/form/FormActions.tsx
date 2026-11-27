import type { ReactNode } from "react"
import { Button } from "@/components/Button"

interface FormActionsProps {
  onCancel: () => void
  submitLabel: string
  saving?: boolean
  /** Id del `<form>` cuando el pie va fijo en el `footer` del `Drawer`. */
  formId?: string
  /** Dato que conviene ver siempre (p. ej. el total), a la izquierda. */
  summary?: ReactNode
}

/** Pie único de formulario: Cancelar a la izquierda, acción principal a la derecha. */
export function FormActions({
  onCancel,
  submitLabel,
  saving = false,
  formId,
  summary,
}: FormActionsProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-end gap-3 ${
        formId ? "" : "pt-4 border-t border-line"
      }`}
    >
      {summary && <div className="mr-auto min-w-0">{summary}</div>}
      <div className="flex items-center gap-2">
        <Button onClick={onCancel}>Cancelar</Button>
        <Button variant="primary" type="submit" form={formId} disabled={saving}>
          {saving ? "Guardando…" : submitLabel}
        </Button>
      </div>
    </div>
  )
}
