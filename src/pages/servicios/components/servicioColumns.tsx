import { TableStatusSelect } from "@/components/TableStatusSelect"
import { CELL, TitleCell } from "@/components/list/cells"
import type { Column } from "@/components/list/DataTable"
import { ESTADOS_ACTIVO, type EstadoActivo } from "@/constants/common"
import { TIPO_COBRO_LABELS } from "../constants"
import type { ServicioItem } from "../types"

export function getServicioColumns(
  onStatusChange: (id: string, estado: EstadoActivo) => unknown,
): Column<ServicioItem>[] {
  return [
    {
      id: "servicio",
      header: "Servicio",
      mobile: "title",
      cell: (s) => <TitleCell title={s.nombre} />,
    },
    { id: "categoria", header: "Categoría", cell: (s) => s.categoria },
    {
      id: "descripcion",
      header: "Descripción",
      mobile: "hidden",
      className: "text-[#94A3B8] text-xs max-w-[280px] truncate",
      cell: (s) => s.descripcion,
    },
    {
      id: "precio",
      header: "Precio base",
      mobile: "primary",
      className: CELL.money,
      cell: (s) => (
        <>
          {s.precioBase}
          <span className="text-[10px] text-[#A78BFA] block font-medium">
            {TIPO_COBRO_LABELS[s.tipo_cobro] ?? s.tipo_cobro}
          </span>
        </>
      ),
    },
    {
      id: "estado",
      header: "Estado",
      mobile: "badge",
      cell: (s) => (
        <TableStatusSelect
          status={s.estado}
          options={ESTADOS_ACTIVO}
          onChange={(estado) => onStatusChange(s.id, estado)}
          ariaLabel={`Estado de ${s.nombre}`}
        />
      ),
    },
  ]
}
