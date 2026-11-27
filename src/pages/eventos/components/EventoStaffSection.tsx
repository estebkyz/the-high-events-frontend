import { UserPlus } from "lucide-react"
import { useToast } from "@/components/Toast"
import { CustomSelect } from "@/components/CustomSelect"
import { RemoveButton } from "@/components/form/RemoveButton"
import type { EmpleadoItem } from "@/pages/empleados/types"
import { getEmpleadoFullName } from "@/pages/empleados/utils"
import { FASE_OPTIONS } from "@/pages/tareas/constants"
import type { Fase, TareaCatalogoItem } from "@/pages/tareas/types"
import { asignarEmpleado, cambiarTarea } from "../form"
import type { EmpleadoAsignado, EventoSectionProps } from "../types"
import { ResourceSection } from "./ResourceSection"
import { MODULE_ACCESS } from "@/constants/access"

interface EventoStaffSectionProps extends EventoSectionProps {
  empleados: EmpleadoItem[]
  tareas: TareaCatalogoItem[]
  onCreateEmpleado: (nombre: string) => void
}

/**
 * Personal del evento. Un empleado puede tener varias tareas (se agregan en
 * Tareas), por eso cada renglón se identifica por su posición.
 */
export function EventoStaffSection({
  form,
  onChange,
  empleados,
  tareas,
  onCreateEmpleado,
}: EventoStaffSectionProps) {
  const toast = useToast()
  const asignados = form.empleadosAsignados

  const disponibles = empleados.filter(
    (e) => e.estado === "Activo" && !asignados.some((a) => a.empleado_id === e.id),
  )

  const handleAdd = (id: string) => {
    const empleado = empleados.find((e) => e.id === id)
    if (!empleado) return
    if (tareas.length === 0) {
      toast.error("Crea primero una tarea en el catálogo de Tareas")
      return
    }
    onChange({ empleadosAsignados: [...asignados, asignarEmpleado(empleado, tareas[0])] })
  }

  const update = (index: number, changes: Partial<EmpleadoAsignado>) =>
    onChange({
      empleadosAsignados: asignados.map((a, i) =>
        i === index ? { ...a, ...changes } : a,
      ),
    })

  const handleTarea = (index: number, tareaId: string) => {
    const tarea = tareas.find((t) => t.id === tareaId)
    if (tarea) update(index, cambiarTarea(tarea))
  }

  return (
    <ResourceSection
      label="Empleados"
      picker={{
        placeholder: "Agregar empleado",
        options: disponibles.map((e) => ({
          label: getEmpleadoFullName(e),
          value: e.id,
          badge: e.cargo,
          sublabel: e.telefono,
        })),
        onAdd: handleAdd,
        createLabel: "Crear empleado",
        onCreate: onCreateEmpleado,
        createNeeds: MODULE_ACCESS.empleados.create,
      }}
      isEmpty={asignados.length === 0}
      empty={{
        icon: UserPlus,
        title: "Sin personal asignado",
        description: "Vincula a los empleados que formarán el equipo del evento.",
      }}
    >
      {asignados.map((asignado, index) => (
        <div
          key={`${asignado.empleado_id}-${index}`}
          className="py-3 grid grid-cols-1 sm:grid-cols-[1fr_220px_150px_auto] items-center gap-3"
        >
          <div className="min-w-0">
            <p className="text-xs font-semibold text-ink">{asignado.nombre}</p>
            <p className="text-xs text-ink-muted mt-0.5">{asignado.cargo}</p>
          </div>
          <CustomSelect
            ariaLabel={`Tarea de ${asignado.nombre}`}
            value={asignado.tarea_id}
            searchable
            options={tareas.map((t) => ({
              label: t.nombre_tarea,
              value: t.id,
              badge: t.codigo,
            }))}
            onChange={(val) => handleTarea(index, val)}
            placeholder="Seleccionar tarea"
          />
          <CustomSelect
            ariaLabel={`Fase de ${asignado.nombre}`}
            value={asignado.fase}
            options={FASE_OPTIONS}
            onChange={(val) => update(index, { fase: val as Fase })}
          />
          <RemoveButton
            label={`Quitar a ${asignado.nombre}`}
            onClick={() =>
              onChange({
                empleadosAsignados: asignados.filter((_, i) => i !== index),
              })
            }
          />
        </div>
      ))}
    </ResourceSection>
  )
}
