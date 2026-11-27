import { TableStatusSelect } from "@/components/TableStatusSelect"
import { CELL, TitleCell } from "@/components/list/cells"
import type { Column } from "@/components/list/DataTable"
import { estadosDisponibles, getOrigen } from "../form"
import type { EstadoRecepcion, Recepcion } from "../types"

export function getRecepcionColumns(
  onStatusChange: (id: string, estado: EstadoRecepcion) => unknown,
): Column<Recepcion>[] {
  return [
    {
      id: "recepcion",
      header: "Recepción",
      mobile: "title",
      cell: (r) => (
        <TitleCell title={r.evento} subtitle={`Responsable: ${r.responsable}`} />
      ),
    },
    { id: "codigo", header: "Código", className: CELL.code, cell: (r) => r.codigo },
    { id: "proveedor", header: "Origen", cell: getOrigen },
    { id: "tipo", header: "Tipo", cell: (r) => r.tipo },
    { id: "fecha", header: "Fecha", className: CELL.muted, cell: (r) => r.fecha },
    {
      id: "estado",
      header: "Estado",
      mobile: "badge",
      cell: (r) => (
        <TableStatusSelect
          status={r.estado}
          options={estadosDisponibles(r)}
          onChange={(estado) => onStatusChange(r.id, estado)}
          ariaLabel={`Estado de ${r.codigo}`}
        />
      ),
    },
  ]
}
