import { TableStatusSelect } from "@/components/TableStatusSelect"
import { CELL, TitleCell } from "@/components/list/cells"
import type { Column } from "@/components/list/DataTable"
import { formatCOP } from "@/utils/format"
import { ESTADOS_EVENTO } from "../constants"
import { formatDateTime } from "../schedule"
import type { EstadoEvento, EventoItem } from "../types"

export function getEventoColumns(
  onStatusChange: (id: string, estado: EstadoEvento) => unknown,
): Column<EventoItem>[] {
  return [
    {
      id: "evento",
      header: "Evento",
      mobile: "title",
      cell: (e) => <TitleCell title={e.nombre} subtitle={e.direccion} />,
    },
    {
      id: "cliente",
      header: "Cliente",
      cell: (e) => <TitleCell title={e.cliente_nombre} subtitle={e.cotizacion_codigo} />,
    },
    { id: "modalidad", header: "Modalidad", cell: (e) => e.modalidad },
    {
      id: "fecha",
      header: "Inicio",
      className: CELL.muted,
      cell: (e) => formatDateTime(e.hora_inicio),
    },
    {
      id: "presupuesto",
      header: "Presupuesto",
      mobile: "primary",
      className: CELL.money,
      cell: (e) => formatCOP(e.presupuesto_estimado),
    },
    {
      id: "estado",
      header: "Estado",
      mobile: "badge",
      cell: (e) => (
        <TableStatusSelect
          status={e.estado}
          options={ESTADOS_EVENTO}
          onChange={(estado) => onStatusChange(e.id, estado)}
          ariaLabel={`Estado de ${e.nombre}`}
        />
      ),
    },
  ]
}
