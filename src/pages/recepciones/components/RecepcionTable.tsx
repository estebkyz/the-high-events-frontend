import React from "react"
import { Pagination } from "../../../components/Pagination"
import {
  Eye,
  Edit2,
  Trash2,
  ArrowLeftCircle,
  FileCheck,
} from "lucide-react"
import { TableStatusSelect } from "../../../components/TableStatusSelect"
import { EmptyState } from "../../../components/EmptyState"
import type { Recepcion, EstadoRecepcion } from "../types"

export interface RecepcionTableProps {
  recepciones: Recepcion[]; totalCount: number
  pageSize: number
  currentPage: number
  totalPages: number
  onPageSizeChange: (newSize: number) => void
  onPageChange: (newPage: number) => void
  onStatusChange: (id: string, newStatus: EstadoRecepcion) => void
  onView: (rcp: Recepcion) => void
  onEdit: (rcp: Recepcion) => void
  onDelete: (rcp: Recepcion) => void
  onDevolucion?: (rcp: Recepcion) => void
  onEmptyAction?: () => void
  onResetFilters?: () => void
  isFiltered?: boolean
}

export const RecepcionTable: React.FC<RecepcionTableProps> = ({
  recepciones,
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
  onDevolucion,
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
                <th scope="col" className="py-3 px-4">Recepción</th>
                <th scope="col" className="py-3 px-4">Proveedor</th>
                <th scope="col" className="py-3 px-4">Tipo</th>
                <th scope="col" className="py-3 px-4">Fecha</th>
                <th scope="col" className="py-3 px-4">Estado</th>
                <th scope="col" className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262D3D]/50">
              {recepciones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6">
                    <EmptyState
                      icon={FileCheck}
                      title={
                        isFiltered
                          ? "No se encontraron actas de recepción coincidentes"
                          : "Aún no tienes recepciones registradas"
                      }
                      description={
                        isFiltered
                          ? "Intenta ajustar los criterios de búsqueda o los filtros de tipo y estado."
                          : "Comienza registrando entregas, recepciones o devoluciones con proveedores."
                      }
                      action={
                        isFiltered && onResetFilters
                          ? { label: "Limpiar filtros", onClick: onResetFilters }
                          : onEmptyAction
                            ? {
                                label: "+ Crear primera recepción",
                                onClick: onEmptyAction,
                              }
                            : undefined
                      }
                      secondaryAction={
                        isFiltered && onResetFilters && onEmptyAction
                          ? {
                              label: "+ Crear recepción",
                              onClick: onEmptyAction,
                            }
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                recepciones.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-[#222734]/40 transition-colors group"
                  >
                    {/* Recepción */}
                    <td className="py-3.5 px-4 font-medium text-[#F1F5F9]">
                      <div>
                        <p className="font-semibold text-[#F1F5F9] leading-snug">
                          {r.evento}
                        </p>
                        <p className="text-[11px] text-[#94A3B8]">
                          {r.subcontrato}
                        </p>
                      </div>
                    </td>

                    {/* Proveedor */}
                    <td className="py-3.5 px-4 font-medium text-[#F1F5F9]">
                      {r.proveedor}
                    </td>

                    {/* Tipo */}
                    <td className="py-3.5 px-4 font-medium text-[#F1F5F9]">
                      {r.tipo}
                    </td>

                    {/* Fecha */}
                    <td className="py-3.5 px-4 font-medium text-[#94A3B8] tabular-nums">
                      {r.fecha}
                    </td>

                    {/* Estado */}
                    <td className="py-3.5 px-4">
                      <TableStatusSelect
                        currentStatus={r.estado}
                        options={["Pendiente", "Firmada", "Observada"]}
                        onStatusChange={(newStatus) =>
                          onStatusChange(r.id, newStatus as EstadoRecepcion)
                        }
                      />
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        {(r.estado === "Conforme" || r.estado === "Cerrada") &&
                          r.tipo === "Recepción Montaje" &&
                          onDevolucion && (
                            <button
                              type="button"
                              onClick={() => onDevolucion(r)}
                              title="Registrar Devolución"
                              aria-label={`Registrar devolución para ${r.codigo}`}
                              className="p-2 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                            >
                              <ArrowLeftCircle size={16} />
                            </button>
                          )}
                        <button
                          type="button"
                          onClick={() => handleView(r)}
                          title="Ver detalles"
                          aria-label={`Ver detalles de ${r.codigo}`}
                          className="p-2 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(r)}
                          title="Editar acta"
                          aria-label={`Editar acta ${r.codigo}`}
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
                          title="Eliminar acta"
                          aria-label={`Eliminar acta ${r.codigo}`}
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
        itemLabel="actas"
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
      />
    </div>
  )
}
