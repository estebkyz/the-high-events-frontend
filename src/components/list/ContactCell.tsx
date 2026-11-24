import { formatPhone } from "@/utils/format"

interface ContactCellProps {
  correo?: string
  telefono?: string
}

const LINK =
  "block hover:text-white hover:underline underline-offset-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/70"

/** Correo y teléfono apilados con enlace directo. */
export function ContactCell({ correo, telefono }: ContactCellProps) {
  if (!correo && !telefono) {
    return <span className="text-[11px] text-[#94A3B8]">Sin contacto</span>
  }
  return (
    <div className="min-w-0">
      {correo && (
        <a
          href={`mailto:${correo}`}
          className={`${LINK} max-w-[240px] truncate text-[#CBD5E1]`}
        >
          {correo}
        </a>
      )}
      {telefono && (
        <a
          href={`tel:${telefono.replace(/[^\d+]/g, "")}`}
          className={`${LINK} text-[12px] text-[#94A3B8] tabular-nums whitespace-nowrap`}
        >
          {formatPhone(telefono)}
        </a>
      )}
    </div>
  )
}
