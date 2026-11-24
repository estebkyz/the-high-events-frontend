import { Drawer } from "@/components/Drawer"
import { FormInput } from "@/components/FormInput"
import { FormActions } from "@/components/form/FormActions"
import { FormSelect } from "@/components/form/FormSelect"
import { FormTextarea } from "@/components/form/FormTextarea"
import type { FormDrawerProps } from "@/components/form/types"
import type { ClienteItem } from "@/pages/clientes/types"
import { getClienteName } from "@/pages/clientes/utils"
import type { EventoItem } from "@/pages/eventos/types"
import { fieldSetter } from "@/utils/form"
import { toOptions } from "@/utils/list"
import {
  ACTIVIDADES,
  ESTADO_AGENDA_OPTIONS,
  MODALIDAD_CITA_OPTIONS,
  TIPO_OPTIONS,
} from "../constants"
import { aplicarEvento, cambiarTipo, seleccionarCliente } from "../form"
import type {
  AgendaEvent,
  AgendaForm,
  EstadoAgendamiento,
  TipoAgendamiento,
} from "../types"
import { isReunion } from "../utils"

interface AgendamientoFormDrawerProps extends FormDrawerProps<AgendaForm> {
  clientes: ClienteItem[]
  eventos: EventoItem[]
  conflict?: AgendaEvent
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
  eventos,
  conflict,
}: AgendamientoFormDrawerProps) {
  const set = fieldSetter(setForm)
  const reunion = isReunion(form)
  const eventosDelCliente = form.client
    ? eventos.filter((ev) => ev.cliente_nombre === form.client)
    : eventos

  const handleEvento = (id: string) => {
    const evento = eventos.find((ev) => ev.id === id)
    if (evento) set(aplicarEvento(evento))
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title={isEditing ? "Editar agendamiento" : "Crear agendamiento"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormSelect
            label="Tipo"
            value={form.tipo_agendamiento}
            onChange={(val) => set(cambiarTipo(val as TipoAgendamiento))}
            options={TIPO_OPTIONS}
          />
          <FormSelect
            label={reunion ? "Motivo" : "Actividad"}
            value={form.motivo}
            onChange={(val) => set({ motivo: val })}
            options={toOptions(ACTIVIDADES[form.tipo_agendamiento])}
          />
          <FormSelect
            label="Cliente"
            required
            searchable
            placeholder="Seleccionar cliente"
            options={clientes.map((c) => ({
              label: getClienteName(c),
              value: getClienteName(c),
            }))}
            value={form.client}
            onChange={(val) => set(seleccionarCliente(val, clientes))}
          />
          {!reunion && (
            <FormSelect
              label="Evento vinculado"
              searchable
              placeholder="Seleccionar evento"
              options={eventosDelCliente.map((ev) => ({
                label: ev.nombre,
                value: ev.id,
                sublabel: ev.cliente_nombre,
              }))}
              value={form.evento_id ?? ""}
              onChange={handleEvento}
              hint="Completa asunto, fecha y ubicación"
            />
          )}
          <FormInput
            label="Asunto"
            required
            value={form.title}
            onChange={(e) => set({ title: e.target.value })}
          />
          {reunion ? (
            <FormSelect
              label="Modalidad"
              value={form.modalidadCita}
              onChange={(val) => set({ modalidadCita: val })}
              options={MODALIDAD_CITA_OPTIONS}
            />
          ) : (
            <FormInput
              label="Ubicación"
              value={form.venue}
              onChange={(e) => set({ venue: e.target.value })}
            />
          )}
          <FormInput
            label="Fecha"
            type="date"
            required
            value={form.dateISO}
            onChange={(e) => set({ dateISO: e.target.value })}
          />
          <FormInput
            label="Hora"
            type="time"
            required
            value={form.time}
            onChange={(e) => set({ time: e.target.value })}
            error={conflict && `Ocupado por "${conflict.title}"`}
          />
          {reunion && (
            <>
              <FormInput
                label="Fecha tentativa del evento"
                type="date"
                value={form.fechaTentativaEvento}
                onChange={(e) => set({ fechaTentativaEvento: e.target.value })}
              />
              <FormInput
                label="Tipo de evento"
                placeholder="Ej. Boda, corporativo"
                value={form.tipoEventoTentativo}
                onChange={(e) => set({ tipoEventoTentativo: e.target.value })}
              />
              <FormInput
                label="Lugar tentativo"
                value={form.lugarTentativo}
                onChange={(e) => set({ lugarTentativo: e.target.value })}
              />
            </>
          )}
          {isEditing && (
            <FormSelect
              label="Estado"
              value={form.estado}
              onChange={(val) => set({ estado: val as EstadoAgendamiento })}
              options={ESTADO_AGENDA_OPTIONS}
            />
          )}
        </div>
        <FormTextarea
          label="Notas"
          rows={2}
          value={form.notas}
          onChange={(e) => set({ notas: e.target.value })}
        />
        <FormActions
          onCancel={onClose}
          saving={saving}
          submitLabel={isEditing ? "Guardar cambios" : "Crear agendamiento"}
        />
      </form>
    </Drawer>
  )
}
