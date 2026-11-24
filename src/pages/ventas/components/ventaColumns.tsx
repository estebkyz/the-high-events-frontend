import { StatusBadge } from "@/components/StatusBadge"
import { TableStatusSelect } from "@/components/TableStatusSelect"
import { CELL, TitleCell } from "@/components/list/cells"
import type { Column } from "@/components/list/DataTable"
import { ESTADOS_VENTA } from "../constants"
import type { EstadoVenta, VentaItem } from "../types"

/** El pago es derivado: cambia al registrar transacciones en Abonos. */
export function getVentaColumns(
  onStatusChange: (id: string, estado: EstadoVenta) => unknown,
): Column<VentaItem>[] {
  return [
    {
      id: "venta",
      header: "Venta",
      mobile: "title",
      cell: (v) => <TitleCell title={v.clienteEvento} subtitle={v.numero_factura} />,
    },
    { id: "codigo", header: "Código", className: CELL.code, cell: (v) => v.codigo },
    { id: "tipo", header: "Tipo", cell: (v) => v.tipo },
    { id: "fecha", header: "Fecha", className: CELL.muted, cell: (v) => v.fecha },
    {
      id: "total",
      header: "Total",
      mobile: "primary",
      className: CELL.money,
      cell: (v) => v.total,
    },
    { id: "pago", header: "Pago", cell: (v) => <StatusBadge status={v.estadoPago} /> },
    {
      id: "estado",
      header: "Estado",
      mobile: "badge",
      cell: (v) => (
        <TableStatusSelect
          status={v.estado_venta}
          options={ESTADOS_VENTA}
          onChange={(estado) => onStatusChange(v.id, estado)}
          ariaLabel={`Estado de ${v.codigo}`}
        />
      ),
    },
  ]
}
