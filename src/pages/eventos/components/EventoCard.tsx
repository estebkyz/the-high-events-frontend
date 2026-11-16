import {
  MapPin,
  Users,
  Edit2,
  Clock,
  Trash2,
  ArrowUpRight,
  CalendarDays,
} from "lucide-react"
import type { EventoItem } from "../types"
import { formatDateTimeRange, parseEventDate, formatCOP } from "../utils"

interface EventoCardProps {
  ev?: EventoItem
  event?: EventoItem
  onView: (ev: EventoItem) => void
  onEdit: (ev: EventoItem) => void
  onDelete: (ev: EventoItem) => void
  onChangeEstado: (id: string, estado: string) => void
}

/** Tarjeta resumen de un evento para la vista en cuadrícula. */
export function EventoCard(props: EventoCardProps) {
  const ev = props.ev || props.event
  if (!ev) return null
  const { onView, onEdit, onDelete, onChangeEstado } = props
  const { dateStr, timeStr } = formatDateTimeRange(
    ev.hora_inicio || "",
    ev.hora_fin || "",
  )
  const dateInfo = parseEventDate(ev.hora_inicio || "")

  return (
    <div className="bg-[#181B22] rounded-2xl p-5 transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] flex flex-col justify-between group">
      <div>
        {/* Cabecera de la Tarjeta: Fecha + Modalidad + Selector de Estado */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex flex-col items-center justify-center min-w-[44px] h-[44px] px-2 rounded-xl bg-[#222734] border border-[#2D3748] text-center shadow-xs shrink-0">
              <span className="text-[10px] font-bold text-[#A78BFA] uppercase tracking-wider leading-none">
                {dateInfo.month}
              </span>
              <span className="text-[15px] font-extrabold text-[#F8FAFC] leading-none mt-0.5">
                {dateInfo.day}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              {/* Nombre del Evento Arriba */}
              <h3
                onClick={() => onView(ev)}
                className="text-[15px] font-bold text-[#F8FAFC] group-hover:text-[#A78BFA] transition-colors leading-tight cursor-pointer line-clamp-1"
                title={ev.nombre}
              >
                {ev.nombre}
              </h3>

              {/* Horario y Fecha Abajo en una línea sutil */}
              <div className="flex items-center gap-2 text-[11px] text-[#94A3B8] mt-1">
                <div className="flex items-center gap-1 font-medium text-[#CBD5E1]">
                  <Clock size={12} className="text-[#94A3B8] shrink-0" />
                  <span>{timeStr}</span>
                </div>
                <span className="text-[#64748B]">·</span>
                <div className="flex items-center font-medium gap-1 text-[#CBD5E1]">
                  <CalendarDays size={12} className="text-[#94A3B8] shrink-0" />
                  <span>{dateStr}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cuerpo de la Tarjeta: Título, Cliente, Locación */}
        <div className="mt-4 space-y-2">
          <div className="pt-5 flex flex-col gap-1.5 text-xs border-t border-[#262D3D]">
            <div
              className="flex items-center gap-1.5 font-medium text-[#F8FAFC] truncate"
              title={ev.direccion}
            >
              <MapPin size={13} className="text-[#94A3B8] shrink-0" />
              <span className="truncate">{ev.direccion}</span>
            </div>
            {ev.aforo_esperado && (
              <div className="flex items-center font-medium gap-1.5 text-[#F8FAFC]">
                <Users size={13} className="text-[#94A3B8] shrink-0" />
                <span>{ev.aforo_esperado}</span>
              </div>
            )}
          </div>

          {/* Etiquetas de Servicios y Staff */}
          <div className="pt-2 flex flex-wrap items-center gap-1.5">
            {ev.servicios.slice(0, 3).map((serv) => (
              <span
                key={serv}
                className="px-2 py-0.5 rounded-lg bg-[#222734] text-[11px] font-medium text-[#CBD5E1]"
              >
                {serv}
              </span>
            ))}
            {ev.servicios.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-lg bg-[#222734] text-[10px] text-[#CBD5E1]">
                +{ev.servicios.length - 3}
              </span>
            )}
            {(ev.empleadosAsignados?.length ?? 0) > 0 && (
              <span className="ml-auto text-[11px] text-[#CBD5E1] font-medium flex items-center gap-1 bg-[#222734] px-2 py-0.5 rounded-lg">
                <Users size={11} />
                {ev.empleadosAsignados?.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pie de la Tarjeta: Presupuesto y Acciones */}
      <div className="mt-4 pt-2 flex items-center justify-between">
        <div>
          <span className="text-[13px] font-medium text-[#94A3B8] block">
            Presupuesto
          </span>
          <span className="text-[14px] font-bold text-[#F8FAFC]">
            {formatCOP(ev.presupuesto_estimado)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(ev)}
            className="p-2 rounded-xl bg-[#222734] hover:bg-[#2D3748] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors cursor-pointer"
            title="Editar evento"
          >
            <Edit2 size={13} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(ev)}
            className="p-2 rounded-xl bg-[#222734] hover:bg-[#EF4444]/20 text-[#94A3B8] hover:text-[#EF4444] transition-colors cursor-pointer"
            title="Eliminar evento"
          >
            <Trash2 size={13} />
          </button>
          <button
            type="button"
            onClick={() => onView(ev)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#7C3AED]/15 hover:bg-[#7C3AED]/25 text-[#A78BFA] hover:text-white font-medium text-xs transition-colors cursor-pointer"
          >
            <span>Ver</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
