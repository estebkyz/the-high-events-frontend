import type { MouseEvent, ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { MobileResourceCard } from "@/components/MobileResourceCard"
import { Pagination } from "@/components/Pagination"
import { RowActions, type RowAction } from "@/components/list/RowActions"
import { useModuleAccess } from "@/hooks/useAccess"
import { TablePlaceholder } from "@/components/list/TablePlaceholder"
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

/** Clic en la fila abre el registro, salvo sobre un control o al seleccionar texto. */
function openRow(e: MouseEvent, open: () => void) {
  const isControl = (e.target as Element).closest(
    "button, a, input, label, [role=listbox]",
  )
  if (!isControl && !window.getSelection()?.toString()) open()
}

const ALIGN = { left: "text-left", right: "text-right", center: "text-center" }
const CHECKBOX =
  "block mx-auto size-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"

/** Tabla única del sistema: escritorio, tarjetas móviles, estados y paginación. */
export function DataTable<T extends { id: string }>(props: DataTableProps<T>) {
  const { columns, data, getName, itemLabel, resetKey } = props
  const access = useModuleAccess()
  // Sin acciones en lote posibles, la selección sobra.
  const selection =
    access.canRemove || access.canChangeStatus ? props.selection : undefined
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
      <TablePlaceholder
        {...props}
        onCreate={access.canCreate ? props.onCreate : undefined}
      />
    )
  }

  return (
    <>
      <div className="sm:hidden divide-y divide-line-soft">
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

      <div className="hidden sm:block overflow-x-auto">
        <table
          aria-label={itemLabel}
          className="w-full text-left text-[13px] border-collapse"
        >
          <thead>
            <tr className="border-b border-line-soft text-xs text-ink-muted bg-surface-2">
              {selection && (
                <th scope="col" className="py-2 pl-4 pr-1 w-10 text-center">
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
                  className={`py-2 px-3 first:pl-4 font-medium whitespace-nowrap ${ALIGN[col.align ?? "left"]}`}
                >
                  {col.header}
                </th>
              ))}
              {hasActions && (
                <th scope="col" className="py-2 pl-3 pr-4 font-medium text-right">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {rows.map((item) => {
              const isSelected = selection?.ids.includes(item.id) ?? false
              return (
                <tr
                  key={item.id}
                  onClick={onView && ((e) => openRow(e, () => onView(item)))}
                  className={`transition-colors ${onView ? "cursor-pointer" : ""} ${
                    isSelected ? "bg-brand-soft" : "hover:bg-surface-2"
                  }`}
                >
                  {selection && (
                    <td className="py-2.5 pl-4 pr-1 text-center">
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
                      className={`py-2.5 px-3 first:pl-4 ${ALIGN[col.align ?? "left"]} ${col.className ?? "text-ink"}`}
                    >
                      {col.cell(item)}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="py-1.5 pl-3 pr-3 text-right">{renderActions(item)}</td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
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
    </>
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
