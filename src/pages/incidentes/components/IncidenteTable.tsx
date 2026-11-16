import React from "react"
import { Pagination } from "../../../components/Pagination"
import {
  Eye,
  Edit2,
  Trash2,
  User,
  Calendar,
  AlertOctagon,
} from "lucide-react"
import { StatusBadge } from "../../../components/StatusBadge"
import { TableStatusSelect } from "../../../components/TableStatusSelect"
import { EmptyState } from "../../../components/EmptyState"
import { MobileResourceCard } from "../../../components/MobileResourceCard"
import { AlertTriangle } from "lucide-react"
import type { IncidenteItem, EstadoIncidente } from "../types"
import { TIPO_INCIDENTE_LABELS } from "../types"

export interface IncidenteTableProps {
  incidents: IncidenteItem[]; totalCount: number
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
  onStatusChange: (id: string, newStatus: EstadoIncidente) => void
  onView: (incident: IncidenteItem) => void
  onEdit?: (incident: IncidenteItem) => void
  onDelete: (incident: IncidenteItem) => void
}

export const IncidenteTable: React.FC<IncidenteTableProps> = ({
  incidents,
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
  onStatusChange,
  onView,
  onEdit,
  onDelete,
}) => {
  const handleView = onView
  const handleEdit = onEdit

  const allSelected =
    incidents.length > 0 && incidents.every((i) => selectedIds.includes(i.id))

  return (
    <div className="space-y-4">
      {/* ── Mobile View: Stacked Resource Cards (Shopify Polaris Pattern) ── */}
      <div className="sm:hidden space-y-3">
        {incidents.length === 0 ? (
          <EmptyState
            icon={AlertTriangle}
            title={
              isFiltered
                ? "No se encontraron incidentes con estos filtros"
                : "No hay incidentes registrados"
            }
            description={
              isFiltered
                ? "Prueba cambiando de criticidad, estado o evento para ver más incidentes."
                : "Los incidentes permiten registrar anomalías técnicas o logísticas durante la producción."
            }
            action={
              isFiltered && onResetFilters
                ? { label: "Limpiar filtros", onClick: onResetFilters }
                : onEmptyAction
                ? { label: "+ Reportar primer incidente", onClick: onEmptyAction }
                : undefined
            }
            secondaryAction={
              isFiltered && onResetFilters && onEmptyAction
                ? { label: "+ Reportar incidente", onClick: onEmptyAction }
                : undefined
            }
          />
        ) : (
          incidents.map((r) => {
            const isChecked = selectedIds.includes(r.id)
            return (
              <MobileResourceCard
                key={r.id}
                id={r.id}
                isSelected={isChecked}
                onToggleSelect={onToggleSelect}
                onClick={handleView ? () => handleView(r) : undefined}
                title={r.titulo}
                subtitle={`${r.codigo} · ${r.evento}`}
                badge={<StatusBadge status={r.estado} />}
                attributes={[
                  { label: "Criticidad", value: r.criticidad, icon: AlertOctagon },
                  { label: "Reporta", value: r.reporta, icon: User },
                  { label: "Fecha", value: r.fecha, icon: Calendar },
                ]}
                actions={
                  <div className="flex items-center gap-1">
                    {handleView && (
                      <button
                        type="button"
                        onClick={() => handleView(r)}
                        aria-label={`Ver incidente ${r.codigo}`}
                        className="p-1.5 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye size={15} />
                      </button>
                    )}
                    {handleEdit && (
                      <button
                        type="button"
                        onClick={() => handleEdit(r)}
                        aria-label={`Editar incidente ${r.codigo}`}
                        className="p-1.5 text-[#94A3B8] hover:text-[#60A5FA] hover:bg-[#3B82F6]/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    <span aria-hidden="true" className="w-px h-4 bg-[#262D3D] mx-0.5" />
                    <button
                      type="button"
                      onClick={() => onDelete(r)}
                      aria-label={`Eliminar incidente ${r.codigo}`}
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
                      aria-label="Seleccionar todos los incidentes de la página"
                      className="rounded border-[#262D3D] bg-[#111318] text-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED] focus:outline-none cursor-pointer w-4 h-4"
                    />
                  </th>
                )}
                <th scope="col" className="py-3 px-4">Incidente</th>
                <th scope="col" className="py-3 px-4">Informante</th>
                <th scope="col" className="py-3 px-4">Fecha</th>
                <th scope="col" className="py-3 px-4">Criticidad</th>
                <th scope="col" className="py-3 px-4">Estado</th>
                <th scope="col" className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262D3D]/50">
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan={onToggleSelect ? 7 : 6} className="py-6">
                    <EmptyState
                      icon={AlertTriangle}
                      title={
                        isFiltered
                          ? "No se encontraron incidentes con estos filtros"
                          : "Sin incidentes reportados"
                      }
                      description={
                        isFiltered
                          ? "Intenta ajustar los términos de búsqueda o los filtros de severidad y estado."
                          : "Todo marcha en orden. Cuando ocurra una novedad operativa, regístrala aquí para darle trazabilidad."
                      }
                      action={
                        isFiltered && onResetFilters
                          ? {
                              label: "Limpiar filtros",
                              onClick: onResetFilters,
                            }
                          : onEmptyAction
                            ? {
                                label: "+ Reportar incidente",
                                onClick: onEmptyAction,
                              }
                            : undefined
                      }
                      secondaryAction={
                        isFiltered && onResetFilters && onEmptyAction
                          ? {
                              label: "+ Reportar incidente",
                              onClick: onEmptyAction,
                            }
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                incidents.map((r) => {
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
                            aria-label={`Seleccionar incidente ${r.titulo}`}
                            className="rounded border-[#262D3D] bg-[#111318] text-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED] focus:outline-none cursor-pointer w-4 h-4"
                          />
                        </td>
                      )}
                      {/* Incidente */}
                      <td className="py-3.5 px-4 font-medium text-[#F1F5F9]">
                        <div>
                          <p className="font-semibold text-[#F1F5F9] leading-snug">
                            {r.titulo}
                          </p>
                          <p className="text-[11px] text-[#94A3B8] mt-0.5">
                            {r.evento} · <span className="text-[#A78BFA] font-medium">{TIPO_INCIDENTE_LABELS[r.tipo_incidente] || r.tipo_incidente}</span>
                          </p>
                        </div>
                      </td>

                      {/* Informante */}
                      <td className="py-3.5 px-4 font-medium text-[#F1F5F9]">
                        {r.reporta}
                      </td>

                      {/* Fecha */}
                      <td className="py-3.5 px-4 font-medium text-[#94A3B8] tabular-nums">
                        {r.fecha}
                      </td>

                      {/* Criticidad */}
                      <td className="py-3.5 px-4 font-medium text-[#F1F5F9]">
                        <StatusBadge status={r.criticidad} />
                      </td>

                      {/* Estado */}
                      <td className="py-3.5 px-4">
                        <TableStatusSelect
                          currentStatus={r.estado}
                          options={[
                            "Reportado",
                            "En Atención",
                            "Solucionado",
                            "Escalado",
                          ]}
                          onStatusChange={(newStatus) =>
                            onStatusChange(r.id, newStatus as EstadoIncidente)
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
                            aria-label={`Ver detalles de incidente ${r.codigo}`}
                            className="p-2 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>
                          {handleEdit && (
                            <button
                              type="button"
                              onClick={() => handleEdit(r)}
                              title="Editar incidente"
                              aria-label={`Editar incidente ${r.codigo}`}
                              className="p-2 text-[#94A3B8] hover:text-[#60A5FA] hover:bg-[#3B82F6]/20 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit2 size={16} />
                            </button>
                          )}
                          <span
                            aria-hidden="true"
                            className="w-px h-5 bg-[#262D3D] mx-1"
                          />
                          <button
                            type="button"
                            onClick={() => onDelete(r)}
                            title="Eliminar incidente"
                            aria-label={`Eliminar incidente ${r.codigo}`}
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
        itemLabel="incidentes"
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
      />
    </div>
  )
}
