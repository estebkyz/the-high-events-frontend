import { TableStatusSelect } from "@/components/TableStatusSelect"
import { TagsCell, TitleCell } from "@/components/list/cells"
import { ContactCell } from "@/components/list/ContactCell"
import type { Column } from "@/components/list/DataTable"
import { ESTADOS_ACTIVO, type EstadoActivo } from "@/constants/common"
import type { ProveedorItem } from "../types"

export function getProveedorColumns(
  onStatusChange: (id: string, estado: EstadoActivo) => unknown,
): Column<ProveedorItem>[] {
  return [
    {
      id: "proveedor",
      header: "Proveedor",
      mobile: "title",
      cell: (p) => <TitleCell title={p.razon_social} subtitle={p.nit_documento} />,
    },
    {
      id: "catalogo",
      header: "Catálogo",
      cell: (p) => <TagsCell tags={[...(p.servicios ?? []), ...(p.equipos ?? [])]} />,
    },
    {
      id: "contacto",
      header: "Contacto",
      cell: (p) => <ContactCell correo={p.correo} telefono={p.telefono} />,
    },
    {
      id: "estado",
      header: "Estado",
      mobile: "badge",
      cell: (p) => (
        <TableStatusSelect
          status={p.estado}
          options={ESTADOS_ACTIVO}
          onChange={(estado) => onStatusChange(p.id, estado)}
          ariaLabel={`Estado de ${p.razon_social}`}
        />
      ),
    },
  ]
}
