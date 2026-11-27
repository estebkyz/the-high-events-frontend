import { TableStatusSelect } from "@/components/TableStatusSelect"
import { StatusBadge } from "@/components/StatusBadge"
import { TitleCell } from "@/components/list/cells"
import type { Column } from "@/components/list/DataTable"
import { ESTADOS_OPERATIVOS } from "../constants"
import type { DisponibilidadEquipo, EquipoItem, EstadoOperativo } from "../types"
import { estadoDisponibilidad } from "../utils"

export function getEquipoColumns(
  onStatusChange: (id: string, estado: EstadoOperativo) => unknown,
  getDisponibilidad: (id: string) => DisponibilidadEquipo | undefined,
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
      id: "disponibilidad",
      header: "Disponibilidad",
      cell: (e) => {
        const disponibilidad = getDisponibilidad(e.id)
        const estado = estadoDisponibilidad(disponibilidad)
        if (!estado) return "—"
        return (
          <div className="max-w-[240px]">
            <StatusBadge status={estado} />
            {disponibilidad?.motivo && (
              <p className="text-xs text-ink-muted mt-1 whitespace-normal">
                {disponibilidad.motivo}
              </p>
            )}
          </div>
        )
      },
    },
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
