import React from "react"
import { Pagination } from "../../../components/Pagination"
import {
  Eye,
  Edit2,
  Trash2,
  CheckSquare,
  User,
  Calendar,
  Flag,
} from "lucide-react"
import { StatusBadge } from "../../../components/StatusBadge"
import { TableStatusSelect } from "../../../components/TableStatusSelect"
import { EmptyState } from "../../../components/EmptyState"
import { MobileResourceCard } from "../../../components/MobileResourceCard"
import type { TareaItem, EstadoTarea } from "../types"

export interface TareaTableProps {
  tasks: TareaItem[]; totalCount: number
  pageSize: number
  currentPage: number
  totalPages: number
  selectedIds?: string[]
  onToggleSelect?: (id: string) => void
  onToggleSelectAll?: () => void
  onEmptyAction?: () => void
  onResetFilters?: () => void
  isFiltered?: boolean
  onPageSizeChange: (newSize: number) => void
  onPageChange: (newPage: number) => void
  onUpdateEstado: (id: string, newEstado: EstadoTarea) => void
  onView: (task: TareaItem) => void
  onEdit: (task: TareaItem) => void
  onDelete: (task: TareaItem) => void
}

export const TareaTable: React.FC<TareaTableProps> = ({
  tasks,
  totalCount,
  pageSize,
  currentPage,
  totalPages,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  onEmptyAction,
  onResetFilters,
  isFiltered = false,
  onPageSizeChange,
  onPageChange,
  onUpdateEstado,
  onView,
  onEdit,
  onDelete,
}) => {
  const handleView = onView
  const handleEdit = onEdit

  const allSelected =
    tasks.length > 0 && tasks.every((t) => selectedIds.includes(t.id))

  return (
    <div className="space-y-4">
      {/* ── Mobile View: Stacked Resource Cards (Shopify Polaris Pattern) ── */}
      <div className="sm:hidden space-y-3">
        {tasks.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title={
              isFiltered
                ? "No se encontraron tareas con estos filtros"
                : "No hay tareas registradas"
            }
            description={
              isFiltered
                ? "Prueba cambiando de fase, evento o responsable para ver más tareas."
                : "Crea tareas operativas para coordinar el montaje, pruebas técnicas y ejecución de tus eventos."
            }
            action={
              isFiltered && onResetFilters
                ? { label: "Limpiar filtros", onClick: onResetFilters }
                : onEmptyAction
                ? { label: "+ Crear primera tarea", onClick: onEmptyAction }
                : undefined
            }
            secondaryAction={
              isFiltered && onResetFilters && onEmptyAction
                ? { label: "+ Crear tarea", onClick: onEmptyAction }
                : undefined
            }
          />
        ) : (
          tasks.map((t) => {
            const isChecked = selectedIds.includes(t.id)
            return (
              <MobileResourceCard
                key={t.id}
                id={t.id}
                isSelected={isChecked}
                onToggleSelect={onToggleSelect}
                onClick={handleView ? () => handleView(t) : undefined}
                title={t.tarea}
                subtitle={t.evento}
                badge={<StatusBadge status={t.estado} />}
                attributes={[
                  { label: "Fase", value: t.fase },
                  { label: "Responsable", value: t.responsable, icon: User },
                  { label: "Prioridad", value: t.prioridad, icon: Flag },
                  { label: "Límite", value: t.fechaLimite, icon: Calendar },
                ]}
                actions={
                  <div className="flex items-center gap-1">
                    {handleView && (
                      <button
                        type="button"
                        onClick={() => handleView(t)}
                        aria-label={`Ver tarea ${t.tarea}`}
                        className="p-1.5 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye size={15} />
                      </button>
                    )}
                    {handleEdit && (
                      <button
                        type="button"
                        onClick={() => handleEdit(t)}
                        aria-label={`Editar tarea ${t.tarea}`}
                        className="p-1.5 text-[#94A3B8] hover:text-[#60A5FA] hover:bg-[#3B82F6]/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    <span aria-hidden="true" className="w-px h-4 bg-[#262D3D] mx-0.5" />
                    <button
                      type="button"
                      onClick={() => onDelete(t)}
                      aria-label={`Eliminar tarea ${t.tarea}`}
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

      {/* ── Desktop View: Table Container ── */}
      <div className="hidden sm:block bg-[#181B22] border border-[#262D3D] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-[#262D3D] text-xs font-medium text-[#94A3B8] bg-[#111318]">
                {onToggleSelect && (
                  <th scope="col" className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={onToggleSelectAll}
                      aria-label="Seleccionar todas las tareas de la página"
                      className="rounded border-[#262D3D] bg-[#111318] text-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED] focus:outline-none cursor-pointer w-4 h-4"
                    />
                  </th>
                )}
                <th scope="col" className="py-3 px-4">Tarea</th>
                <th scope="col" className="py-3 px-4">Responsable</th>
                <th scope="col" className="py-3 px-4">Fase</th>
                <th scope="col" className="py-3 px-4">Plazo</th>
                <th scope="col" className="py-3 px-4">Prioridad</th>
                <th scope="col" className="py-3 px-4">Estado</th>
                <th scope="col" className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262D3D]/50">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={onToggleSelect ? 8 : 7} className="py-6">
                    <EmptyState
                      icon={CheckSquare}
                      title={
                        isFiltered
                          ? "No se encontraron tareas coincidentes"
                          : "Aún no hay tareas creadas"
                      }
                      description={
                        isFiltered
                          ? "Prueba ajustando los términos de búsqueda o los filtros aplicados."
                          : "Organiza las actividades operativas de tus eventos asignando tareas a tu equipo."
                      }
                      action={
                        isFiltered && onResetFilters
                          ? {
                              label: "Limpiar filtros",
                              onClick: onResetFilters,
                            }
                          : onEmptyAction
                            ? {
                                label: "+ Crear primera tarea",
                                onClick: onEmptyAction,
                              }
                            : undefined
                      }
                      secondaryAction={
                        isFiltered && onResetFilters && onEmptyAction
                          ? { label: "+ Crear tarea", onClick: onEmptyAction }
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                tasks.map((r) => {
                  const isChecked = selectedIds.includes(r.id)
                  return (
                    <tr
                      key={r.id}
                      className={`hover:bg-[#222734]/40 transition-colors group ${
                        isChecked ? "bg-[#7C3AED]/10" : ""
                      }`}
                    >
                      {onToggleSelect && (
                        <td className="py-3.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onToggleSelect(r.id)}
                            aria-label={`Seleccionar tarea ${r.tarea}`}
                            className="rounded border-[#262D3D] bg-[#111318] text-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED] focus:outline-none cursor-pointer w-4 h-4"
                          />
                        </td>
                      )}
                      {/* Tarea */}
                      <td className="py-3.5 px-4 font-medium text-[#F1F5F9]">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-[#F1F5F9] leading-snug">
                              {r.tarea}
                            </p>
                          </div>
                          <p className="text-[11px] text-[#94A3B8] mt-0.5">
                           {r.evento}
                          </p>
                        </div>
                      </td>

                      {/* Responsable */}
                      <td className="py-3.5 px-4 text-[#F1F5F9] font-medium">
                        <div>
                          <p className="text-[#F1F5F9] font-medium">
                            {r.responsable}
                          </p>
                          {r.cargo_responsable && (
                            <p className="text-[11px] text-[#64748B]">
                              {r.cargo_responsable}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Fase */}
                      <td className="py-3.5 px-4 text-[#F1F5F9] font-medium">
                        {r.fase}
                      </td>

                      {/* Plazo */}
                      <td className="py-3.5 px-4 text-[#94A3B8] tabular-nums">
                        {r.fechaLimite}
                      </td>

                      {/* Prioridad */}
                      <td className="py-3.5 px-4 text-[#F1F5F9] font-medium">
                        {r.prioridad}
                      </td>

                      {/* Estado */}
                      <td className="py-3.5 px-4">
                        <TableStatusSelect
                          currentStatus={r.estado}
                          options={[
                            "Pendiente",
                            "En Proceso",
                            "Completada",
                          ]}
                          onStatusChange={(newEst) =>
                            onUpdateEstado(r.id, newEst as EstadoTarea)
                          }
                        />
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleView(r)}
                            title="Ver detalles"
                            aria-label={`Ver detalles de ${r.tarea}`}
                            className="p-2 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEdit(r)}
                            title="Editar tarea"
                            aria-label={`Editar ${r.tarea}`}
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
                            onClick={() => onDelete(r)}
                            title="Eliminar tarea"
                            aria-label={`Eliminar ${r.tarea}`}
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

      <Pagination
        pageSize={pageSize}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        itemLabel="tareas"
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
      />
    </div>
  )
}
