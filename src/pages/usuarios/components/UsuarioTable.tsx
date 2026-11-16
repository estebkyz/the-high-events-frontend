import React from "react"
import { Pagination } from "../../../components/Pagination"
import {
  Edit2,
  Eye,
  Trash2,
  User,
} from "lucide-react"
import { StatusBadge } from "../../../components/StatusBadge"
import { TableStatusSelect } from "../../../components/TableStatusSelect"
import { EmptyState } from "../../../components/EmptyState"
import type { UsuarioItem } from "../types"
import { getUsuarioFullName } from "../utils"

interface UsuarioTableProps {
  users: UsuarioItem[]; totalCount: number
  pageSize: number
  currentPage: number
  totalPages: number
  onPageSizeChange: (size: number) => void
  onPageChange: (page: number) => void
  onToggleStatus: (id: string) => void
  onView: (user: UsuarioItem) => void
  onEdit: (user: UsuarioItem) => void
  onDelete: (user: UsuarioItem) => void
  onEmptyAction?: () => void
  onResetFilters?: () => void
  isFiltered?: boolean
}

export const UsuarioTable: React.FC<UsuarioTableProps> = ({
  users,
  totalCount,
  pageSize,
  currentPage,
  totalPages,
  onPageSizeChange,
  onPageChange,
  onToggleStatus,
  onView,
  onEdit,
  onDelete,
  onEmptyAction,
  onResetFilters,
  isFiltered = false,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-[#181B22] border border-[#262D3D] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-[#262D3D] text-xs font-medium text-[#94A3B8] bg-[#111318]">
                <th scope="col" className="py-3 px-4">Usuario</th>
                <th scope="col" className="py-3 px-4">Documento</th>
                <th scope="col" className="py-3 px-4">Rol</th>
                <th scope="col" className="py-3 px-4">Teléfono</th>
                <th scope="col" className="py-3 px-4">Estado</th>
                <th scope="col" className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262D3D]/50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6">
                    <EmptyState
                      icon={User}
                      title={
                        isFiltered
                          ? "No se encontraron usuarios coincidentes"
                          : "Aún no tienes usuarios en el sistema"
                      }
                      description={
                        isFiltered
                          ? "Intenta ajustar los criterios de búsqueda o los filtros de rol y estado."
                          : "Comienza creando cuentas de usuario para otorgar acceso a los colaboradores del equipo."
                      }
                      action={
                        isFiltered && onResetFilters
                          ? { label: "Limpiar filtros", onClick: onResetFilters }
                          : onEmptyAction
                            ? {
                                label: "+ Crear primer usuario",
                                onClick: onEmptyAction,
                              }
                            : undefined
                      }
                      secondaryAction={
                        isFiltered && onResetFilters && onEmptyAction
                          ? { label: "+ Crear usuario", onClick: onEmptyAction }
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-[#222734]/40 transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-medium text-[#F1F5F9]">
                      <div>
                        <p className="font-medium text-[#F1F5F9] leading-snug">
                          {getUsuarioFullName(u)}
                        </p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-[#94A3B8] tabular-nums">
                      {u.numero_documento}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-medium text-[#F1F5F9] leading-snug">
                        {u.rol}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-[#94A3B8] tabular-nums">
                      {u.telefono}
                    </td>

                    <td className="py-3.5 px-4">
                      <TableStatusSelect
                        status={u.estado}
                        options={["Activo", "Inactivo"]}
                        onChange={(newEst) => {
                          if (newEst !== u.estado) {
                            onToggleStatus(u.id)
                          }
                        }}
                      />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onView(u)}
                          title="Ver detalles"
                          aria-label={`Ver detalles de ${getUsuarioFullName(u)}`}
                          className="p-2 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(u)}
                          title="Editar usuario"
                          aria-label={`Editar ${getUsuarioFullName(u)}`}
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
                          onClick={() => onDelete(u)}
                          title="Eliminar usuario"
                          aria-label={`Eliminar ${getUsuarioFullName(u)}`}
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
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
      />
    </div>
  )
}
