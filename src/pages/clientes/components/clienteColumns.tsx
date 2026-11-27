import { TableStatusSelect } from "@/components/TableStatusSelect"
import { CELL, TitleCell } from "@/components/list/cells"
import type { Column } from "@/components/list/DataTable"
import { ESTADOS_ACTIVO, type EstadoActivo } from "@/constants/common"
import type { ClienteItem } from "../types"
import { getClienteName } from "../utils"

export function getClienteColumns(
  onStatusChange: (id: string, estado: EstadoActivo) => unknown,
): Column<ClienteItem>[] {
  return [
    {
      id: "cliente",
      header: "Cliente",
      mobile: "title",
      cell: (c) => (
        <TitleCell
          title={getClienteName(c)}
          subtitle={c.tipo_cliente === "Empresa" ? c.contacto_nombre : undefined}
        />
      ),
    },
    {
      id: "documento",
      header: "Documento",
      className: CELL.muted,
      cell: (c) => c.numero_documento,
    },
    { id: "tipo", header: "Tipo", cell: (c) => c.tipo_cliente },
    {
      id: "contacto",
      header: "Contacto",
      cell: (c) => (
        <>
          <p>{c.correo}</p>
          <p className="text-xs text-ink-muted tabular-nums">{c.telefono}</p>
        </>
      ),
    },
    {
      id: "direccion",
      header: "Dirección",
      className: CELL.muted,
      cell: (c) => c.direccion,
    },
    {
      id: "estado",
      header: "Estado",
      mobile: "badge",
      cell: (c) => (
        <TableStatusSelect
          status={c.estado}
          options={ESTADOS_ACTIVO}
          onChange={(estado) => onStatusChange(c.id, estado)}
          ariaLabel={`Estado de ${getClienteName(c)}`}
        />
      ),
    },
  ]
}
