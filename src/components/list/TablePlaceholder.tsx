import { AlertTriangle } from "lucide-react"
import { EmptyState } from "@/components/EmptyState"
import type { DataTableProps } from "./DataTable"
import { TableSkeleton } from "./TableSkeleton"

/** Cargando · error con reintento · sin resultados · sin registros. */
export function TablePlaceholder<T extends { id: string }>({
  columns,
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
    return <TableSkeleton columns={columns} itemLabel={itemLabel} />
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
