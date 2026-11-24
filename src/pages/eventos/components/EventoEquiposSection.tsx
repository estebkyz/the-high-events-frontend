import { Boxes } from "lucide-react"
import { StatusBadge } from "@/components/StatusBadge"
import { RemoveButton } from "@/components/form/RemoveButton"
import type { EquipoItem } from "@/pages/equipos/types"
import type { EventoSectionProps } from "../types"
import { ResourceSection } from "./ResourceSection"

interface EventoEquiposSectionProps extends EventoSectionProps {
  equipos: EquipoItem[]
}

export function EventoEquiposSection({
  form,
  onChange,
  equipos,
}: EventoEquiposSectionProps) {
  const isAssigned = (eq: EquipoItem) => form.equiposAsignados.includes(eq.id)
  const asignados = equipos.filter(isAssigned)
  // Solo se ofrecen equipos realmente disponibles.
  const disponibles = equipos.filter(
    (eq) => !isAssigned(eq) && eq.estadoOperativo === "Disponible",
  )

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
      isEmpty={asignados.length === 0}
      empty={{
        icon: Boxes,
        title: "Sin equipos asignados",
        description: "Asigna los equipos del inventario que cubrirán el evento.",
      }}
    >
      {asignados.map((eq) => (
        <div key={eq.id} className="py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#F1F5F9] truncate">{eq.nombre}</p>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">
              {[eq.serie, eq.categoria, eq.proveedor_nombre].filter(Boolean).join(" · ")}
            </p>
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
      ))}
    </ResourceSection>
  )
}
