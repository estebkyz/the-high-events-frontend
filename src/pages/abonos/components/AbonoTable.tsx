import React from "react"
import { Pagination } from "../../../components/Pagination"
import {
  Eye,
  Edit2,
  Trash2,
  Banknote,
  Calendar,
  CreditCard,
} from "lucide-react"
import type { AbonoItem, TipoAbonoTab } from "../types"
import { EmptyState } from "../../../components/EmptyState"
import { StatusBadge } from "../../../components/StatusBadge"
import { MobileResourceCard } from "../../../components/MobileResourceCard"

export interface AbonoTableProps {
  abonos: AbonoItem[]
  activeTab?: TipoAbonoTab
  totalCount: number
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
  onView: (abono: AbonoItem) => void
  onEdit: (abono: AbonoItem) => void
  onDelete?: (abono: AbonoItem) => void
  onRegistrarAbono?: (abono: AbonoItem) => void
  onGenerarRecibo?: (abono: AbonoItem) => void
}

export const AbonoTable: React.FC<AbonoTableProps> = ({
  abonos,
  activeTab = "Clientes",
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
  onView,
  onEdit,
  onDelete,
  onRegistrarAbono,
  onGenerarRecibo,
}) => {
  const handleView = onView
  const handleEdit = onEdit

  const isClientes = activeTab === "Clientes"
  const allSelected =
    abonos.length > 0 && abonos.every((a) => selectedIds.includes(a.id))

  return (
    <div className="space-y-4">
      {/* ── Mobile View: Stacked Resource Cards (Shopify Polaris Pattern) ── */}
      <div className="sm:hidden space-y-3">
        {abonos.length === 0 ? (
          <EmptyState
            icon={Banknote}
            title={
              isFiltered
                ? "No se encontraron abonos con estos filtros"
                : isClientes
                ? "No hay abonos de clientes registrados"
                : "No hay pagos a proveedores registrados"
            }
            description={
              isFiltered
                ? "Prueba cambiando el rango de fechas, método de pago o estado."
                : isClientes
                ? "Registra los anticipos y pagos que tus clientes realizan para sus eventos."
                : "Registra los anticipos y pagos que realizas a tus proveedores contratados."
            }
            action={
              isFiltered && onResetFilters
                ? { label: "Limpiar filtros", onClick: onResetFilters }
                : onEmptyAction
                ? {
                    label: isClientes
                      ? "+ Registrar primer abono"
                      : "+ Registrar primer pago",
                    onClick: onEmptyAction,
                  }
                : undefined
            }
            secondaryAction={
              isFiltered && onResetFilters && onEmptyAction
                ? {
                    label: isClientes
                      ? "+ Registrar abono"
                      : "+ Registrar pago",
                    onClick: onEmptyAction,
                  }
                : undefined
            }
          />
        ) : (
          abonos.map((r) => {
            const isChecked = selectedIds.includes(r.id)
            const badgeLabel =
              r.estadoAnticipo === "Pagado" && r.estadoSaldo === "Pagado"
                ? isClientes
                  ? "Completado"
                  : "Liquidado"
                : r.estadoAnticipo === "Pagado"
                ? "Pendiente"
                : isClientes
                ? "Por Cobrar"
                : "Por Desembolsar"
            const badgeColor =
              r.estadoAnticipo === "Pagado" && r.estadoSaldo === "Pagado"
                ? "bg-[#10B981]/15 text-[#34D399]"
                : r.estadoAnticipo === "Pagado"
                ? "bg-[#F59E0B]/15 text-[#FBBF24]"
                : "bg-[#EF4444]/15 text-[#FB7185]"

            return (
              <MobileResourceCard
                key={r.id}
                id={r.id}
                isSelected={isChecked}
                onToggleSelect={onToggleSelect}
                onClick={handleView ? () => handleView(r) : undefined}
                title={isClientes ? r.evento : r.servicio || r.evento}
                subtitle={
                  isClientes
                    ? r.cliente || "Sin cliente"
                    : `${r.proveedor || "Sin proveedor"} · ${r.evento}`
                }
                badge={
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${badgeColor}`}
                  >
                    {badgeLabel}
                  </span>
                }
                primaryValue={r.total}
                attributes={[
                  {
                    label: "Anticipo",
                    value: `${r.anticipo} (${r.estadoAnticipo})`,
                  },
                  {
                    label: "Saldo",
                    value: `${r.saldo} (${r.estadoSaldo})`,
                  },
                  { label: "Fecha pago", value: r.fechaPago, icon: Calendar },
                  { label: "Cartera", value: r.tipoCartera, icon: CreditCard },
                ]}
                actions={
                  <div className="flex items-center gap-1">
                    {onRegistrarAbono && (
                      <button
                        type="button"
                        onClick={() => onRegistrarAbono(r)}
                        aria-label={`Registrar abono para ${r.evento}`}
                        className="p-1.5 text-[#94A3B8] hover:text-[#10B981] hover:bg-[#10B981]/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <Banknote size={15} />
                      </button>
                    )}
                    {handleView && (
                      <button
                        type="button"
                        onClick={() => handleView(r)}
                        aria-label={`Ver abono de ${r.evento}`}
                        className="p-1.5 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye size={15} />
                      </button>
                    )}
                    {handleEdit && (
                      <button
                        type="button"
                        onClick={() => handleEdit(r)}
                        aria-label={`Editar abono de ${r.evento}`}
                        className="p-1.5 text-[#94A3B8] hover:text-[#60A5FA] hover:bg-[#3B82F6]/20 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <>
                        <span aria-hidden="true" className="w-px h-4 bg-[#262D3D] mx-0.5" />
                        <button
                          type="button"
                          onClick={() => onDelete(r)}
                          aria-label={`Eliminar abono de ${r.evento}`}
                          className="p-1.5 text-[#94A3B8] hover:text-[#F87171] hover:bg-[#EF4444]/20 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
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
                      aria-label="Seleccionar todos los abonos de la página"
                      className="rounded border-[#262D3D] bg-[#111318] text-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED] focus:outline-none cursor-pointer w-4 h-4"
                    />
                  </th>
                )}
                <th scope="col" className="py-3 px-4">
                  {isClientes ? "Evento" : "Servicio"}
                </th>
                <th scope="col" className="py-3 px-4 text-center">Anticipo</th>
                <th scope="col" className="py-3 px-4 text-center">Saldo</th>
                <th scope="col" className="py-3 px-4 text-center">Total</th>
                <th scope="col" className="py-3 px-4 text-center">Estado</th>
                <th scope="col" className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262D3D]/50">
              {abonos.length === 0 ? (
                <tr>
                  <td colSpan={onToggleSelect ? 7 : 6} className="py-6">
                    <EmptyState
                      icon={Banknote}
                      title={
                        isFiltered
                          ? "No se encontraron registros con estos filtros"
                          : `No hay cartera de ${
                              isClientes ? "clientes" : "proveedores"
                            }`
                      }
                      description={
                        isFiltered
                          ? "Intenta ajustar los criterios de búsqueda o el estado de pago seleccionado."
                          : `Gestiona el anticipo del 50% y el saldo final para ${
                              isClientes
                                ? "clientes de eventos"
                                : "proveedores contratados"
                            }.`
                      }
                      action={
                        isFiltered && onResetFilters
                          ? {
                              label: "Limpiar filtros",
                              onClick: onResetFilters,
                            }
                          : onEmptyAction
                            ? {
                                label: isClientes
                                  ? "+ Registrar abono"
                                  : "+ Registrar contrato",
                                onClick: onEmptyAction,
                              }
                            : undefined
                      }
                      secondaryAction={
                        isFiltered && onResetFilters && onEmptyAction
                          ? {
                              label: isClientes
                                ? "+ Registrar abono"
                                : "+ Registrar contrato",
                              onClick: onEmptyAction,
                            }
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                abonos.map((r) => {
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
                            aria-label={`Seleccionar cartera ${r.evento}`}
                            className="rounded border-[#262D3D] bg-[#111318] text-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED] focus:outline-none cursor-pointer w-4 h-4"
                          />
                        </td>
                      )}
                      {/* Evento + Cliente / Proveedor */}
                      <td className="py-3.5 px-4 font-medium text-[#F1F5F9]">
                        <div>
                          <p className="font-medium text-[#F1F5F9] leading-snug">
                            {isClientes ? r.evento : r.servicio || r.evento}
                          </p>
                          <div className="text-[11px] text-[#94A3B8] mt-0.5 flex items-center gap-1.5 flex-wrap">
                            {isClientes ? (
                              <span className="text-[#CBD5E1]">
                                {r.cliente || "No asignado"}
                              </span>
                            ) : (
                              <>
                                <span className="text-[#CBD5E1]">
                                  {r.proveedor || r.cliente || "No asignado"}
                                </span>
                                <span className="text-[#475569]">·</span>
                                <span className="text-[#CBD5E1]">
                                  {r.evento}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Anticipo */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="font-medium text-[#F1F5F9] tabular-nums">
                          {r.anticipo}
                        </div>
                        {r.estadoAnticipo === "Pagado" ? (
                          <div className="text-[11px] text-[#F1F5F9] font-medium mt-0.5">
                            {r.fechaAnticipo || "Pagado"}
                          </div>
                        ) : (
                          <div className="text-[11px] text-[#F1F5F9] font-medium mt-0.5">
                            Sin anticipo
                          </div>
                        )}
                      </td>

                      {/* Saldo (50%) */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="font-medium text-[#F1F5F9] tabular-nums">
                          {r.saldo}
                        </div>
                        {r.estadoSaldo === "Pagado" ? (
                          <div className="text-[11px] text-[#F1F5F9] font-medium mt-0.5">
                            {r.fechaSaldo || "Pagado"}
                          </div>
                        ) : (
                          <div className="text-[11px] text-[#F1F5F9] font-medium mt-0.5">
                            Pendiente
                          </div>
                        )}
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 text-center font-medium text-[#F1F5F9] tabular-nums">
                        <span className="font-medium ">{r.total}</span>
                      </td>

                      {/* Estado Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {r.estadoAnticipo === "Pagado" &&
                        r.estadoSaldo === "Pagado" ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#10B981]/15 text-[#34D399]">
                            {isClientes ? "Completado" : "Liquidado"}
                          </span>
                        ) : r.estadoAnticipo === "Pagado" ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F59E0B]/15 text-[#FBBF24]">
                            Pendiente
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EF4444]/15 text-[#FB7185]">
                            {isClientes ? "Por Cobrar" : "Por Desembolsar"}
                          </span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          {onRegistrarAbono && (
                            <button
                              type="button"
                              onClick={() => onRegistrarAbono(r)}
                              title={
                                isClientes
                                  ? "Registrar abono"
                                  : "Registrar pago"
                              }
                              aria-label={`Registrar abono para ${r.evento}`}
                              className="p-2 text-[#94A3B8] hover:text-[#10B981] hover:bg-[#10B981]/20 rounded-lg transition-colors cursor-pointer"
                            >
                              <Banknote size={16} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleView(r)}
                            title="Ver detalles"
                            aria-label={`Ver detalles de ${r.evento}`}
                            className="p-2 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEdit(r)}
                            title="Editar registro"
                            aria-label={`Editar ${r.evento}`}
                            className="p-2 text-[#94A3B8] hover:text-[#60A5FA] hover:bg-[#3B82F6]/20 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 size={16} />
                          </button>
                          {onDelete && (
                            <>
                              <span
                                aria-hidden="true"
                                className="w-px h-5 bg-[#262D3D] mx-1"
                              />
                              <button
                                type="button"
                                onClick={() => onDelete(r)}
                                title="Eliminar registro"
                                aria-label={`Eliminar ${r.evento}`}
                                className="p-2 text-[#94A3B8] hover:text-[#F87171] hover:bg-[#EF4444]/20 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
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
        itemLabel="registros"
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
      />
    </div>
  )
}
