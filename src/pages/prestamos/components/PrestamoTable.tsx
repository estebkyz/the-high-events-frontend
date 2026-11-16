import React from "react"
import { Pagination } from "../../../components/Pagination"
import {
  Eye,
  Edit2,
  Trash2,
  RotateCcw,
  Repeat,
} from "lucide-react"
import { TableStatusSelect } from "../../../components/TableStatusSelect"
import { EmptyState } from "../../../components/EmptyState"
import { ESTADO_OPTIONS } from "../data"
import type { PrestamoItem, PrestamoEstado } from "../types"

export interface PrestamoTableProps {
  prestamos: PrestamoItem[]; totalCount: number
  pageSize: number
  currentPage: number
  totalPages: number
  onPageSizeChange: (newSize: number) => void
  onPageChange: (newPage: number) => void
  onStatusChange: (id: string, newStatus: PrestamoEstado) => void
  onView: (prestamo: PrestamoItem) => void
  onEdit: (prestamo: PrestamoItem) => void
  onDelete: (prestamo: PrestamoItem) => void
  onOpenReturn?: (prestamo: PrestamoItem) => void
  onEmptyAction?: () => void
  onResetFilters?: () => void
  isFiltered?: boolean
}

export const PrestamoTable: React.FC<PrestamoTableProps> = ({
  prestamos,
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
  onOpenReturn,
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
                <th scope="col" className="py-3 px-4">Responsable</th>
                <th scope="col" className="py-3 px-4">Evento</th>
                <th scope="col" className="py-3 px-4">Equipos</th>
                <th scope="col" className="py-3 px-4">Salida</th>
                <th scope="col" className="py-3 px-4">Devolución</th>
                <th scope="col" className="py-3 px-4">Estado</th>
                <th scope="col" className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262D3D]/50">
              {prestamos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6">
                    <EmptyState
                      icon={Repeat}
                      title={
                        isFiltered
                          ? "No se encontraron préstamos coincidentes"
                          : "Aún no tienes préstamos de equipos registrados"
                      }
                      description={
                        isFiltered
                          ? "Intenta ajustar los criterios de búsqueda o el filtro de estado."
                          : "Registra la salida y préstamo de equipos a responsables y eventos."
                      }
                      action={
                        isFiltered && onResetFilters
                          ? { label: "Limpiar filtros", onClick: onResetFilters }
                          : onEmptyAction
                            ? {
                                label: "+ Registrar primer préstamo",
                                onClick: onEmptyAction,
                              }
                            : undefined
                      }
                      secondaryAction={
                        isFiltered && onResetFilters && onEmptyAction
                          ? {
                              label: "+ Registrar préstamo",
                              onClick: onEmptyAction,
                            }
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                prestamos.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-[#222734]/40 transition-colors group"
                  >
                    {/* Responsable */}
                    <td className="py-3.5 px-4 font-medium text-[#F1F5F9]">
                      {r.responsable}
                    </td>

                    {/* Evento */}
                    <td className="py-3.5 px-4 font-medium text-[#F1F5F9]">
                      {r.evento}
                    </td>

                    {/* Equipos */}
                    <td className="py-3.5 px-4 font-medium text-[#F1F5F9] tabular-nums">
                      {r.equipos.length}
                    </td>

                    {/* Salida */}
                    <td className="py-3.5 px-4 text-[#94A3B8] tabular-nums">
                      {r.fechaSalida}
                    </td>

                    {/* Devolución */}
                    <td className="py-3.5 px-4 text-[#94A3B8] tabular-nums">
                      {r.fechaDevolucion}
                    </td>

                    {/* Estado */}
                    <td className="py-3.5 px-4">
                      <TableStatusSelect
                        currentStatus={r.estado}
                        options={ESTADO_OPTIONS}
                        onStatusChange={(newEstado) =>
                          onStatusChange(r.id, newEstado as PrestamoEstado)
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
                          aria-label={`Ver detalles de ${r.responsable}`}
                          className="p-2 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(r)}
                          title="Editar préstamo"
                          aria-label={`Editar préstamo ${r.responsable}`}
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
                          title="Eliminar préstamo"
                          aria-label={`Eliminar préstamo ${r.responsable}`}
                          className="p-2 text-[#94A3B8] hover:text-[#F87171] hover:bg-[#EF4444]/20 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
        itemLabel="préstamos"
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
      />
    </div>
  )
}
