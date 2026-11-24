import { Clock, MapPin, Users } from "lucide-react"
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

  return (
    <article className="bg-[#181B22] border border-[#262D3D] rounded-2xl p-5 flex flex-col justify-between gap-4">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center justify-center min-w-[44px] h-[44px] rounded-xl bg-[#222734] shrink-0">
            <span className="text-[10px] font-bold text-[#A78BFA] leading-none">
              {month}
            </span>
            <span className="text-[15px] font-extrabold text-[#F8FAFC] leading-none mt-0.5">
              {day}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-bold text-[#F8FAFC] leading-tight line-clamp-2">
              {evento.nombre}
            </h3>
            <p className="text-[11px] text-[#94A3B8] mt-1 truncate">
              {evento.cliente_nombre}
            </p>
          </div>
          <StatusBadge status={evento.estado} className="shrink-0" />
        </div>

        <ul className="space-y-1.5 text-xs text-[#CBD5E1] pt-4 border-t border-[#262D3D]">
          <li className="flex items-center gap-1.5">
            <Clock size={13} className="text-[#94A3B8] shrink-0" aria-hidden="true" />
            {formatDateTime(evento.hora_inicio)}
          </li>
          <li className="flex items-center gap-1.5 min-w-0">
            <MapPin size={13} className="text-[#94A3B8] shrink-0" aria-hidden="true" />
            <span className="truncate">{evento.direccion || "Sin ubicación"}</span>
          </li>
          <li className="flex items-center gap-1.5">
            <Users size={13} className="text-[#94A3B8] shrink-0" aria-hidden="true" />
            {contarEmpleados(evento)} empleados asignados
          </li>
        </ul>
        <TagsCell tags={evento.servicios ?? []} max={3} />
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-[14px] font-bold text-[#10B981] tabular-nums">
          {formatCOP(evento.presupuesto_estimado)}
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
