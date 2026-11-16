import React from "react"
import { Pagination } from "../../../components/Pagination"
import {
  Eye,
  Edit2,
  Trash2,
  CalendarDays,
} from "lucide-react"
import { TableStatusSelect } from "../../../components/TableStatusSelect"
import { EmptyState } from "../../../components/EmptyState"
import { ESTADOS_EVENTO } from "../types"
import type { EventoItem } from "../types"
import { formatDateTimeRange, formatCOP } from "../utils"

export interface EventoTableProps {
  events: EventoItem[]; totalCount: number
  pageSize: number
  currentPage: number
  totalPages: number
  onPageSizeChange: (newSize: number) => void
  onPageChange: (newPage: number) => void
  onStatusChange: (id: string, newStatus: string) => void
  onView: (event: EventoItem) => void
  onEdit: (event: EventoItem) => void
  onDelete: (event: EventoItem) => void
  onEmptyAction?: () => void
  onResetFilters?: () => void
  isFiltered?: boolean
}

export const EventoTable: React.FC<EventoTableProps> = ({
  events,
  totalCount,
  pageSize,
  currentPage,
  totalPages,
  onPageSizeChange,
  onPageChange,
  onStatusChange,
  onView,
  onEdit,
  onDelete,
  onEmptyAction,
  onResetFilters,
  isFiltered = false,
}) => {
  const handleView = onView
  const handleEdit = onEdit

  return (
    <div className="space-y-4">
      {/* ── Table Container ── */}
      <div className="bg-[#181B22] border border-[#262D3D] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-[#262D3D] text-xs font-medium text-[#94A3B8] bg-[#111318]">
                <th scope="col" className="py-3 px-4">Evento</th>
                <th scope="col" className="py-3 px-4">Cliente</th>
                <th scope="col" className="py-3 px-4">Modalidad</th>
                <th scope="col" className="py-3 px-4">Fecha</th>
                <th scope="col" className="py-3 px-4">Estado</th>
                <th scope="col" className="py-3 px-4">Presupuesto</th>
                <th scope="col" className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262D3D]/50">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6">
                    <EmptyState
                      icon={CalendarDays}
                      title={
                        isFiltered
                          ? "No se encontraron eventos coincidentes"
                          : "Aún no tienes eventos programados"
                      }
                      description={
                        isFiltered
                          ? "Intenta ajustar los criterios de búsqueda, pestañas de modalidad o filtros de estado."
                          : "Comienza creando eventos propios o de clientes externos para coordinar servicios y staff."
                      }
                      action={
                        isFiltered && onResetFilters
                          ? { label: "Limpiar filtros", onClick: onResetFilters }
                          : onEmptyAction
                            ? {
                              label: "+ Crear primer evento",
                              onClick: onEmptyAction,
                            }
                            : undefined
                      }
                      secondaryAction={
                        isFiltered && onResetFilters && onEmptyAction
                          ? { label: "+ Crear evento", onClick: onEmptyAction }
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                events.map((ev) => {
                  const { dateStr, timeStr } = formatDateTimeRange(
                    ev.hora_inicio,
                    ev.hora_fin,
                  )
                  return (
                    <tr
                      key={ev.id}
                      className="hover:bg-[#222734]/40 transition-colors group"
                    >
                      {/* Evento */}
                      <td className="py-3.5 px-4 font-medium text-[#F1F5F9]">
                        <div>
                          <p className="font-semibold text-[#F1F5F9] leading-snug">
                            {ev.nombre}
                          </p>
                          <p className="text-[11px] text-[#94A3B8] mt-0.5">
                            {ev.direccion}
                          </p>
                        </div>
                      </td>

                      {/* Cliente */}
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-medium text-[#F1F5F9] leading-snug">
                            {ev.cliente_nombre}
                          </p>
                          <p className="text-[11px] text-[#94A3B8] mt-0.5 font-mono">
                            {ev.cotizacion_codigo}
                          </p>
                        </div>
                      </td>

                      {/* Modalidad */}
                      <td className="py-3.5 px-4 font-medium text-[#F1F5F9] leading-snug">
                        {ev.modalidad}
                      </td>

                      {/* Fecha */}
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-medium text-[#F1F5F9] tabular-nums">
                            {dateStr}
                          </p>
                          <p className="text-[11px] text-[#94A3B8] tabular-nums">
                            {timeStr}
                          </p>
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="py-3.5 px-4">
                        <TableStatusSelect
                          currentStatus={ev.estado}
                          options={ESTADOS_EVENTO}
                          onStatusChange={(newEstado) =>
                            onStatusChange(ev.id, newEstado)
                          }
                        />
                      </td>

                      {/* Presupuesto */}
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="font-semibold text-[#F1F5F9] tabular-nums">
                            {formatCOP(ev.presupuesto_estimado)}
                          </p>
                          {ev.aforo_esperado && (
                            <p className="text-[11px] text-[#94A3B8] tabular-nums">
                              {ev.aforo_esperado} pers.
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleView(ev)}
                            title="Ver detalles"
                            aria-label={`Ver detalles de ${ev.nombre}`}
                            className="p-2 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEdit(ev)}
                            title="Editar evento"
                            aria-label={`Editar ${ev.nombre}`}
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
                            onClick={() => onDelete(ev)}
                            title="Eliminar evento"
                            aria-label={`Eliminar ${ev.nombre}`}
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
        itemLabel="eventos"
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
      />
    </div>
  )
}
