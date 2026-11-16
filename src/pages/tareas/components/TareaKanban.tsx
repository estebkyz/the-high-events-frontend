import React from "react"
import { User, Clock } from "lucide-react"
import type { TareaItem, EstadoTarea } from "../types"
import {
  PRIORIDAD_DOT,
  KANBAN_HEADER_COLORS,
  KANBAN_BORDER_COLORS,
} from "../data"

interface TareaKanbanProps {
  tasks: TareaItem[]
  onOpenView: (task: TareaItem) => void
}

const KANBAN_COLUMNS: EstadoTarea[] = [
  "Pendiente",
  "En Proceso",
  "Completada",
]

export const TareaKanban: React.FC<TareaKanbanProps> = ({
  tasks,
  onOpenView,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {KANBAN_COLUMNS.map((colState) => {
        const colTasks = tasks.filter((t) => t.estado === colState)
        return (
          <div
            key={colState}
            className={`bg-[#242830] border rounded-2xl p-4 flex flex-col min-h-[450px] ${KANBAN_BORDER_COLORS[colState]}`}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2D3748]">
              <h2
                className={`text-xs font-semibold uppercase tracking-wider ${KANBAN_HEADER_COLORS[colState]}`}
              >
                {colState}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1A1D23] text-[#A78BFA] border border-[#2D3748]">
                {colTasks.length}
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {colTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onOpenView(task)}
                  className="bg-[#1A1D23] border border-[#2D3748] hover:border-[#7C3AED] p-3.5 rounded-xl space-y-2.5 transition-all shadow-sm cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[10px] font-mono font-semibold text-[#64748B]">
                      {task.codigo_tarea || "TAR-001"} · {task.fase}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${PRIORIDAD_DOT[task.prioridad]}`}
                      title={`Prioridad ${task.prioridad}`}
                    />
                  </div>
                  <p className="text-xs font-semibold text-[#F1F5F9] leading-snug">
                    {task.tarea}
                  </p>
                  <p className="text-[11px] text-[#A78BFA] font-medium truncate">
                    {task.evento}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-2 border-t border-[#2D3748]/50 gap-2">
                    <div className="flex items-center gap-1 min-w-0">
                      <User size={11} className="shrink-0" />
                      <span className="truncate">{task.responsable}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Clock size={11} />
                      <span>{task.fechaLimite}</span>
                    </div>
                  </div>
                </div>
              ))}
              {colTasks.length === 0 && (
                <p className="text-center text-[#64748B] text-[11px] py-8 italic">
                  Sin tareas en esta columna
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
