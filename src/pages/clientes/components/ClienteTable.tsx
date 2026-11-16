import { Pagination } from "../../../components/Pagination"
import {
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building2,
  User as UserIcon,
} from "lucide-react"
import { StatusBadge } from "../../../components/StatusBadge"
import { TableStatusSelect } from "../../../components/TableStatusSelect"
import { EmptyState } from "../../../components/EmptyState"
import { MobileResourceCard } from "../../../components/MobileResourceCard"
import { Users } from "lucide-react"
import type { ClienteItem } from "../types"
import { getClienteDisplayName } from "../utils"

export interface ClienteTableProps {
  clients: ClienteItem[]; totalCount: number
  pageSize: number
  currentPage: number
  totalPages: number
  onPageSizeChange: (newSize: number) => void
  onPageChange: (newPage: number) => void
  onStatusChange: (id: string, newStatus: string) => void
  onView: (client: ClienteItem) => void
  onEdit: (client: ClienteItem) => void
  onDelete: (client: ClienteItem) => void
  onEmptyAction?: () => void
  onResetFilters?: () => void
  isFiltered?: boolean
}

export const ClienteTable: React.FC<ClienteTableProps> = ({
  clients,
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
      {/* ── Mobile View: Stacked Resource Cards (Shopify Polaris Pattern) ── */}
      <div className="sm:hidden space-y-3">
        {clients.length === 0 ? (
          <EmptyState
            icon={Users}
            title={
              isFiltered
                ? "No se encontraron clientes coincidentes"
                : "Aún no tienes clientes registrados"
            }
            description={
              isFiltered
                ? "Intenta ajustar los criterios de búsqueda o los filtros de tipo y estado."
                : "Comienza agregando clientes (personas naturales o empresas) para vincularlos a tus eventos."
            }
            action={
              isFiltered && onResetFilters
                ? { label: "Limpiar filtros", onClick: onResetFilters }
                : onEmptyAction
                ? { label: "+ Crear primer cliente", onClick: onEmptyAction }
                : undefined
            }
            secondaryAction={
              isFiltered && onResetFilters && onEmptyAction
                ? { label: "+ Crear cliente", onClick: onEmptyAction }
                : undefined
            }
          />
        ) : (
          clients.map((c) => {
            const isEmpresa = c.tipo_cliente === "Empresa"
            return (
              <MobileResourceCard
                key={c.id}
                id={c.id}
                onClick={handleView ? () => handleView(c) : undefined}
                title={getClienteDisplayName(c)}
                subtitle={`${c.tipo_documento}: ${c.numero_documento}`}
                badge={<StatusBadge status={c.estado} />}
                attributes={[
                  {
                    label: "Tipo",
                    value: c.tipo_cliente,
                    icon: isEmpresa ? Building2 : UserIcon,
                  },
                  {
                    label: "Teléfono",
                    value: c.telefono || "Sin registrar",
                    icon: Phone,
                  },
                  {
                    label: "Correo",
                    value: c.correo,
                    icon: Mail,
                  },
                  {
                    label: "Dirección",
                    value: c.direccion || "No especificada",
                    icon: MapPin,
                  },
                ]}
                actions={
                  <div className="flex items-center gap-1">
                    {handleView && (
                      <button
                        type="button"
                        onClick={() => handleView(c)}
                        aria-label={`Ver detalles de ${getClienteDisplayName(c)}`}
                        className="p-1.5 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    {handleEdit && (
                      <button
                        type="button"
                        onClick={() => handleEdit(c)}
                        aria-label={`Editar ${getClienteDisplayName(c)}`}
                        className="p-1.5 text-[#94A3B8] hover:text-[#60A5FA] hover:bg-[#3B82F6]/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    <span aria-hidden="true" className="w-px h-4 bg-[#262D3D] mx-0.5" />
                    <button
                      type="button"
                      onClick={() => onDelete(c)}
                      aria-label={`Eliminar ${getClienteDisplayName(c)}`}
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
                <th scope="col" className="py-3 px-4">Cliente</th>
                <th scope="col" className="py-3 px-4">Documento</th>
                <th scope="col" className="py-3 px-4">Tipo</th>
                <th scope="col" className="py-3 px-4">Contacto</th>
                <th scope="col" className="py-3 px-4">Dirección</th>
                <th scope="col" className="py-3 px-4">Estado</th>
                <th scope="col" className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262D3D]/50">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6">
                    <EmptyState
                      icon={Users}
                      title={
                        isFiltered
                          ? "No se encontraron clientes coincidentes"
                          : "Aún no tienes clientes registrados"
                      }
                      description={
                        isFiltered
                          ? "Intenta ajustar los criterios de búsqueda o los filtros de tipo y estado."
                          : "Comienza agregando clientes (personas naturales o empresas) para vincularlos a tus eventos."
                      }
                      action={
                        isFiltered && onResetFilters
                          ? {
                              label: "Limpiar filtros",
                              onClick: onResetFilters,
                            }
                          : onEmptyAction
                            ? {
                                label: "+ Crear primer cliente",
                                onClick: onEmptyAction,
                              }
                            : undefined
                      }
                      secondaryAction={
                        isFiltered && onResetFilters && onEmptyAction
                          ? { label: "+ Crear cliente", onClick: onEmptyAction }
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                clients.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-[#222734]/40 transition-colors group"
                  >
                    {/* Cliente */}
                    <td className="py-3.5 px-4 font-medium text-[#F1F5F9]">
                      <div>
                        <p className="font-medium text-[#F1F5F9] leading-snug">
                          {getClienteDisplayName(c)}
                        </p>
                        {c.tipo_cliente === "Empresa" && c.contacto_nombre && (
                          <p className="text-[11px] text-[#94A3B8] mt-0.5">
                            {c.contacto_nombre}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Documento */}
                    <td className="py-3.5 px-4 font-medium text-[#94A3B8] tabular-nums">
                      {c.numero_documento}
                    </td>

                    {/* Tipo */}
                    <td className="py-3.5 px-4 font-medium text-[#F1F5F9]">
                      {c.tipo_cliente}
                    </td>

                    {/* Contacto */}
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="text-[#F1F5F9] text-[13px]">{c.correo}</p>
                        <p className="text-[11px] text-[#94A3B8] tabular-nums">
                          {c.telefono}
                        </p>
                      </div>
                    </td>

                    {/* Dirección */}
                    <td className="py-3.5 px-4 font-medium text-[11px] text-[#F1F5F9]">
                      <div>{c.direccion}</div>
                    </td>

                    {/* Estado */}
                    <td className="py-3.5 px-4">
                      <TableStatusSelect
                        currentStatus={c.estado}
                        options={["Activo", "Inactivo"]}
                        onStatusChange={(newEst) =>
                          onStatusChange(c.id, newEst)
                        }
                      />
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleView(c)}
                          title="Ver detalles"
                          aria-label={`Ver detalles de ${getClienteDisplayName(c)}`}
                          className="p-2 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(c)}
                          title="Editar cliente"
                          aria-label={`Editar ${getClienteDisplayName(c)}`}
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
                          onClick={() => onDelete(c)}
                          title="Eliminar cliente"
                          aria-label={`Eliminar ${getClienteDisplayName(c)}`}
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
        itemLabel="clientes"
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
      />
    </div>
  )
}
