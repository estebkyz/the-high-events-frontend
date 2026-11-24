import { TableStatusSelect } from "@/components/TableStatusSelect"
import { TitleCell } from "@/components/list/cells"
import type { Column } from "@/components/list/DataTable"
import { ESTADOS_OPERATIVOS } from "../constants"
import type { EquipoItem, EstadoOperativo } from "../types"

export function getEquipoColumns(
  onStatusChange: (id: string, estado: EstadoOperativo) => unknown,
): Column<EquipoItem>[] {
  return [
    {
      id: "equipo",
      header: "Equipo",
      mobile: "title",
      cell: (e) => <TitleCell title={e.nombre} subtitle={e.serie} />,
    },
    { id: "categoria", header: "Categoría", cell: (e) => e.categoria },
    { id: "propiedad", header: "Propiedad", cell: (e) => e.propiedad },
    {
      id: "estado",
      header: "Estado",
      mobile: "badge",
      cell: (e) => (
        <TableStatusSelect
          status={e.estadoOperativo}
          options={ESTADOS_OPERATIVOS}
          onChange={(estado) => onStatusChange(e.id, estado)}
          ariaLabel={`Estado de ${e.nombre}`}
        />
      ),
    },
  ]
}
