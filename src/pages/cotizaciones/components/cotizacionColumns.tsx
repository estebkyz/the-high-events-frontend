import { TableStatusSelect } from "@/components/TableStatusSelect"
import { CELL, TagsCell, TitleCell } from "@/components/list/cells"
import type { Column } from "@/components/list/DataTable"
import { formatFecha, todayISO } from "@/utils/format"
import { ESTADOS_COTIZACION, VIGENCIA_TONES } from "../constants"
import type { CotizacionItem, EstadoCotizacion } from "../types"
import { getVigencia } from "../utils"

export function getCotizacionColumns(
  onStatusChange: (id: string, estado: EstadoCotizacion) => unknown,
): Column<CotizacionItem>[] {
  const hoy = todayISO()
  return [
    {
      id: "cliente",
      header: "Cliente",
      mobile: "title",
      cell: (c) => <TitleCell title={c.cliente} subtitle={c.nombre_evento} />,
    },
    { id: "codigo", header: "Código", className: CELL.code, cell: (c) => c.codigo },
    {
      id: "servicios",
      header: "Servicios",
      cell: (c) => <TagsCell tags={c.servicios ?? []} />,
    },
    {
      id: "emision",
      header: "Emisión",
      className: CELL.muted,
      cell: (c) => {
        const vigencia = getVigencia(c, hoy)
        return (
          <>
            <span className="block">{formatFecha(c.fecha)}</span>
            <span className={`block text-xs ${VIGENCIA_TONES[vigencia.tone]}`}>
              {vigencia.texto}
            </span>
          </>
        )
      },
    },
    {
      id: "total",
      header: "Total",
      mobile: "primary",
      className: CELL.money,
      cell: (c) => c.total,
    },
    {
      id: "estado",
      header: "Estado",
      mobile: "badge",
      cell: (c) => (
        <TableStatusSelect
          status={c.estado}
          options={ESTADOS_COTIZACION}
          onChange={(estado) => onStatusChange(c.id, estado)}
          ariaLabel={`Estado de ${c.codigo}`}
        />
      ),
    },
  ]
}
