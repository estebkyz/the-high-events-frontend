import React from "react"
import {
  BookOpen,
  Edit2,
  Trash2,
  PlusCircle,
  Calendar,
  Layers,
} from "lucide-react"
import { EmptyState } from "../../../components/EmptyState"
import { MobileResourceCard } from "../../../components/MobileResourceCard"
import { StatusBadge } from "../../../components/StatusBadge"
import type { TareaCatalogoItem } from "../../eventos/catalogStore"
import type { TareaItem } from "../types"

interface TareaCatalogoViewProps {
  catalogo: TareaCatalogoItem[]
  assignedTasks: TareaItem[]
  isFiltered: boolean
  onResetFilters: () => void
  onCreateCatalogo: () => void
  onEditCatalogo: (item: TareaCatalogoItem) => void
  onDeleteCatalogo: (item: TareaCatalogoItem) => void
  onAssignToEvent: (item: TareaCatalogoItem) => void
  onViewAssignedTask: (task: TareaItem) => void
}

export const TareaCatalogoView: React.FC<TareaCatalogoViewProps> = ({
  catalogo,
  assignedTasks,
  isFiltered,
  onResetFilters,
  onCreateCatalogo,
  onEditCatalogo,
  onDeleteCatalogo,
  onAssignToEvent,
  onViewAssignedTask,
}) => {
  const getTaskAssignments = (catItem: TareaCatalogoItem) => {
    return assignedTasks.filter(
      (t) =>
        t.tarea_id === catItem.id ||
        t.tarea.toLowerCase() === catItem.nombre_tarea.toLowerCase(),
    )
  }

  return (
    <div className="space-y-4">

      {/* Vista Móvil */}
      <div className="sm:hidden space-y-3">
        {catalogo.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title={
              isFiltered
                ? "No se encontraron tareas en el catálogo"
                : "Catálogo de tareas vacío"
            }
            description={
              isFiltered
                ? "Prueba limpiando la búsqueda o el filtro de fase sugerida."
                : "Registra las actividades técnicas estándar para asignarlas al crear eventos."
            }
            action={
              isFiltered
                ? { label: "Limpiar filtros", onClick: onResetFilters }
                : { label: "+ Nueva tarea en catálogo", onClick: onCreateCatalogo }
            }
          />
        ) : (
          catalogo.map((item) => {
            const enCurso = getTaskAssignments(item)
            return (
              <MobileResourceCard
                key={item.id}
                id={item.id}
                title={item.nombre_tarea}
                subtitle={item.codigo}
                badge={
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#7C3AED]/15 text-[#A78BFA] border border-[#7C3AED]/25">
                    {item.fase_sugerida}
                  </span>
                }
                attributes={[
                  { label: "Descripción", value: item.descripcion },
                  {
                    label: "En eventos",
                    value: `${enCurso.length} asignación(es)`,
                    icon: Calendar,
                  },
                ]}
                actions={
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditCatalogo(item)}
                      aria-label={`Editar ${item.nombre_tarea}`}
                      className="p-1.5 text-[#94A3B8] hover:text-[#60A5FA] hover:bg-[#3B82F6]/20 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 size={16} />
                    </button>
                    <span aria-hidden="true" className="w-px h-4 bg-[#262D3D] mx-0.5" />
                    <button
                      type="button"
                      onClick={() => onDeleteCatalogo(item)}
                      aria-label={`Eliminar ${item.nombre_tarea}`}
                      className="p-1.5 text-[#94A3B8] hover:text-[#F87171] hover:bg-[#EF4444]/20 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                }
              />
            )
          })
        )}
      </div>

      {/* Vista Desktop: Tabla del Catálogo + Eventos Asignados en Curso */}
      <div className="hidden sm:block bg-[#181B22] border border-[#262D3D] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-[#262D3D] text-xs font-medium text-[#94A3B8] bg-[#111318]">
                <th scope="col" className="py-3 px-4">Tarea</th>
                <th scope="col" className="py-3 px-4 w-40">Fase</th>
                <th scope="col" className="py-3 px-4">
                  Asignaciones
                </th>
                <th scope="col" className="py-3 px-4 text-right w-48">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262D3D]/50">
              {catalogo.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6">
                    <EmptyState
                      icon={BookOpen}
                      title={
                        isFiltered
                          ? "No se encontraron plantillas coincidentes"
                          : "Aún no hay tareas en el catálogo"
                      }
                      description={
                        isFiltered
                          ? "Prueba ajustando los términos de búsqueda o el filtro de fase."
                          : "Crea plantillas de tareas técnicas para asignarlas rápidamente al crear eventos."
                      }
                      action={
                        isFiltered
                          ? { label: "Limpiar filtros", onClick: onResetFilters }
                          : {
                              label: "+ Crear tarea en catálogo",
                              onClick: onCreateCatalogo,
                            }
                      }
                    />
                  </td>
                </tr>
              ) : (
                catalogo.map((item) => {
                  const enCurso = getTaskAssignments(item)
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#222734]/40 transition-colors align-top"
                    >
                      <td className="py-4 px-4">
                        <p className="font-semibold text-[#F1F5F9] leading-snug">
                          {item.nombre_tarea}
                        </p>
                        <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed max-w-xl">
                          {item.descripcion}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#222734] text-[#CBD5E1]">
                          <Layers size={12} className="text-[#A78BFA]" />
                          {item.fase_sugerida}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {enCurso.length === 0 ? (
                          <span className="text-xs text-[#64748B] italic">
                            Disponible en catálogo · Sin eventos activos
                          </span>
                        ) : (
                          <div className="space-y-1.5">
                            {enCurso.map((asig) => (
                              <button
                                key={asig.id}
                                type="button"
                                onClick={() => onViewAssignedTask(asig)}
                                className="w-full text-left flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-[#111318] transition-colors cursor-pointer group"
                              >
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-[#F1F5F9] group-hover:text-[#A78BFA] truncate">
                                    {asig.evento}
                                  </p>
                                  <p className="text-[10px] text-[#94A3B8] truncate">
                                    Resp: {asig.responsable} · {asig.fechaLimite}
                                  </p>
                                </div>
                                <StatusBadge status={asig.estado} />
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onEditCatalogo(item)}
                            title="Editar plantilla del catálogo"
                            aria-label={`Editar ${item.nombre_tarea}`}
                            className="p-2 text-[#94A3B8] hover:text-[#60A5FA] hover:bg-[#3B82F6]/20 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 size={16} />
                          </button>
                          <span
                            aria-hidden="true"
                            className="w-px h-5 bg-[#262D3D] mx-1"
                          />
                          <button
                            type="button"
                            onClick={() => onDeleteCatalogo(item)}
                            title="Eliminar del catálogo"
                            aria-label={`Eliminar ${item.nombre_tarea}`}
                            className="p-2 text-[#94A3B8] hover:text-[#F87171] hover:bg-[#EF4444]/20 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
