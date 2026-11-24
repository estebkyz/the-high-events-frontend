import { Clock, User } from "lucide-react"
import { ESTADOS_TAREA, KANBAN_COLORS, PRIORIDAD_DOT } from "../constants"
import type { TareaItem } from "../types"

interface TareaKanbanProps {
  tareas: TareaItem[]
  loading: boolean
  onView: (tarea: TareaItem) => void
}

export function TareaKanban({ tareas, loading, onView }: TareaKanbanProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {ESTADOS_TAREA.map((estado) => {
        const columna = tareas.filter((t) => t.estado === estado)
        const colors = KANBAN_COLORS[estado]
        return (
          <section
            key={estado}
            aria-label={estado}
            className={`bg-[#181B22] border rounded-2xl p-4 flex flex-col min-h-[320px] ${colors.border}`}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2D3748]">
              <h2 className={`text-xs font-semibold ${colors.header}`}>{estado}</h2>
              <span className="text-[11px] font-semibold text-[#94A3B8] tabular-nums">
                {columna.length}
              </span>
            </div>
            <div className="space-y-3 flex-1">
              {columna.map((tarea) => (
                <TareaKanbanCard
                  key={tarea.id}
                  tarea={tarea}
                  onClick={() => onView(tarea)}
                />
              ))}
              {columna.length === 0 && (
                <p className="text-center text-[#94A3B8] text-[11px] py-8">
                  {loading ? "Cargando tareas…" : "Sin tareas"}
                </p>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}

interface TareaKanbanCardProps {
  tarea: TareaItem
  onClick: () => void
}

function TareaKanbanCard({ tarea, onClick }: TareaKanbanCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-[#111318] border border-[#2D3748] hover:border-[#7C3AED] focus-visible:border-[#7C3AED] focus:outline-none p-3.5 rounded-xl space-y-2 transition-colors cursor-pointer"
    >
      <span className="flex items-center justify-between gap-1.5 text-[11px] text-[#94A3B8]">
        {tarea.fase}
        <span
          role="img"
          aria-label={`Prioridad ${tarea.prioridad}`}
          className={`w-2 h-2 rounded-full shrink-0 ${PRIORIDAD_DOT[tarea.prioridad]}`}
        />
      </span>
      <span className="block text-xs font-semibold text-[#F1F5F9]">{tarea.tarea}</span>
      <span className="block text-[11px] text-[#A78BFA] truncate">{tarea.evento}</span>
      <span className="flex items-center justify-between gap-2 text-[11px] text-[#94A3B8] pt-2 border-t border-[#2D3748]/50">
        <span className="inline-flex items-center gap-1 min-w-0">
          <User size={11} className="shrink-0" aria-hidden="true" />
          <span className="truncate">{tarea.responsable}</span>
        </span>
        <span className="inline-flex items-center gap-1 shrink-0 tabular-nums">
          <Clock size={11} aria-hidden="true" />
          {tarea.fechaLimite}
        </span>
      </span>
    </button>
  )
}
