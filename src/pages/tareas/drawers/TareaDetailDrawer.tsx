import React from "react"
import { BookOpen, Clock } from "lucide-react"
import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import type { TareaItem, EstadoTarea } from "../types"

interface TareaDetailDrawerProps {
  isOpen: boolean
  task: TareaItem | null
  onClose: () => void
  onUpdateEstado: (id: string, estado: EstadoTarea) => void
  onOpenEdit: (task: TareaItem) => void
}

const ESTADOS: EstadoTarea[] = [
  "Pendiente",
  "En Proceso",
  "Completada",
]

export const TareaDetailDrawer: React.FC<TareaDetailDrawerProps> = ({
  isOpen,
  task,
  onClose,
  onUpdateEstado,
  onOpenEdit,
}) => {
  if (!task) return null

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="detail"
      title="Detalle de Tarea en Evento (`evento_tarea`)"
      subtitle={task.evento}
    >
      <div className="space-y-5 text-xs">
        {/* Task header */}
        <div className="p-4 bg-[#1A1D23] rounded-xl border border-[#2D3748] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-[#222734] text-[#A78BFA] border border-[#2D3748]">
              <BookOpen size={11} />
              Catálogo: {task.codigo_tarea || "TAR-001"}
            </span>
            {task.hora_inicio_estimada && task.hora_fin_estimada && (
              <span className="inline-flex items-center gap-1 text-[11px] text-[#94A3B8]">
                <Clock size={12} />
                {task.hora_inicio_estimada} – {task.hora_fin_estimada}
              </span>
            )}
          </div>

          <h2 className="text-[15px] font-bold text-[#F1F5F9] leading-tight">
            {task.tarea}
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#7C3AED]/15 text-[#A78BFA] border border-[#7C3AED]/25">
              {task.fase}
            </span>
            <StatusBadge status={task.prioridad} />
            <StatusBadge status={task.estado} />
          </div>

          {task.descripcion_catalogo && (
            <div className="p-2.5 bg-[#111318] rounded-lg border border-[#262D3D]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] block mb-0.5">
                Descripción técnica del catálogo (`tarea`)
              </span>
              <p className="text-[#CBD5E1] leading-relaxed">
                {task.descripcion_catalogo}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-[11px] pt-2 border-t border-[#2D3748]">
            <div>
              <span className="text-[#64748B] block mb-0.5">
                Evento Asociado (`evento`)
              </span>
              <span className="font-semibold text-[#F1F5F9]">
                {task.evento}
              </span>
            </div>
            <div>
              <span className="text-[#64748B] block mb-0.5">
                Fecha Programada
              </span>
              <span className="font-semibold text-[#F1F5F9]">
                {task.fechaLimite}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-[#64748B] block mb-1">
                Empleado Responsable (`empleado`)
              </span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#7C3AED]/30 text-[#A78BFA] flex items-center justify-center font-bold text-[10px]">
                  {task.responsable.charAt(0)}
                </div>
                <span className="font-semibold text-[#F1F5F9]">
                  {task.responsable}
                </span>
                {task.cargo_responsable && (
                  <span className="px-2 py-0.5 rounded bg-[#222734] text-[10px] text-[#94A3B8] border border-[#2D3748]">
                    {task.cargo_responsable}
                  </span>
                )}
              </div>
            </div>
          </div>

          {task.notas && (
            <div className="pt-2 border-t border-[#2D3748]">
              <span className="text-[#64748B] block mb-1">
                Novedades de Avance (`novedades_avance`)
              </span>
              <p className="text-[#94A3B8] leading-relaxed">{task.notas}</p>
            </div>
          )}
        </div>

        {/* Status change buttons */}
        <div className="p-4 bg-[#1A1D23] rounded-xl border border-[#2D3748] space-y-3">
          <h4 className="font-semibold text-[#F1F5F9] text-[13px]">
            Cambiar Estado Operativo
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {ESTADOS.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => onUpdateEstado(task.id, st)}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors border cursor-pointer ${
                  task.estado === st
                    ? "bg-[#7C3AED] text-white border-[#7C3AED]"
                    : "bg-transparent text-[#94A3B8] border-[#2D3748] hover:border-[#7C3AED] hover:text-[#A78BFA]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Edit shortcut */}
        <button
          type="button"
          onClick={() => {
            onClose()
            onOpenEdit(task)
          }}
          className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#242830] border border-[#2D3748] text-[#94A3B8] hover:text-[#F1F5F9] hover:border-[#7C3AED] transition-colors cursor-pointer"
        >
          Editar Asignación de Tarea
        </button>
      </div>
    </Drawer>
  )
}
