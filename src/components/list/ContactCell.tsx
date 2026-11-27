import { formatPhone } from "@/utils/format"

interface ContactCellProps {
  correo?: string
  telefono?: string
}

const LINK =
  "block hover:text-white hover:underline underline-offset-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"

/** Correo y teléfono apilados con enlace directo. */
export function ContactCell({ correo, telefono }: ContactCellProps) {
  if (!correo && !telefono) {
    return <span className="text-xs text-ink-muted">Sin contacto</span>
  }
  return (
    <div className="min-w-0">
      {correo && (
        <a
          href={`mailto:${correo}`}
          className={`${LINK} max-w-[240px] truncate text-ink-soft`}
        >
          {correo}
        </a>
      )}
      {telefono && (
        <a
          href={`tel:${telefono.replace(/[^\d+]/g, "")}`}
          className={`${LINK} text-xs text-ink-muted tabular-nums whitespace-nowrap`}
        >
          {formatPhone(telefono)}
        </a>
      )}
    </div>
  )
}
