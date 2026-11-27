import { ExternalLink } from "lucide-react"
import { getMapsUrl } from "@/services/ubicaciones"

interface MapsLinkProps {
  ubicacion: string
  /** `action`: "Ver en Google Maps". `text`: la propia ubicación es el enlace. */
  variant?: "action" | "text"
  className?: string
}

const VARIANTS = {
  action: "gap-1 text-xs font-medium text-brand-ink whitespace-nowrap",
  text: "min-w-0 break-words",
}

/** Abre la ubicación en Google Maps, en otra pestaña. */
export function MapsLink({
  ubicacion,
  variant = "action",
  className = "",
}: MapsLinkProps) {
  const isAction = variant === "action"
  return (
    <a
      href={getMapsUrl(ubicacion)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center hover:underline underline-offset-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${VARIANTS[variant]} ${className}`}
    >
      {isAction ? "Ver en Google Maps" : <span className="min-w-0">{ubicacion}</span>}
      {isAction && <ExternalLink size={12} aria-hidden="true" />}
      <span className="sr-only">
        {isAction ? `: ${ubicacion}` : ", ver en Google Maps"} (se abre en otra pestaña)
      </span>
    </a>
  )
}
