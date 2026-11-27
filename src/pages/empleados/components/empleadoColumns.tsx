import { TableStatusSelect } from "@/components/TableStatusSelect"
import { CELL, TitleCell } from "@/components/list/cells"
import type { Column } from "@/components/list/DataTable"
import { ESTADOS_ACTIVO, type EstadoActivo } from "@/constants/common"
import type { EmpleadoItem } from "../types"
import { getEmpleadoFullName } from "../utils"

export function getEmpleadoColumns(
  onStatusChange: (id: string, estado: EstadoActivo) => unknown,
): Column<EmpleadoItem>[] {
  return [
    {
      id: "empleado",
      header: "Empleado",
      mobile: "title",
      cell: (e) => <TitleCell title={getEmpleadoFullName(e)} />,
    },
    {
      id: "documento",
      header: "Documento",
      className: CELL.muted,
      cell: (e) => e.numero_documento,
    },
    { id: "cargo", header: "Cargo", cell: (e) => e.cargo },
    { id: "vinculacion", header: "Vinculación", cell: (e) => e.vinculacion ?? "Fijo" },
    {
      id: "telefono",
      header: "Teléfono",
      className: CELL.muted,
      cell: (e) => e.telefono,
    },
    {
      id: "estado",
      header: "Estado",
      mobile: "badge",
      cell: (e) => (
        <TableStatusSelect
          status={e.estado}
          options={ESTADOS_ACTIVO}
          onChange={(estado) => onStatusChange(e.id, estado)}
          ariaLabel={`Estado de ${getEmpleadoFullName(e)}`}
        />
      ),
    },
  ]
}
