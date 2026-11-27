import type { ReactNode } from "react"

interface FormSectionProps {
  title: string
  hint?: string
  action?: ReactNode
  children: ReactNode
}

/** Bloque de formulario separado por una línea divisoria (sin recuadros). */
export function FormSection({ title, hint, action, children }: FormSectionProps) {
  return (
    <section className="pt-4 border-t border-line-soft space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-[13px] font-semibold text-ink">{title}</h3>
          {hint && <p className="text-xs text-ink-muted mt-0.5">{hint}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
