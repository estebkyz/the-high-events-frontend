import React from "react"
import { BookOpen, Clock } from "lucide-react"
import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import {
  DetailHeader,
  DetailSection,
  DetailGrid,
  DetailField,
} from "../../../components/detail"
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
      footer={
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
      }
    >
      <div className="space-y-4 text-xs">
        <DetailHeader
          badges={
            <>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-[#222734] text-[#A78BFA] border border-[#2D3748]">
                <BookOpen size={11} aria-hidden="true" />
                Catálogo: {task.codigo_tarea || "TAR-001"}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#7C3AED]/15 text-[#A78BFA] border border-[#7C3AED]/25">
                {task.fase}
              </span>
              <StatusBadge status={task.prioridad} />
              <StatusBadge status={task.estado} />
            </>
          }
          title={task.tarea}
          subtitle={task.evento}
          meta={
            task.hora_inicio_estimada && task.hora_fin_estimada ? (
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Clock size={12} aria-hidden="true" />
                {task.hora_inicio_estimada} – {task.hora_fin_estimada}
              </span>
            ) : undefined
          }
        />

        <DetailSection title="Asignación y detalles" noBorder>
          <DetailGrid>
            <DetailField
              label="Evento Asociado (`evento`)"
              value={task.evento}
            />
            <DetailField
              label="Fecha Programada"
              value={task.fechaLimite}
            />
            <DetailField label="Empleado Responsable (`empleado`)" span={2}>
              <div className="flex items-center gap-2 mt-0.5">
                <div
                  className="w-6 h-6 rounded-full bg-[#7C3AED]/30 text-[#A78BFA] flex items-center justify-center font-bold text-[10px] shrink-0"
                  aria-hidden="true"
                >
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
            </DetailField>
            {task.descripcion_catalogo && (
              <DetailField
                label="Descripción técnica del catálogo (`tarea`)"
                value={task.descripcion_catalogo}
                valueClassName="font-normal text-[#CBD5E1] leading-relaxed"
                span={2}
              />
            )}
            {task.notas && (
              <DetailField
                label="Novedades de Avance (`novedades_avance`)"
                value={task.notas}
                valueClassName="font-normal text-[#94A3B8] leading-relaxed"
                span={2}
              />
            )}
          </DetailGrid>
        </DetailSection>

        <DetailSection title="Cambiar Estado Operativo">
          <div className="grid grid-cols-2 gap-2">
            {ESTADOS.map((st) => (
              <button
                key={st}
                type="button"
                aria-pressed={task.estado === st}
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
        </DetailSection>
      </div>
    </Drawer>
  )
}
