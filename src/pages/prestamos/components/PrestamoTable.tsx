import React, { useState } from "react"
import { Pagination } from "../../../components/Pagination"
import {
  Eye,
  Edit2,
  Trash2,
  RotateCcw,
  Repeat,
} from "lucide-react"
import { TableStatusSelect } from "../../../components/TableStatusSelect"
import { EmptyState } from "../../../components/EmptyState"
import { ESTADO_OPTIONS } from "../data"
import type { PrestamoItem, PrestamoEstado, EquipoPrestado } from "../types"

function EquiposPrestadosCell({
  codigo,
  equipos,
  expanded,
  onToggle,
}: {
  codigo: string
  equipos: EquipoPrestado[]
  expanded: boolean
  onToggle: () => void
}) {
  if (equipos.length === 0) {
    return <span className="text-[11px] text-[#94A3B8]">Sin equipos asignados</span>
  }

  const visibles = expanded ? equipos : equipos.slice(0, 1)
  const ocultos = expanded ? 0 : Math.max(equipos.length - 1, 0)
  const colapsable = equipos.length > 1

  return (
    <div className="flex flex-col gap-1 max-w-[280px]">
      <div className="flex flex-wrap items-center gap-1">
        {visibles.map((eq) => (
          <span
            key={eq.id}
            title={`Equipo prestado: ${eq.nombre}${eq.serie ? ` (${eq.serie})` : ""}`}
            className="inline-flex items-center gap-1 max-w-full px-1.5 py-0.5 rounded text-[11px] font-medium bg-[#3B82F6]/15 text-[#93C5FD]"
          >
            <span className="truncate">{eq.nombre}</span>
          </span>
        ))}
        {ocultos > 0 && (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={false}
            aria-label={`Ver ${ocultos} más en el préstamo ${codigo}`}
            className="px-1.5 py-0.5 rounded text-[11px] font-semibold text-[#CBD5E1] bg-[#222734] hover:bg-[#2D3748] hover:text-white transition-colors cursor-pointer"
          >
            +{ocultos}
          </button>
        )}
      </div>
      {expanded && colapsable && (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={true}
          className="self-start text-[11px] font-semibold text-[#A78BFA] hover:text-[#C4B5FD] cursor-pointer rounded px-0.5"
        >
          Ver menos
        </button>
      )}
    </div>
  )
}

export interface PrestamoTableProps {
  prestamos: PrestamoItem[]
  totalCount: number
  pageSize: number
  currentPage: number
  totalPages: number
  onPageSizeChange: (newSize: number) => void
  onPageChange: (newPage: number) => void
  onStatusChange: (id: string, newStatus: PrestamoEstado) => void
  onView: (prestamo: PrestamoItem) => void
  onEdit: (prestamo: PrestamoItem) => void
  onDelete: (prestamo: PrestamoItem) => void
  onOpenReturn?: (prestamo: PrestamoItem) => void
  onEmptyAction?: () => void
  onResetFilters?: () => void
  isFiltered?: boolean
}

export const PrestamoTable: React.FC<PrestamoTableProps> = ({
  prestamos,
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
  onOpenReturn,
  onEmptyAction,
  onResetFilters,
  isFiltered = false,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div className="space-y-4">
      <div className="bg-[#181B22] border border-[#262D3D] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-[#262D3D] text-xs font-medium text-[#94A3B8] bg-[#111318]">
                <th scope="col" className="py-3 px-4">Responsable</th>
                <th scope="col" className="py-3 px-4">Evento</th>
                <th scope="col" className="py-3 px-4">Equipos</th>
                <th scope="col" className="py-3 px-4">Salida</th>
                <th scope="col" className="py-3 px-4">Devolución</th>
                <th scope="col" className="py-3 px-4">Estado</th>
                <th scope="col" className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262D3D]/50">
              {prestamos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6">
                    <EmptyState
                      icon={Repeat}
                      title={
                        isFiltered
                          ? "No se encontraron préstamos coincidentes"
                          : "Aún no tienes préstamos de equipos registrados"
                      }
                      description={
                        isFiltered
                          ? "Intenta ajustar los criterios de búsqueda o el filtro de estado."
                          : "Registra la salida y préstamo de equipos propios a responsables y eventos."
                      }
                      action={
                        isFiltered && onResetFilters
                          ? { label: "Limpiar filtros", onClick: onResetFilters }
                          : onEmptyAction
                            ? {
                                label: "+ Registrar primer préstamo",
                                onClick: onEmptyAction,
                              }
                            : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                prestamos.map((r) => {
                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-[#222734]/40 transition-colors group"
                    >
                      {/* Código y Responsable */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] font-bold text-[#A78BFA] block">
                          {r.codigo}
                        </span>
                        <span className="font-semibold text-[#F1F5F9]">
                          {r.responsable}
                        </span>
                      </td>

                      {/* Evento */}
                      <td className="py-3.5 px-4 font-medium text-[#CBD5E1]">
                        {r.evento}
                      </td>

                      {/* Equipos Prestados con badges estilo Catálogo de Proveedores */}
                      <td className="py-3.5 px-4">
                        <EquiposPrestadosCell
                          codigo={r.codigo}
                          equipos={r.equipos}
                          expanded={expandedIds.has(r.id)}
                          onToggle={() => toggleExpanded(r.id)}
                        />
                      </td>

                      {/* Salida */}
                      <td className="py-3.5 px-4 text-[#94A3B8] tabular-nums">
                        {r.fechaSalida}
                      </td>

                      {/* Devolución */}
                      <td className="py-3.5 px-4 text-[#94A3B8] tabular-nums">
                        {r.fechaDevolucion}
                      </td>

                      {/* Estado */}
                      <td className="py-3.5 px-4">
                        <TableStatusSelect
                          currentStatus={r.estado}
                          options={ESTADO_OPTIONS}
                          onStatusChange={(newEstado) =>
                            onStatusChange(r.id, newEstado as PrestamoEstado)
                          }
                        />
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          {onOpenReturn && r.estado === "Activo" && (
                            <button
                              type="button"
                              onClick={() => onOpenReturn(r)}
                              title="Registrar devolución de equipos"
                              className="p-2 text-[#34D399] hover:bg-[#10B981]/20 rounded-lg transition-colors cursor-pointer"
                            >
                              <RotateCcw size={16} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onView(r)}
                            title="Ver detalles de equipos prestados"
                            aria-label={`Ver detalles de ${r.responsable}`}
                            className="p-2 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEdit(r)}
                            title="Editar préstamo"
                            aria-label={`Editar préstamo ${r.responsable}`}
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
                            title="Eliminar préstamo"
                            aria-label={`Eliminar préstamo ${r.responsable}`}
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
        itemLabel="préstamos"
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
      />
    </div>
  )
}
