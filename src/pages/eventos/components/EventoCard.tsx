import { Clock, MapPin, Users } from "lucide-react"
import { MapsLink } from "@/components/MapsLink"
import { StatusBadge } from "@/components/StatusBadge"
import { RowActions } from "@/components/list/RowActions"
import { TagsCell } from "@/components/list/cells"
import { formatCOP } from "@/utils/format"
import { contarEmpleados } from "../form"
import { dayAndMonth, formatDateTime } from "../schedule"
import type { EventoItem } from "../types"

interface EventoCardProps {
  evento: EventoItem
  onView: (evento: EventoItem) => void
  onEdit: (evento: EventoItem) => void
  onDelete: (evento: EventoItem) => void
}

/** Tarjeta resumen de un evento para la vista en cuadrícula. */
export function EventoCard({ evento, onView, onEdit, onDelete }: EventoCardProps) {
  const { day, month } = dayAndMonth(evento.hora_inicio)
  const empleados = contarEmpleados(evento)

  return (
    <article className="bg-surface rounded-xl shadow-card p-4 flex flex-col justify-between gap-4">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center justify-center min-w-[44px] h-[44px] rounded-lg bg-brand-soft shrink-0">
            <span className="text-xs font-semibold text-brand-ink leading-none">
              {month}
            </span>
            <span className="text-[15px] font-semibold text-ink leading-none mt-0.5">
              {day}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[14px] font-semibold text-ink leading-tight line-clamp-2">
              {evento.nombre}
            </h3>
            <p className="text-xs text-ink-muted mt-1 truncate">
              {evento.cliente_nombre}
            </p>
          </div>
          <StatusBadge status={evento.estado} className="shrink-0" />
        </div>

        <ul className="space-y-1.5 text-xs text-ink-soft pt-4 border-t border-line-soft">
          <li className="flex items-center gap-1.5">
            <Clock size={13} className="text-ink-muted shrink-0" aria-hidden="true" />
            {formatDateTime(evento.hora_inicio)}
          </li>
          <li className="flex items-start gap-1.5 min-w-0">
            <MapPin
              size={13}
              className="text-ink-muted shrink-0 mt-0.5"
              aria-hidden="true"
            />
            {evento.direccion ? (
              <MapsLink ubicacion={evento.direccion} variant="text" />
            ) : (
              "Sin ubicación"
            )}
          </li>
          <li className="flex items-center gap-1.5">
            <Users size={13} className="text-ink-muted shrink-0" aria-hidden="true" />
            {empleados} {empleados === 1 ? "empleado asignado" : "empleados asignados"}
          </li>
        </ul>
        <TagsCell tags={evento.servicios ?? []} max={3} />
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-[14px] font-semibold text-ink tabular-nums">
          {formatCOP(evento.valor_total ?? 0)}
        </span>
        <RowActions
          item={evento}
          itemName={evento.nombre}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </article>
  )
}
