import React from "react"
import { Pagination } from "../../../components/Pagination"
import {
  Eye,
  Edit2,
  Trash2,
  Download,
  Send,
  Calendar,
} from "lucide-react"
import { TableStatusSelect } from "../../../components/TableStatusSelect"
import { StatusBadge } from "../../../components/StatusBadge"
import { EmptyState } from "../../../components/EmptyState"
import { MobileResourceCard } from "../../../components/MobileResourceCard"
import { FileText } from "lucide-react"
import type { CotizacionItem, EstadoCotizacion } from "../types"

export interface CotizacionTableProps {
  quotes: CotizacionItem[]; totalCount: number
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
  onStatusChange: (id: string, newStatus: EstadoCotizacion) => void
  onView: (quote: CotizacionItem) => void
  onEdit: (quote: CotizacionItem) => void
  onDelete: (quote: CotizacionItem) => void
  onSend?: (quote: CotizacionItem) => void
  onDownloadPdf?: (quote: CotizacionItem) => void
}

export const CotizacionTable: React.FC<CotizacionTableProps> = ({
  quotes,
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
  onSend,
  onDownloadPdf,
}) => {
  const handleView = onView
  const handleEdit = onEdit

  const allSelected =
    quotes.length > 0 && quotes.every((q) => selectedIds.includes(q.id))

  return (
    <div className="space-y-4">
      {/* ── Mobile View: Stacked Resource Cards (Shopify Polaris Pattern) ── */}
      <div className="sm:hidden space-y-3">
        {quotes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={
              isFiltered
                ? "No se encontraron cotizaciones"
                : "No hay cotizaciones registradas"
            }
            description={
              isFiltered
                ? "Prueba cambiando el rango de fechas, cliente o estado comercial."
                : "Crea cotizaciones detalladas con servicios y equipos para enviar a tus clientes."
            }
            action={
              isFiltered && onResetFilters
                ? { label: "Limpiar filtros", onClick: onResetFilters }
                : onEmptyAction
                ? { label: "+ Crear primera cotización", onClick: onEmptyAction }
                : undefined
            }
            secondaryAction={
              isFiltered && onResetFilters && onEmptyAction
                ? { label: "+ Crear cotización", onClick: onEmptyAction }
                : undefined
            }
          />
        ) : (
          quotes.map((q) => {
            const isChecked = selectedIds.includes(q.id)
            return (
              <MobileResourceCard
                key={q.id}
                id={q.id}
                isSelected={isChecked}
                onToggleSelect={onToggleSelect}
                onClick={handleView ? () => handleView(q) : undefined}
                title={q.codigo}
                subtitle={q.cliente}
                badge={<StatusBadge status={q.estado} />}
                primaryValue={q.total}
                attributes={[
                  { label: "Fecha", value: q.fecha, icon: Calendar },
                  {
                    label: "Vence",
                    value: q.fechaVence || "No definida",
                    icon: Calendar,
                  },
                ]}
                actions={
                  <div className="flex items-center gap-1">
                    {onSend && (
                      <button
                        type="button"
                        onClick={() => onSend(q)}
                        aria-label={`Enviar cotización ${q.codigo}`}
                        className="p-1.5 text-[#94A3B8] hover:text-[#3B82F6] hover:bg-[#3B82F6]/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <Send size={15} />
                      </button>
                    )}
                    {onDownloadPdf && (
                      <button
                        type="button"
                        onClick={() => onDownloadPdf(q)}
                        aria-label={`Descargar PDF ${q.codigo}`}
                        className="p-1.5 text-[#94A3B8] hover:text-[#10B981] hover:bg-[#10B981]/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <Download size={15} />
                      </button>
                    )}
                    {handleView && (
                      <button
                        type="button"
                        onClick={() => handleView(q)}
                        aria-label={`Ver ${q.codigo}`}
                        className="p-1.5 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye size={15} />
                      </button>
                    )}
                    {handleEdit && (
                      <button
                        type="button"
                        onClick={() => handleEdit(q)}
                        aria-label={`Editar ${q.codigo}`}
                        className="p-1.5 text-[#94A3B8] hover:text-[#60A5FA] hover:bg-[#3B82F6]/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    <span aria-hidden="true" className="w-px h-4 bg-[#262D3D] mx-0.5" />
                    <button
                      type="button"
                      onClick={() => onDelete(q)}
                      aria-label={`Eliminar ${q.codigo}`}
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
                      aria-label="Seleccionar todas las cotizaciones de la página"
                      className="rounded border-[#262D3D] bg-[#111318] text-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED] focus:outline-none cursor-pointer w-4 h-4"
                    />
                  </th>
                )}
                <th scope="col" className="py-3 px-4">Cliente</th>
                <th scope="col" className="py-3 px-4">Servicios</th>
                <th scope="col" className="py-3 px-4">Emisión</th>
                <th scope="col" className="py-3 px-4">Estado</th>
                <th scope="col" className="py-3 px-4">Total</th>
                <th scope="col" className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262D3D]/50">
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={onToggleSelect ? 7 : 6} className="py-6">
                    <EmptyState
                      icon={FileText}
                      title={
                        isFiltered
                          ? "No se encontraron cotizaciones"
                          : "Aún no tienes cotizaciones"
                      }
                      description={
                        isFiltered
                          ? "Prueba modificando la búsqueda o el estado seleccionado en las pestañas."
                          : "Crea propuestas y presupuestos comerciales para clientes potenciales y eventos."
                      }
                      action={
                        isFiltered && onResetFilters
                          ? {
                              label: "Limpiar filtros",
                              onClick: onResetFilters,
                            }
                          : onEmptyAction
                            ? {
                                label: "+ Crear primera cotización",
                                onClick: onEmptyAction,
                              }
                            : undefined
                      }
                      secondaryAction={
                        isFiltered && onResetFilters && onEmptyAction
                          ? {
                              label: "+ Crear cotización",
                              onClick: onEmptyAction,
                            }
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                quotes.map((q) => {
                  const isChecked = selectedIds.includes(q.id)
                  return (
                    <tr
                      key={q.id}
                      className={`hover:bg-[#222734]/40 transition-colors group ${
                        isChecked ? "bg-[#7C3AED]/10" : ""
                      }`}
                    >
                      {onToggleSelect && (
                        <td className="py-3.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onToggleSelect(q.id)}
                            aria-label={`Seleccionar cotización ${q.cliente}`}
                            className="rounded border-[#262D3D] bg-[#111318] text-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED] focus:outline-none cursor-pointer w-4 h-4"
                          />
                        </td>
                      )}
                      {/* Cliente */}
                      <td className="py-3.5 px-4 font-medium text-[#F1F5F9]">
                        {q.cliente}
                      </td>

                      {/* Servicios */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[220px]">
                          {q.servicios.slice(0, 2).map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#7C3AED]/15 text-[#A78BFA]"
                            >
                              {s}
                            </span>
                          ))}
                          {q.servicios.length > 2 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#222734] text-[#64748B]">
                              +{q.servicios.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Emisión */}
                      <td className="py-3.5 px-4 font-medium text-[#94A3B8] tabular-nums">
                        {q.fecha}
                      </td>

                      {/* Estado */}
                      <td className="py-3.5 px-4">
                        <TableStatusSelect
                          currentStatus={q.estado}
                          options={[
                            "Borrador",
                            "Enviada",
                            "Aceptada",
                            "Rechazada",
                            "Vencida",
                          ]}
                          onStatusChange={(newEst) =>
                            onStatusChange(q.id, newEst as EstadoCotizacion)
                          }
                        />
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 font-semibold text-[#F1F5F9] tabular-nums">
                        {q.total}
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          {onDownloadPdf && (
                            <button
                              type="button"
                              onClick={() => onDownloadPdf(q)}
                              title="Descargar PDF"
                              aria-label={`Descargar PDF de cotización ${q.codigo}`}
                              className="p-2 text-[#94A3B8] hover:text-[#10B981] hover:bg-[#10B981]/20 rounded-lg transition-colors cursor-pointer"
                            >
                              <Download size={16} />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleView(q)}
                            title="Ver detalles"
                            aria-label={`Ver detalles de ${q.codigo}`}
                            className="p-2 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEdit(q)}
                            title="Editar cotización"
                            aria-label={`Editar ${q.codigo}`}
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
                            onClick={() => onDelete(q)}
                            title="Eliminar cotización"
                            aria-label={`Eliminar ${q.codigo}`}
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
        itemLabel="cotizaciones"
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
      />
    </div>
  )
}
