import { StatusBadge } from "@/components/StatusBadge"
import { TableStatusSelect } from "@/components/TableStatusSelect"
import { CELL, TitleCell } from "@/components/list/cells"
import type { Column } from "@/components/list/DataTable"
import { ESTADOS_INCIDENTE, TIPO_INCIDENTE_LABELS } from "../constants"
import type { EstadoIncidente, IncidenteItem } from "../types"

export function getIncidenteColumns(
  onStatusChange: (id: string, estado: EstadoIncidente) => unknown,
): Column<IncidenteItem>[] {
  return [
    {
      id: "incidente",
      header: "Incidente",
      mobile: "title",
      cell: (i) => (
        <TitleCell
          title={i.titulo}
          subtitle={`${i.evento} · ${TIPO_INCIDENTE_LABELS[i.tipo_incidente] ?? i.tipo_incidente}`}
        />
      ),
    },
    { id: "codigo", header: "Código", className: CELL.code, cell: (i) => i.codigo },
    { id: "informante", header: "Informante", cell: (i) => i.reporta },
    { id: "fecha", header: "Fecha", className: CELL.muted, cell: (i) => i.fecha },
    {
      id: "criticidad",
      header: "Criticidad",
      cell: (i) => <StatusBadge status={i.criticidad} />,
    },
    {
      id: "estado",
      header: "Estado",
      mobile: "badge",
      cell: (i) => (
        <TableStatusSelect
          status={i.estado}
          options={ESTADOS_INCIDENTE}
          onChange={(estado) => onStatusChange(i.id, estado)}
          ariaLabel={`Estado de ${i.codigo}`}
        />
      ),
    },
  ]
}
