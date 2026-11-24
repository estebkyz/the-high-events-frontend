import { TableStatusSelect } from "@/components/TableStatusSelect"
import { CELL, TagsCell, TitleCell } from "@/components/list/cells"
import type { Column } from "@/components/list/DataTable"
import { ESTADOS_PRESTAMO } from "../constants"
import type { PrestamoEstado, PrestamoItem } from "../types"

export function getPrestamoColumns(
  onStatusChange: (id: string, estado: PrestamoEstado) => unknown,
): Column<PrestamoItem>[] {
  return [
    {
      id: "responsable",
      header: "Responsable",
      mobile: "title",
      cell: (p) => <TitleCell title={p.responsable} subtitle={p.evento} />,
    },
    { id: "codigo", header: "Código", className: CELL.code, cell: (p) => p.codigo },
    {
      id: "equipos",
      header: "Equipos",
      cell: (p) => <TagsCell tags={p.equipos.map((eq) => eq.nombre)} />,
    },
    {
      id: "salida",
      header: "Salida",
      className: CELL.muted,
      cell: (p) => p.fechaSalida,
    },
    {
      id: "devolucion",
      header: "Devolución",
      className: CELL.muted,
      cell: (p) => p.fecha_devolucion_real ?? p.fechaDevolucion,
    },
    {
      id: "estado",
      header: "Estado",
      mobile: "badge",
      cell: (p) => (
        <TableStatusSelect
          status={p.estado}
          options={ESTADOS_PRESTAMO}
          onChange={(estado) => onStatusChange(p.id, estado)}
          ariaLabel={`Estado de ${p.codigo}`}
        />
      ),
    },
  ]
}
