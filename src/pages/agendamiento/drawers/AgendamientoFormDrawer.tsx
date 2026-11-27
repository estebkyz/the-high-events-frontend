import { Drawer } from "@/components/Drawer"
import { FormInput } from "@/components/FormInput"
import { FormActions } from "@/components/form/FormActions"
import { FormSection } from "@/components/form/FormSection"
import { FormSelect } from "@/components/form/FormSelect"
import { FormTextarea } from "@/components/form/FormTextarea"
import { FormUbicacion } from "@/components/form/FormUbicacion"
import type { FormDrawerProps } from "@/components/form/types"
import type { ClienteItem } from "@/pages/clientes/types"
import { getClienteName } from "@/pages/clientes/utils"
import { fieldSetter } from "@/utils/form"
import { todayISO } from "@/utils/format"
import type { EmpleadoItem } from "@/pages/empleados/types"
import { getEmpleadoFullName } from "@/pages/empleados/utils"
import { ESTADO_AGENDA_OPTIONS, MOTIVO_OPTIONS, TIPO_AGENDA_OPTIONS } from "../constants"
import { seleccionarCliente } from "../form"
import type {
  AgendaEntry,
  AgendaForm,
  EstadoAgendamiento,
  TipoAgendamiento,
} from "../types"

interface AgendamientoFormDrawerProps extends FormDrawerProps<AgendaForm> {
  clientes: ClienteItem[]
  empleados: EmpleadoItem[]
  conflict?: AgendaEntry
}

export function AgendamientoFormDrawer({
  isOpen,
  isEditing,
  saving,
  form,
  setForm,
  onClose,
  onSubmit,
  clientes,
  empleados,
  conflict,
}: AgendamientoFormDrawerProps) {
  const set = fieldSetter(setForm)

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title={isEditing ? "Editar agendamiento" : "Agendar"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormSelect
            label="Cliente"
            required={!form.evento_id}
            disabled={Boolean(form.evento_id)}
            searchable
            placeholder="Seleccionar cliente"
            options={clientes.map((c) => ({
              label: getClienteName(c),
              value: getClienteName(c),
            }))}
            value={form.client}
            onChange={(val) => set(seleccionarCliente(val, clientes))}
          />
          <FormInput
            label="Asunto"
            required
            maxLength={150}
            value={form.title}
            onChange={(e) => set({ title: e.target.value })}
          />
          <FormSelect
            label="Motivo"
            value={form.motivo}
            onChange={(val) => set({ motivo: val })}
            options={MOTIVO_OPTIONS}
          />
          <FormSelect
            label="Tipo"
            value={form.tipo_agendamiento}
            onChange={(val) => set({ tipo_agendamiento: val as TipoAgendamiento })}
            options={TIPO_AGENDA_OPTIONS}
          />
          <FormSelect
            label="Atiende"
            searchable
            placeholder="Selecciona un empleado"
            value={form.responsable_id ?? ""}
            onChange={(val) => set({ responsable_id: val })}
            options={empleados
              .filter((e) => e.estado === "Activo" || e.id === form.responsable_id)
              .map((e) => ({
                label: getEmpleadoFullName(e),
                value: e.id,
                sublabel: e.cargo,
              }))}
          />
          <FormInput
            label="Fecha"
            type="date"
            required
            value={form.dateISO}
            onChange={(e) => set({ dateISO: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3.5">
            <FormInput
              label="Hora de inicio"
              type="time"
              required
              value={form.time}
              onChange={(e) => set({ time: e.target.value })}
              error={conflict && `Ocupado por "${conflict.title}"`}
            />
            <FormInput
              label="Hora de fin"
              type="time"
              min={form.time}
              value={form.timeEnd}
              onChange={(e) => set({ timeEnd: e.target.value })}
            />
          </div>
          {isEditing && (
            <FormSelect
              label="Estado"
              value={form.estado}
              onChange={(val) => set({ estado: val as EstadoAgendamiento })}
              options={ESTADO_AGENDA_OPTIONS}
            />
          )}
        </div>

        <FormSection
          title="Datos tentativos del evento"
          hint="Se usan para crear el evento a partir de esta reunión."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormInput
              label="Fecha tentativa"
              type="date"
              min={isEditing ? undefined : todayISO()}
              value={form.fechaTentativaEvento}
              onChange={(e) => set({ fechaTentativaEvento: e.target.value })}
            />
            <FormInput
              label="Tipo de evento"
              maxLength={50}
              placeholder="Ej. Boda, corporativo"
              value={form.tipoEventoTentativo}
              onChange={(e) => set({ tipoEventoTentativo: e.target.value })}
            />
          </div>
          <FormUbicacion
            label="Lugar tentativo"
            placeholder="Ej. Hacienda San Pedro, Rionegro"
            value={form.lugarTentativo}
            onChange={(lugarTentativo) => set({ lugarTentativo })}
          />
          <FormTextarea
            label="Notas"
            maxLength={2000}
            rows={2}
            value={form.notas}
            onChange={(e) => set({ notas: e.target.value })}
          />
        </FormSection>

        <FormActions
          onCancel={onClose}
          saving={saving}
          submitLabel={isEditing ? "Guardar cambios" : "Agendar"}
        />
      </form>
    </Drawer>
  )
}
