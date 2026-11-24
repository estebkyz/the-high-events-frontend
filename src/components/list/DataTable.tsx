import type { ReactNode } from "react"
import { AlertTriangle, type LucideIcon } from "lucide-react"
import { EmptyState } from "@/components/EmptyState"
import { MobileResourceCard } from "@/components/MobileResourceCard"
import { Pagination } from "@/components/Pagination"
import { RowActions, type RowAction } from "@/components/list/RowActions"
import { usePagination } from "@/hooks/usePagination"
import type { Selection } from "@/hooks/useSelection"

export interface Column<T> {
  id: string
  header: string
  cell: (item: T) => ReactNode
  align?: "left" | "right" | "center"
  className?: string
  /** Lugar en la tarjeta móvil (por defecto, atributo con su etiqueta). */
  mobile?: "title" | "badge" | "primary" | "hidden"
}

export interface EmptyCopy {
  icon: LucideIcon
  title: string
  description: string
  /** Texto del botón de creación, p. ej. "Crear cliente". */
  createLabel?: string
}

export interface DataTableProps<T extends { id: string }> {
  /** Plural en minúscula: nombre accesible y pie de paginación. */
  itemLabel: string
  columns: Column<T>[]
  /** Registros ya filtrados; la tabla pagina por su cuenta. */
  data: T[]
  getName: (item: T) => string
  empty: EmptyCopy
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  isFiltered?: boolean
  onResetFilters?: () => void
  onCreate?: () => void
  /** `filters.resetKey`: al cambiar vuelve a la página 1. */
  resetKey?: string
  selection?: Selection
  onView?: (item: T) => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  extraActions?: RowAction<T>[]
}

const ALIGN = { left: "text-left", right: "text-right", center: "text-center" }
const CHECKBOX =
  "rounded border-[#262D3D] bg-[#111318] text-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED] focus:outline-none cursor-pointer w-4 h-4"

/** Tabla única del sistema: escritorio, tarjetas móviles, estados y paginación. */
export function DataTable<T extends { id: string }>(props: DataTableProps<T>) {
  const { columns, data, getName, itemLabel, selection, resetKey } = props
  const { onView, onEdit, onDelete, extraActions } = props
  const pagination = usePagination(data, resetKey)
  const rows = pagination.paginatedData
  const rowIds = rows.map((row) => row.id)
  const hasActions = Boolean(onView || onEdit || onDelete || extraActions?.length)

  const renderActions = (item: T) =>
    hasActions ? (
      <RowActions
        item={item}
        itemName={getName(item)}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        extra={extraActions}
      />
    ) : undefined

  if (rows.length === 0) {
    return (
      <div className="bg-[#181B22] border border-[#262D3D] rounded-2xl py-6">
        <TablePlaceholder {...props} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="sm:hidden space-y-3">
        {rows.map((item) => (
          <MobileRow
            key={item.id}
            item={item}
            columns={columns}
            name={getName(item)}
            selection={selection}
            onView={onView}
            actions={renderActions(item)}
          />
        ))}
      </div>

      <div className="hidden sm:block bg-[#181B22] border border-[#262D3D] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table
            aria-label={itemLabel}
            className="w-full text-left text-[13px] border-collapse"
          >
            <thead>
              <tr className="border-b border-[#262D3D] text-xs font-medium text-[#94A3B8] bg-[#111318]">
                {selection && (
                  <th scope="col" className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={rowIds.every((id) => selection.ids.includes(id))}
                      onChange={() => selection.toggleMany(rowIds)}
                      aria-label="Seleccionar todos los registros de la página"
                      className={CHECKBOX}
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.id}
                    scope="col"
                    className={`py-3 px-4 ${ALIGN[col.align ?? "left"]}`}
                  >
                    {col.header}
                  </th>
                ))}
                {hasActions && (
                  <th scope="col" className="py-3 px-4 text-right">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262D3D]/50">
              {rows.map((item) => {
                const isSelected = selection?.ids.includes(item.id) ?? false
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#222734]/40 transition-colors ${
                      isSelected ? "bg-[#7C3AED]/10" : ""
                    }`}
                  >
                    {selection && (
                      <td className="py-3.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => selection.toggle(item.id)}
                          aria-label={`Seleccionar ${getName(item)}`}
                          className={CHECKBOX}
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.id}
                        className={`py-3.5 px-4 ${ALIGN[col.align ?? "left"]} ${col.className ?? "text-[#F1F5F9]"}`}
                      >
                        {col.cell(item)}
                      </td>
                    ))}
                    {hasActions && (
                      <td className="py-3.5 px-4 text-right">{renderActions(item)}</td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        pageSize={pagination.pageSize}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalCount={data.length}
        itemLabel={itemLabel}
        onPageSizeChange={pagination.setPageSize}
        onPageChange={pagination.setCurrentPage}
      />
    </div>
  )
}

/** Cargando · error con reintento · sin resultados · sin registros. */
function TablePlaceholder<T extends { id: string }>({
  itemLabel,
  empty,
  loading,
  error,
  onRetry,
  isFiltered,
  onResetFilters,
  onCreate,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <p role="status" className="py-14 text-center text-xs text-[#94A3B8]">
        Cargando {itemLabel}…
      </p>
    )
  }
  if (error) {
    return (
      <div role="alert">
        <EmptyState
          icon={AlertTriangle}
          title={`No se pudo cargar: ${itemLabel}`}
          description={error}
          action={onRetry && { label: "Reintentar", onClick: onRetry }}
        />
      </div>
    )
  }
  const create =
    onCreate && empty.createLabel
      ? { label: empty.createLabel, onClick: onCreate }
      : undefined
  if (isFiltered) {
    return (
      <EmptyState
        icon={empty.icon}
        title="Sin resultados"
        description={`No hay ${itemLabel} que coincidan con la búsqueda o los filtros.`}
        action={onResetFilters && { label: "Limpiar filtros", onClick: onResetFilters }}
        secondaryAction={create}
      />
    )
  }
  return (
    <EmptyState
      icon={empty.icon}
      title={empty.title}
      description={empty.description}
      action={create}
    />
  )
}

interface MobileRowProps<T extends { id: string }> {
  item: T
  columns: Column<T>[]
  name: string
  selection?: Selection
  onView?: (item: T) => void
  actions?: ReactNode
}

function MobileRow<T extends { id: string }>({
  item,
  columns,
  name,
  selection,
  onView,
  actions,
}: MobileRowProps<T>) {
  const slot = (place: Column<T>["mobile"]) =>
    columns.find((col) => col.mobile === place)?.cell(item)

  return (
    <MobileResourceCard
      id={item.id}
      isSelected={selection?.ids.includes(item.id)}
      onToggleSelect={selection?.toggle}
      onClick={onView && (() => onView(item))}
      title={slot("title") ?? name}
      badge={slot("badge")}
      primaryValue={slot("primary")}
      attributes={columns
        .filter((col) => !col.mobile)
        .map((col) => ({ label: col.header, value: col.cell(item) }))}
      actions={actions}
    />
  )
}
