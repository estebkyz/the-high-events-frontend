import { Download, Mail, Sparkles } from "lucide-react"
import { DetailAction, DetailSection, type DetailActionTone } from "@/components/detail"
import { getStatusTone, type StatusTone } from "@/utils/statusTones"
import { ESTADO_ICONS, TRANSICIONES } from "../constants"
import type { CotizacionItem, EstadoCotizacion } from "../types"
import { cotizacionMailto, printCotizacion } from "../utils"
import { MODULE_ACCESS } from "@/constants/access"

interface CotizacionAccionesProps {
  item: CotizacionItem
  correoCliente: string | undefined
  onStatusChange: (id: string, estado: EstadoCotizacion) => unknown
  /** Abre el evento de la cotización para planificarlo. */
  onOpenEvento: (cotizacion: CotizacionItem) => void
}

const TONOS: Record<StatusTone, DetailActionTone> = {
  success: "success",
  danger: "danger",
  info: "accent",
  accent: "accent",
  warning: "default",
  neutral: "default",
}

// Una acción impar ocupa todo el ancho.
const GRID = "grid grid-cols-2 gap-2 [&>:last-child:nth-child(odd)]:col-span-2"

/** Lo que sigue según el estado, y el documento de la cotización. */
export function CotizacionAcciones({
  item,
  correoCliente,
  onStatusChange,
  onOpenEvento,
}: CotizacionAccionesProps) {
  const isAceptada = item.estado === "Aceptada"
  return (
    <DetailSection title="Siguiente paso" noBorder>
      <div className={GRID}>
        {isAceptada && (
          <DetailAction
            icon={Sparkles}
            label="Planificar evento"
            tone="accent"
            onClick={() => onOpenEvento(item)}
            needs={MODULE_ACCESS.eventos.edit}
          />
        )}
        {TRANSICIONES[item.estado].map((estado) => (
          <DetailAction
            key={estado}
            icon={ESTADO_ICONS[estado]}
            label={
              estado === "Borrador"
                ? "Volver a borrador"
                : `Marcar ${estado.toLowerCase()}`
            }
            tone={estado === "Vencida" ? "default" : TONOS[getStatusTone(estado)]}
            onClick={() => onStatusChange(item.id, estado)}
            needs={MODULE_ACCESS.cotizaciones.status}
          />
        ))}
      </div>
      <div className={GRID}>
        <DetailAction
          icon={Download}
          label="Descargar PDF"
          onClick={() => printCotizacion(item)}
          needs={["cotizaciones.pdf"]}
        />
        <DetailAction
          icon={Mail}
          label="Enviar por correo"
          onClick={() => window.location.assign(cotizacionMailto(item, correoCliente))}
        />
      </div>
    </DetailSection>
  )
}
