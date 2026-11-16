import React from "react"
import { Pagination } from "../../../components/Pagination"
import {
  Eye,
  Edit2,
  Trash2,
  UserCheck,
} from "lucide-react"
import { StatusBadge } from "../../../components/StatusBadge"
import { TableStatusSelect } from "../../../components/TableStatusSelect"
import { EmptyState } from "../../../components/EmptyState"
import { getEmpleadoFullName } from "../utils"
import type { EmpleadoItem, EstadoEmpleado } from "../types"

interface EmpleadoTableProps {
  data: EmpleadoItem[]; paginatedData: EmpleadoItem[]
  currentPage: number
  totalPages: number
  pageSize: number
  onPageSizeChange: (newSize: number) => void
  onPageChange: (newPage: number) => void
  onView: (emp: EmpleadoItem) => void
  onEdit: (emp: EmpleadoItem) => void
  onDelete: (emp: EmpleadoItem) => void
  onToggleEstado: (emp: EmpleadoItem) => void
  onEmptyAction?: () => void
  onResetFilters?: () => void
  isFiltered?: boolean
}

export function EmpleadoTable({
  data,
  paginatedData,
  currentPage,
  totalPages,
  pageSize,
  onPageSizeChange,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onToggleEstado,
  onEmptyAction,
  onResetFilters,
  isFiltered = false,
}: EmpleadoTableProps) {
  return (
    <div className="space-y-3">
      {/* Contenedor de la tabla */}
      <div className="bg-[#181B22] border border-[#262D3D] rounded-2xl overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-[#262D3D] text-xs font-medium text-[#94A3B8] bg-[#111318]">
                <th scope="col" className="py-3 px-4">Empleado</th>
                <th scope="col" className="py-3 px-4">Documento</th>
                <th scope="col" className="py-3 px-4">Cargo</th>
                <th scope="col" className="py-3 px-4">Vinculación</th>
                <th scope="col" className="py-3 px-4">Teléfono</th>
                <th scope="col" className="py-3 px-4">Estado</th>
                <th scope="col" className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262D3D]/50">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6">
                    <EmptyState
                      icon={UserCheck}
                      title={
                        isFiltered
                          ? "No se encontraron empleados coincidentes"
                          : "Aún no tienes empleados registrados"
                      }
                      description={
                        isFiltered
                          ? "Intenta ajustar los criterios de búsqueda o los filtros de cargo y vinculación."
                          : "Comienza registrando colaboradores para asignarlos al staff de tus eventos."
                      }
                      action={
                        isFiltered && onResetFilters
                          ? { label: "Limpiar filtros", onClick: onResetFilters }
                          : onEmptyAction
                            ? {
                                label: "+ Crear primer empleado",
                                onClick: onEmptyAction,
                              }
                            : undefined
                      }
                      secondaryAction={
                        isFiltered && onResetFilters && onEmptyAction
                          ? { label: "+ Crear empleado", onClick: onEmptyAction }
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                paginatedData.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-[#222734]/40 transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-medium text-[#F1F5F9]">
                      <div>
                        <p className="font-semibold text-[#F1F5F9] leading-snug">
                          {getEmpleadoFullName(emp)}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-[#94A3B8] tabular-nums">
                      {emp.numero_documento}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-[#F8FAFC]">
                      {emp.cargo}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-[#F8FAFC]">
                      {emp.vinculacion || "Fijo"}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-[#94A3B8] tabular-nums">
                      {emp.telefono}
                    </td>

                    <td className="py-3.5 px-4">
                      <TableStatusSelect
                        currentStatus={emp.estado}
                        options={["Activo", "Inactivo"]}
                        onStatusChange={(newEst) => {
                          if (newEst !== emp.estado) {
                            onToggleEstado(emp)
                          }
                        }}
                      />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onView(emp)}
                          title="Ver ficha"
                          aria-label={`Ver ficha de ${getEmpleadoFullName(emp)}`}
                          className="p-2 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(emp)}
                          title="Editar colaborador"
                          aria-label={`Editar ${getEmpleadoFullName(emp)}`}
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
                          onClick={() => onDelete(emp)}
                          title="Eliminar colaborador"
                          aria-label={`Eliminar ${getEmpleadoFullName(emp)}`}
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
        totalCount={data.length}
        itemLabel="colaboradores"
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
      />
    </div>
  )
}
