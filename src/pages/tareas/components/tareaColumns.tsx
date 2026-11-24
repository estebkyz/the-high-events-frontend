import { StatusBadge } from "@/components/StatusBadge"
import { TableStatusSelect } from "@/components/TableStatusSelect"
import { CELL, TagsCell, TitleCell } from "@/components/list/cells"
import type { Column } from "@/components/list/DataTable"
import { ESTADOS_TAREA } from "../constants"
import { asignacionesDe } from "../form"
import type { EstadoTarea, TareaCatalogoItem, TareaItem } from "../types"

export function getTareaColumns(
  onStatusChange: (id: string, estado: EstadoTarea) => unknown,
): Column<TareaItem>[] {
  return [
    {
      id: "tarea",
      header: "Tarea",
      mobile: "title",
      cell: (t) => <TitleCell title={t.tarea} subtitle={t.evento} />,
    },
    {
      id: "responsable",
      header: "Responsable",
      cell: (t) => <TitleCell title={t.responsable} subtitle={t.cargo_responsable} />,
    },
    { id: "fase", header: "Fase", cell: (t) => t.fase },
    { id: "plazo", header: "Plazo", className: CELL.muted, cell: (t) => t.fechaLimite },
    {
      id: "prioridad",
      header: "Prioridad",
      cell: (t) => <StatusBadge status={t.prioridad} />,
    },
    {
      id: "estado",
      header: "Estado",
      mobile: "badge",
      cell: (t) => (
        <TableStatusSelect
          status={t.estado}
          options={ESTADOS_TAREA}
          onChange={(estado) => onStatusChange(t.id, estado)}
          ariaLabel={`Estado de ${t.tarea}`}
        />
      ),
    },
  ]
}

export function getCatalogoColumns(tareas: TareaItem[]): Column<TareaCatalogoItem>[] {
  return [
    {
      id: "tarea",
      header: "Tarea",
      mobile: "title",
      cell: (c) => <TitleCell title={c.nombre_tarea} subtitle={c.descripcion} />,
    },
    { id: "codigo", header: "Código", className: CELL.code, cell: (c) => c.codigo },
    { id: "fase", header: "Fase sugerida", cell: (c) => c.fase_sugerida },
    {
      id: "asignaciones",
      header: "Asignaciones",
      cell: (c) => {
        const eventos = asignacionesDe(c, tareas).map((t) => t.evento)
        return eventos.length > 0 ? (
          <TagsCell tags={Array.from(new Set(eventos))} />
        ) : (
          <span className="text-[11px] text-[#94A3B8]">Sin eventos activos</span>
        )
      },
    },
  ]
}
