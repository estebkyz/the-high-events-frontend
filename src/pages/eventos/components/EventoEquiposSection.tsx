import { Boxes, CalendarX, FileCheck, TriangleAlert } from "lucide-react"
import { StatusBadge } from "@/components/StatusBadge"
import { RemoveButton } from "@/components/form/RemoveButton"
import type { EquipoItem } from "@/pages/equipos/types"
import { useDisponibilidad } from "@/pages/equipos/useDisponibilidad"
import { resumenDocumentos } from "../documentos"
import { durationMinutes } from "../schedule"
import type { EventoSectionProps } from "../types"
import { ResourceSection } from "./ResourceSection"

interface EventoEquiposSectionProps extends EventoSectionProps {
  eventoId?: string
  equipos: EquipoItem[]
}

export function EventoEquiposSection({
  form,
  onChange,
  eventoId,
  equipos,
}: EventoEquiposSectionProps) {
  const conFechas = (durationMinutes(form) ?? 0) > 0
  const { get } = useDisponibilidad(
    conFechas ? { inicio: form.hora_inicio, fin: form.hora_fin } : null,
    eventoId,
  )
  const isAssigned = (eq: EquipoItem) => form.equiposAsignados.includes(eq.id)
  const asignados = equipos.filter(isAssigned)
  const otros = equipos.filter((eq) => !isAssigned(eq))
  const disponibles = otros.filter((eq) => get(eq.id)?.disponible)
  const ocupados = otros.filter((eq) => get(eq.id)?.disponible === false)
  const resumen = resumenDocumentos(asignados)

  return (
    <ResourceSection
      label="Equipos"
      picker={{
        placeholder: "Agregar equipo",
        options: disponibles.map((eq) => ({
          label: eq.nombre,
          value: eq.id,
          badge: eq.categoria,
          sublabel: `${eq.serie} · ${eq.propiedad}`,
        })),
        onAdd: (id) => onChange({ equiposAsignados: [...form.equiposAsignados, id] }),
      }}
      summary={
        <div className="space-y-2 text-xs text-ink-muted">
          <p className="flex items-start gap-2">
            <CalendarX size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
            {conFechas
              ? "Solo se ofrecen los equipos en servicio y libres en las fechas del evento."
              : "Completa las fechas y horas del evento para validar la disponibilidad."}
          </p>
          {conFechas && ocupados.length > 0 && (
            <details className="pl-[22px]">
              <summary className="cursor-pointer text-warn-ink focus-visible:outline-none focus-visible:underline">
                {ocupados.length === 1
                  ? "1 equipo no disponible"
                  : `${ocupados.length} equipos no disponibles`}
              </summary>
              <ul className="mt-1.5 space-y-1 text-xs">
                {ocupados.map((eq) => (
                  <li key={eq.id}>
                    <span className="font-semibold text-ink-soft">{eq.nombre}</span>:{" "}
                    {get(eq.id)?.motivo}
                  </li>
                ))}
              </ul>
            </details>
          )}
          {resumen && (
            <p className="flex items-start gap-2">
              <FileCheck
                size={14}
                className="text-brand-ink shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>
                Al guardar se prepararán en borrador:{" "}
                <span className="font-semibold text-ink">{resumen}</span>. Lo ya
                confirmado no cambia.
              </span>
            </p>
          )}
        </div>
      }
      isEmpty={asignados.length === 0}
      empty={{
        icon: Boxes,
        title: "Sin equipos asignados",
        description: "Asigna los equipos del inventario que cubrirán el evento.",
      }}
    >
      {asignados.map((eq) => {
        const motivo = conFechas ? get(eq.id)?.motivo : undefined
        return (
          <div key={eq.id} className="py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-ink truncate">{eq.nombre}</p>
              <p className="text-xs text-ink-muted mt-0.5">
                {[eq.serie, eq.categoria, eq.proveedor_nombre]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {motivo && (
                <p
                  role="alert"
                  className="flex items-start gap-1.5 text-xs text-danger-ink mt-1"
                >
                  <TriangleAlert
                    size={12}
                    className="shrink-0 mt-px"
                    aria-hidden="true"
                  />
                  {motivo}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge status={eq.propiedad} />
              <RemoveButton
                label={`Quitar ${eq.nombre}`}
                onClick={() =>
                  onChange({
                    equiposAsignados: form.equiposAsignados.filter((id) => id !== eq.id),
                  })
                }
              />
            </div>
          </div>
        )
      })}
    </ResourceSection>
  )
}
