import { StatusBadge } from "@/components/StatusBadge"
import { CELL, TitleCell } from "@/components/list/cells"
import type { Column } from "@/components/list/DataTable"
import { CARTERA } from "../constants"
import type { AbonoItem, EstadoCuota, TipoCartera } from "../types"
import { estadoCartera, getAbonoName, getTercero } from "../utils"

interface CuotaCellProps {
  monto: string
  estado: EstadoCuota
  fecha?: string
}

function CuotaCell({ monto, estado, fecha }: CuotaCellProps) {
  return (
    <>
      <p className="tabular-nums">{monto}</p>
      <p className="text-[11px] text-[#94A3B8] mt-0.5">
        {estado === "Pagado" ? (fecha ?? "Pagado") : "Pendiente"}
      </p>
    </>
  )
}

/** El estado es derivado (no editable): cambia al registrar transacciones. */
export function getAbonoColumns(cartera: TipoCartera): Column<AbonoItem>[] {
  return [
    {
      id: "acuerdo",
      header: CARTERA[cartera].columna,
      mobile: "title",
      cell: (a) => (
        <TitleCell
          title={getAbonoName(a)}
          subtitle={
            cartera === "Clientes" ? getTercero(a) : `${getTercero(a)} · ${a.evento}`
          }
        />
      ),
    },
    {
      id: "anticipo",
      header: "Anticipo",
      cell: (a) => (
        <CuotaCell monto={a.anticipo} estado={a.estadoAnticipo} fecha={a.fechaAnticipo} />
      ),
    },
    {
      id: "saldo",
      header: "Saldo",
      cell: (a) => (
        <CuotaCell monto={a.saldo} estado={a.estadoSaldo} fecha={a.fechaSaldo} />
      ),
    },
    {
      id: "total",
      header: "Total",
      mobile: "primary",
      className: CELL.money,
      cell: (a) => a.total,
    },
    {
      id: "estado",
      header: "Estado",
      mobile: "badge",
      cell: (a) => (
        <StatusBadge
          status={
            estadoCartera(a) === "Liquidado"
              ? "Pagado"
              : a.estadoAnticipo === "Pagado"
                ? "Parcial"
                : CARTERA[cartera].pendiente
          }
        />
      ),
    },
  ]
}
