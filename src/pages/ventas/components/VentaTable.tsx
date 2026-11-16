import React from "react"
import { Pagination } from "../../../components/Pagination"
import {
  Eye,
  Edit2,
  Trash2,
  Download,
  Calendar,
  Tag,
} from "lucide-react"
import { TableStatusSelect } from "../../../components/TableStatusSelect"
import { StatusBadge } from "../../../components/StatusBadge"
import { EmptyState } from "../../../components/EmptyState"
import { MobileResourceCard } from "../../../components/MobileResourceCard"
import { DollarSign } from "lucide-react"
import { ESTADO_PAGO_OPTIONS } from "../data"
import type { VentaItem, EstadoPagoVenta } from "../types"

export interface VentaTableProps {
  sales: VentaItem[]; totalCount: number
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
  onStatusChange: (id: string, newStatus: EstadoPagoVenta) => void
  onView: (sale: VentaItem) => void
  onEdit: (sale: VentaItem) => void
  onDelete: (sale: VentaItem) => void
  onDownloadInvoice?: (sale: VentaItem) => void
}

export const VentaTable: React.FC<VentaTableProps> = ({
  sales,
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
  onDownloadInvoice,
}) => {
  const handleView = onView
  const handleEdit = onEdit

  const allSelected =
    sales.length > 0 && sales.every((s) => selectedIds.includes(s.id))

  return (
    <div className="space-y-4">
      {/* ── Mobile View: Stacked Resource Cards (Shopify Polaris Pattern) ── */}
      <div className="sm:hidden space-y-3">
        {sales.length === 0 ? (
          <EmptyState
            icon={DollarSign}
            title={
              isFiltered
                ? "No se encontraron ventas con estos filtros"
                : "No hay ventas registradas"
            }
            description={
              isFiltered
                ? "Prueba cambiando el rango de fechas, cliente o estado de pago."
                : "Las ventas se generan al confirmar cotizaciones o registrar eventos."
            }
            action={
              isFiltered && onResetFilters
                ? { label: "Limpiar filtros", onClick: onResetFilters }
                : onEmptyAction
                ? { label: "+ Registrar primera venta", onClick: onEmptyAction }
                : undefined
            }
            secondaryAction={
              isFiltered && onResetFilters && onEmptyAction
                ? { label: "+ Registrar venta", onClick: onEmptyAction }
                : undefined
            }
          />
        ) : (
          sales.map((r) => {
            const isChecked = selectedIds.includes(r.id)
            return (
              <MobileResourceCard
                key={r.id}
                id={r.id}
                isSelected={isChecked}
                onToggleSelect={onToggleSelect}
                onClick={handleView ? () => handleView(r) : undefined}
                title={r.codigo}
                subtitle={`${r.clienteEvento}${r.numero_factura ? ` • ${r.numero_factura}` : ""}`}
                badge={<StatusBadge status={r.estadoPago} />}
                primaryValue={r.total}
                attributes={[
                  { label: "Tipo", value: r.tipo, icon: Tag },
                  { label: "Fecha", value: r.fecha, icon: Calendar },
                ]}
                actions={
                  <div className="flex items-center gap-1">
                    {onDownloadInvoice && (
                      <button
                        type="button"
                        onClick={() => onDownloadInvoice(r)}
                        aria-label={`Descargar comprobante ${r.codigo || r.id}`}
                        className="p-1.5 text-[#94A3B8] hover:text-[#10B981] hover:bg-[#10B981]/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <Download size={15} />
                      </button>
                    )}
                    {handleView && (
                      <button
                        type="button"
                        onClick={() => handleView(r)}
                        aria-label={`Ver venta ${r.codigo || r.id}`}
                        className="p-1.5 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye size={15} />
                      </button>
                    )}
                    {handleEdit && (
                      <button
                        type="button"
                        onClick={() => handleEdit(r)}
                        aria-label={`Editar venta ${r.codigo || r.id}`}
                        className="p-1.5 text-[#94A3B8] hover:text-[#60A5FA] hover:bg-[#3B82F6]/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    <span aria-hidden="true" className="w-px h-4 bg-[#262D3D] mx-0.5" />
                    <button
                      type="button"
                      onClick={() => onDelete(r)}
                      aria-label={`Eliminar venta ${r.codigo || r.id}`}
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
                      aria-label="Seleccionar todas las ventas de la página"
                      className="rounded border-[#262D3D] bg-[#111318] text-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED] focus:outline-none cursor-pointer w-4 h-4"
                    />
                  </th>
                )}
                <th scope="col" className="py-3 px-4">Evento</th>
                <th scope="col" className="py-3 px-4">Tipo</th>
                <th scope="col" className="py-3 px-4">Fecha</th>
                <th scope="col" className="py-3 px-4">Estado</th>
                <th scope="col" className="py-3 px-4">Total</th>
                <th scope="col" className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262D3D]/50">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={onToggleSelect ? 7 : 6} className="py-6">
                    <EmptyState
                      icon={DollarSign}
                      title={
                        isFiltered
                          ? "No se encontraron ventas coincidentes"
                          : "Aún no tienes ventas registradas"
                      }
                      description={
                        isFiltered
                          ? "Prueba ajustando los términos de búsqueda o los filtros de tipo y estado de pago."
                          : "Registra comprobantes de venta para clientes o eventos propios para hacer seguimiento comercial."
                      }
                      action={
                        isFiltered && onResetFilters
                          ? {
                              label: "Limpiar filtros",
                              onClick: onResetFilters,
                            }
                          : onEmptyAction
                            ? {
                                label: "+ Registrar primera venta",
                                onClick: onEmptyAction,
                              }
                            : undefined
                      }
                      secondaryAction={
                        isFiltered && onResetFilters && onEmptyAction
                          ? {
                              label: "+ Registrar venta",
                              onClick: onEmptyAction,
                            }
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                sales.map((r) => {
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
                            aria-label={`Seleccionar venta ${r.codigo}`}
                            className="rounded border-[#262D3D] bg-[#111318] text-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED] focus:outline-none cursor-pointer w-4 h-4"
                          />
                        </td>
                      )}
                      {/* Evento */}
                      <td className="py-3.5 px-4 font-medium text-[#F1F5F9]">
                        <p className="font-semibold text-[#F1F5F9] leading-snug">
                          {r.clienteEvento}
                        </p>
                        {r.numero_factura && (
                          <span className="text-[11px] text-[#10B981] font-mono block mt-0.5">
                            {r.numero_factura}
                          </span>
                        )}
                      </td>

                      {/* Tipo */}
                      <td className="py-3.5 px-4 font-medium text-[#F1F5F9]">
                        {r.tipo}
                      </td>

                      {/* Fecha */}
                      <td className="py-3.5 px-4 text-[#94A3B8] tabular-nums">
                        {r.fecha}
                      </td>

                      {/* Estado */}
                      <td className="py-3.5 px-4">
                        <TableStatusSelect
                          currentStatus={r.estadoPago}
                          options={ESTADO_PAGO_OPTIONS}
                          onStatusChange={(newEst) =>
                            onStatusChange(r.id, newEst as EstadoPagoVenta)
                          }
                        />
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 font-semibold text-[#F1F5F9] tabular-nums">
                        {r.total}
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          {onDownloadInvoice && (
                            <button
                              type="button"
                              onClick={() => onDownloadInvoice(r)}
                              title="Descargar Comprobante"
                              aria-label={`Descargar comprobante de venta ${r.codigo || r.id}`}
                              className="p-2 text-[#94A3B8] hover:text-[#10B981] hover:bg-[#10B981]/20 rounded-lg transition-colors cursor-pointer"
                            >
                              <Download size={16} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleView(r)}
                            title="Ver detalles"
                            aria-label={`Ver detalles de venta ${r.codigo || r.id}`}
                            className="p-2 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEdit(r)}
                            title="Editar venta"
                            aria-label={`Editar venta ${r.codigo || r.id}`}
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
                            title="Eliminar venta"
                            aria-label={`Eliminar venta ${r.codigo || r.id}`}
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
        itemLabel="ventas"
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
      />
    </div>
  )
}
