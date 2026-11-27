import { ArrowRight, Ban, Receipt } from "lucide-react"
import { DetailAction, DetailSection } from "@/components/detail"
import { MODULE_ACCESS } from "@/constants/access"
import { CANCELABLES, CON_VENTA, SIGUIENTE_ESTADO } from "../constants"
import type { EstadoEvento, EventoItem } from "../types"

interface EventoEstadoAccionesProps {
  evento: EventoItem
  /** `undefined` si quien mira no puede ver las ventas. */
  tieneVenta?: boolean
  onStatusChange: (estado: EstadoEvento) => void
  onCancelar: () => void
  onRegistrarVenta: () => void
}

/** Lo que sigue para el evento: avanzar un paso, cancelarlo o registrar su venta. */
export function EventoEstadoAcciones({
  evento,
  tieneVenta,
  onStatusChange,
  onCancelar,
  onRegistrarVenta,
}: EventoEstadoAccionesProps) {
  const siguiente = SIGUIENTE_ESTADO[evento.estado]
  const faltaVenta =
    evento.modalidad === "Cliente" &&
    tieneVenta === false &&
    CON_VENTA.includes(evento.estado)
  const cancelable = CANCELABLES.includes(evento.estado)
  if (!siguiente && !faltaVenta && !cancelable) return null

  return (
    <DetailSection title="Siguiente paso">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 [&>:last-child:nth-child(odd)]:sm:col-span-2">
        {faltaVenta && (
          <DetailAction
            icon={Receipt}
            label="Registrar venta"
            tone="accent"
            onClick={onRegistrarVenta}
            needs={MODULE_ACCESS.ventas.create}
          />
        )}
        {siguiente && (
          <DetailAction
            icon={ArrowRight}
            label={`Pasar a ${siguiente.toLowerCase()}`}
            tone={faltaVenta ? "default" : "accent"}
            onClick={() => onStatusChange(siguiente)}
            needs={MODULE_ACCESS.eventos.status}
          />
        )}
        {cancelable && (
          <DetailAction
            icon={Ban}
            label="Cancelar evento"
            tone="danger"
            onClick={onCancelar}
            needs={MODULE_ACCESS.eventos.status}
          />
        )}
      </div>
    </DetailSection>
  )
}
