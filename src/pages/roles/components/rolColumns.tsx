import { TableStatusSelect } from "@/components/TableStatusSelect"
import { CELL, TitleCell } from "@/components/list/cells"
import type { Column } from "@/components/list/DataTable"
import { ESTADOS_ACTIVO, type EstadoActivo } from "@/constants/common"
import { countModulos } from "../form"
import { PERMISSION_GROUPS } from "../permissions"
import type { Rol } from "../types"

export function getRolColumns(
  onStatusChange: (id: string, estado: EstadoActivo) => unknown,
): Column<Rol>[] {
  return [
    {
      id: "rol",
      header: "Rol",
      mobile: "title",
      cell: (r) => <TitleCell title={r.nombre} subtitle={r.descripcion} />,
    },
    {
      id: "permisos",
      header: "Permisos",
      cell: (r) => `${countModulos(r.permisos)} de ${PERMISSION_GROUPS.length} módulos`,
    },
    {
      id: "usuarios",
      header: "Usuarios",
      className: CELL.muted,
      cell: (r) => r.usuariosCount,
    },
    {
      id: "estado",
      header: "Estado",
      mobile: "badge",
      cell: (r) => (
        <TableStatusSelect
          status={r.estado}
          options={ESTADOS_ACTIVO}
          onChange={(estado) => onStatusChange(r.id, estado)}
          ariaLabel={`Estado de ${r.nombre}`}
        />
      ),
    },
  ]
}
