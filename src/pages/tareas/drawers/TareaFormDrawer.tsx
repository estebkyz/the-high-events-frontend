import { Drawer } from "@/components/Drawer"
import { FormInput } from "@/components/FormInput"
import { FormActions } from "@/components/form/FormActions"
import { FormSelect } from "@/components/form/FormSelect"
import { FormTextarea } from "@/components/form/FormTextarea"
import type { FormDrawerProps } from "@/components/form/types"
import type { EmpleadoItem } from "@/pages/empleados/types"
import { getEmpleadoFullName } from "@/pages/empleados/utils"
import type { EventoItem } from "@/pages/eventos/types"
import { fieldSetter } from "@/utils/form"
import { FASE_OPTIONS, PRIORIDAD_OPTIONS } from "../constants"
import { desdeCatalogo } from "../form"
import type { Fase, Prioridad, TareaCatalogoItem, TareaForm } from "../types"

interface TareaFormDrawerProps extends Omit<FormDrawerProps<TareaForm>, "isEditing"> {
  catalogo: TareaCatalogoItem[]
  eventos: EventoItem[]
  empleados: EmpleadoItem[]
}

/** Edita una asignación; las asignaciones nuevas se crean desde el evento. */
export function TareaFormDrawer({
  isOpen,
  saving,
  form,
  setForm,
  onClose,
  onSubmit,
  catalogo,
  eventos,
  empleados,
}: TareaFormDrawerProps) {
  const set = fieldSetter(setForm)

  const handlePlantilla = (id: string) => {
    const plantilla = catalogo.find((c) => c.id === id)
    if (plantilla) set(desdeCatalogo(plantilla))
  }

  const handleEvento = (nombre: string) => {
    const evento = eventos.find((ev) => ev.nombre === nombre)
    set({
      evento: nombre,
      evento_id: evento?.id,
      fechaLimite: evento?.hora_inicio?.split("T")[0] ?? form.fechaLimite,
    })
  }

  const handleResponsable = (nombre: string) => {
    const empleado = empleados.find((e) => getEmpleadoFullName(e) === nombre)
    set({
      responsable: nombre,
      responsable_id: empleado?.id,
      cargo_responsable: empleado?.cargo,
    })
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose} position="center" title="Editar tarea">
      <form onSubmit={onSubmit} className="space-y-4">
        <FormSelect
          label="Tarea del catálogo"
          required
          searchable
          placeholder="Seleccionar tarea"
          value={String(form.tarea_id ?? "")}
          options={catalogo.map((c) => ({
            label: c.nombre_tarea,
            value: c.id,
            badge: c.codigo,
            sublabel: c.descripcion,
          }))}
          onChange={handlePlantilla}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormSelect
            label="Evento"
            required
            searchable
            value={form.evento}
            options={eventos.map((ev) => ({ label: ev.nombre, value: ev.nombre }))}
            onChange={handleEvento}
            placeholder="Seleccionar evento"
          />
          <FormSelect
            label="Responsable"
            required
            searchable
            value={form.responsable}
            options={empleados.map((e) => ({
              label: getEmpleadoFullName(e),
              value: getEmpleadoFullName(e),
              badge: e.cargo,
            }))}
            onChange={handleResponsable}
            placeholder="Seleccionar responsable"
          />
          <FormSelect
            label="Fase"
            value={form.fase}
            onChange={(val) => set({ fase: val as Fase })}
            options={FASE_OPTIONS}
          />
          <FormSelect
            label="Prioridad"
            value={form.prioridad}
            onChange={(val) => set({ prioridad: val as Prioridad })}
            options={PRIORIDAD_OPTIONS}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <FormInput
            label="Fecha programada"
            type="date"
            required
            value={form.fechaLimite}
            onChange={(e) => set({ fechaLimite: e.target.value })}
          />
          <FormInput
            label="Hora de inicio"
            required
            type="time"
            value={form.hora_inicio_estimada ?? ""}
            onChange={(e) => set({ hora_inicio_estimada: e.target.value })}
          />
          <FormInput
            label="Hora de fin"
            required
            type="time"
            value={form.hora_fin_estimada ?? ""}
            onChange={(e) => set({ hora_fin_estimada: e.target.value })}
          />
        </div>
        <FormTextarea
          label="Novedades o instrucciones"
          value={form.notas ?? ""}
          onChange={(e) => set({ notas: e.target.value })}
        />
        <FormActions onCancel={onClose} saving={saving} submitLabel="Guardar cambios" />
      </form>
    </Drawer>
  )
}
