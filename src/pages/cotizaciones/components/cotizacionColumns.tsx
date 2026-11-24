import { TableStatusSelect } from "@/components/TableStatusSelect"
import { CELL, TagsCell, TitleCell } from "@/components/list/cells"
import type { Column } from "@/components/list/DataTable"
import { ESTADOS_COTIZACION } from "../constants"
import type { CotizacionItem, EstadoCotizacion } from "../types"

export function getCotizacionColumns(
  onStatusChange: (id: string, estado: EstadoCotizacion) => unknown,
): Column<CotizacionItem>[] {
  return [
    {
      id: "cliente",
      header: "Cliente",
      mobile: "title",
      cell: (c) => <TitleCell title={c.cliente} subtitle={c.nombre_evento} />,
    },
    { id: "codigo", header: "Código", className: CELL.code, cell: (c) => c.codigo },
    {
      id: "servicios",
      header: "Servicios",
      cell: (c) => <TagsCell tags={c.servicios ?? []} />,
    },
    { id: "emision", header: "Emisión", className: CELL.muted, cell: (c) => c.fecha },
    {
      id: "total",
      header: "Total",
      mobile: "primary",
      className: CELL.money,
      cell: (c) => c.total,
    },
    {
      id: "estado",
      header: "Estado",
      mobile: "badge",
      cell: (c) => (
        <TableStatusSelect
          status={c.estado}
          options={ESTADOS_COTIZACION}
          onChange={(estado) => onStatusChange(c.id, estado)}
          ariaLabel={`Estado de ${c.codigo}`}
        />
      ),
    },
  ]
}
