import React from "react"
import { Pagination } from "../../../components/Pagination"
import {
  Eye,
  Edit2,
  Trash2,
  Layers,
} from "lucide-react"
import { TableStatusSelect } from "../../../components/TableStatusSelect"
import { EmptyState } from "../../../components/EmptyState"
import { ESTADO_SERVICIOS_OPTIONS } from "../data"
import { TIPO_COBRO_LABELS, type ServicioItem } from "../types"

export interface ServicioTableProps {
  services: ServicioItem[]; totalCount: number
  pageSize: number
  currentPage: number
  totalPages: number
  onPageSizeChange: (newSize: number) => void
  onPageChange: (newPage: number) => void
  onStatusChange: (id: string, newStatus: string) => void
  onView: (service: ServicioItem) => void
  onEdit: (service: ServicioItem) => void
  onDelete: (service: ServicioItem) => void
  onEmptyAction?: () => void
  onResetFilters?: () => void
  isFiltered?: boolean
}

export const ServicioTable: React.FC<ServicioTableProps> = ({
  services,
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
                <th scope="col" className="py-3 px-4">Servicio</th>
                <th scope="col" className="py-3 px-4">Categoría</th>
                <th scope="col" className="py-3 px-4">Descripción</th>
                <th scope="col" className="py-3 px-4">Estado</th>
                <th scope="col" className="py-3 px-4">Base</th>
                <th scope="col" className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262D3D]/50">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6">
                    <EmptyState
                      icon={Layers}
                      title={
                        isFiltered
                          ? "No se encontraron servicios coincidentes"
                          : "Aún no tienes servicios en el catálogo"
                      }
                      description={
                        isFiltered
                          ? "Intenta ajustar los criterios de búsqueda o los filtros de categoría y estado."
                          : "Crea servicios técnicos o logísticos con tarifas base para cotizar a tus clientes."
                      }
                      action={
                        isFiltered && onResetFilters
                          ? { label: "Limpiar filtros", onClick: onResetFilters }
                          : onEmptyAction
                            ? {
                                label: "+ Crear primer servicio",
                                onClick: onEmptyAction,
                              }
                            : undefined
                      }
                      secondaryAction={
                        isFiltered && onResetFilters && onEmptyAction
                          ? {
                              label: "+ Crear servicio",
                              onClick: onEmptyAction,
                            }
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                services.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-[#222734]/40 transition-colors group"
                  >
                    {/* Zona 1: Anclaje - Servicio */}
                    <td className="py-3.5 px-4 font-semibold text-[#F1F5F9]">
                      {s.nombre}
                    </td>

                    {/* Zona 2: Descriptiva / Contexto - Categoría */}
                    <td className="py-3.5 px-4 font-medium text-[#F1F5F9]">
                      {s.categoria}
                    </td>

                    {/* Zona 2: Descriptiva / Contexto - Descripción */}
                    <td className="py-3.5 px-4 text-[#94A3B8] text-xs max-w-[280px] truncate">
                      {s.descripcion}
                    </td>

                    {/* Zona 2: Descriptiva / Contexto - Estado */}
                    <td className="py-3.5 px-4">
                      <TableStatusSelect
                        currentStatus={s.estado}
                        options={ESTADO_SERVICIOS_OPTIONS}
                        onStatusChange={(newEst) =>
                          onStatusChange(s.id, newEst)
                        }
                      />
                    </td>

                    {/* Zona 4: Cierre Financiero - Base */}
                    <td className="py-3.5 px-4 font-semibold text-[#10B981] tabular-nums">
                      {s.precioBase}
                      <span className="text-[10px] text-[#A78BFA] block font-medium">
                        {TIPO_COBRO_LABELS[s.tipo_cobro] || s.tipo_cobro}
                      </span>
                    </td>

                    {/* Zona 4: Cierre - Acciones */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleView(s)}
                          title="Ver detalles"
                          aria-label={`Ver detalles de ${s.nombre}`}
                          className="p-2 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(s)}
                          title="Editar servicio"
                          aria-label={`Editar ${s.nombre}`}
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
                          onClick={() => onDelete(s)}
                          title="Eliminar servicio"
                          aria-label={`Eliminar ${s.nombre}`}
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
        itemLabel="servicios"
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
      />
    </div>
  )
}
