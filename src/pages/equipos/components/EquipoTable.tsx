import React from "react"
import { Pagination } from "../../../components/Pagination"
import {
  Eye,
  Edit2,
  Trash2,
  Boxes,
} from "lucide-react"
import { TableStatusSelect } from "../../../components/TableStatusSelect"
import { EmptyState } from "../../../components/EmptyState"
import { ESTADO_OPERATIVO_OPTIONS } from "../data"
import type { EquipoItem, EstadoOperativo } from "../types"

export interface EquipoTableProps {
  equipos: EquipoItem[]; totalCount: number
  pageSize: number
  currentPage: number
  totalPages: number
  onPageSizeChange: (newSize: number) => void
  onPageChange: (newPage: number) => void
  onStatusChange: (id: string, newStatus: EstadoOperativo) => void
  onView: (equipo: EquipoItem) => void
  onEdit: (equipo: EquipoItem) => void
  onDelete: (equipo: EquipoItem) => void
  onEmptyAction?: () => void
  onResetFilters?: () => void
  isFiltered?: boolean
}

export const EquipoTable: React.FC<EquipoTableProps> = ({
  equipos,
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
                <th scope="col" className="py-3 px-4">Equipo</th>
                <th scope="col" className="py-3 px-4">Categoría</th>
                <th scope="col" className="py-3 px-4">Propiedad / Proveedor</th>
                <th scope="col" className="py-3 px-4">Estado</th>
                <th scope="col" className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262D3D]/50">
              {equipos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6">
                    <EmptyState
                      icon={Boxes}
                      title={
                        isFiltered
                          ? "No se encontraron equipos coincidentes"
                          : "Aún no tienes equipos en el inventario"
                      }
                      description={
                        isFiltered
                          ? "Intenta ajustar los criterios de búsqueda o los filtros de categoría y estado operativo."
                          : "Comienza registrando equipos técnicos, audiovisuales o mobiliario para gestionar su disponibilidad."
                      }
                      action={
                        isFiltered && onResetFilters
                          ? { label: "Limpiar filtros", onClick: onResetFilters }
                          : onEmptyAction
                            ? {
                                label: "+ Crear primer equipo",
                                onClick: onEmptyAction,
                              }
                            : undefined
                      }
                      secondaryAction={
                        isFiltered && onResetFilters && onEmptyAction
                          ? { label: "+ Crear equipo", onClick: onEmptyAction }
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                equipos.map((e) => (
                  <tr
                    key={e.id}
                    className="hover:bg-[#222734]/40 transition-colors group"
                  >
                    {/* Equipo */}
                    <td className="py-3.5 px-4 font-medium text-[#F1F5F9]">
                      <div>
                        <p className="font-semibold text-[#F1F5F9] leading-snug">
                          {e.nombre}
                        </p>
                        <p className="text-[11px] text-[#64748B]">{e.serie}</p>
                      </div>
                    </td>

                    {/* Categoría */}
                    <td className="py-3.5 px-4 font-medium text-[#F1F5F9]">
                      {e.categoria}
                    </td>

                    {/* Propiedad / Proveedor (id_proveedor nullable) */}
                    <td className="py-3.5 px-4">
                      {e.propiedad === "Alquilado" ? (
                        <div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                            Alquilado
                          </span>
                          <p className="text-[11px] text-[#94A3B8] mt-0.5 font-medium">
                            {e.proveedor_nombre || "Proveedor externo"}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                            Propio
                          </span>
                          <p className="text-[11px] text-[#64748B] mt-0.5">
                            The High Events
                          </p>
                        </div>
                      )}
                    </td>

                    {/* Estado Operativo */}
                    <td className="py-3.5 px-4">
                      <TableStatusSelect
                        currentStatus={e.estadoOperativo}
                        options={ESTADO_OPERATIVO_OPTIONS}
                        onStatusChange={(newEst) =>
                          onStatusChange(e.id, newEst as EstadoOperativo)
                        }
                      />
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleView(e)}
                          title="Ver detalles"
                          aria-label={`Ver detalles de ${e.nombre}`}
                          className="p-2 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(e)}
                          title="Editar equipo"
                          aria-label={`Editar ${e.nombre}`}
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
                          onClick={() => onDelete(e)}
                          title="Eliminar equipo"
                          aria-label={`Eliminar ${e.nombre}`}
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
        itemLabel="equipos"
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
      />
    </div>
  )
}
