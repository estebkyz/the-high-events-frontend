import { TableStatusSelect } from "@/components/TableStatusSelect"
import { CELL, TitleCell } from "@/components/list/cells"
import type { Column } from "@/components/list/DataTable"
import { ESTADOS_ACTIVO, type EstadoActivo } from "@/constants/common"
import type { UsuarioItem } from "../types"
import { getUsuarioFullName } from "../utils"

export function getUsuarioColumns(
  onStatusChange: (id: string, estado: EstadoActivo) => unknown,
): Column<UsuarioItem>[] {
  return [
    {
      id: "usuario",
      header: "Usuario",
      mobile: "title",
      cell: (u) => <TitleCell title={getUsuarioFullName(u)} />,
    },
    {
      id: "documento",
      header: "Documento",
      className: CELL.muted,
      cell: (u) => u.numero_documento,
    },
    { id: "rol", header: "Rol", cell: (u) => u.rol },
    {
      id: "telefono",
      header: "Teléfono",
      className: CELL.muted,
      cell: (u) => u.telefono,
    },
    {
      id: "estado",
      header: "Estado",
      mobile: "badge",
      cell: (u) => (
        <TableStatusSelect
          status={u.estado}
          options={ESTADOS_ACTIVO}
          onChange={(estado) => onStatusChange(u.id, estado)}
          ariaLabel={`Estado de ${getUsuarioFullName(u)}`}
        />
      ),
    },
  ]
}
