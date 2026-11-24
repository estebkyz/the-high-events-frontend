import type { ClienteItem } from "@/pages/clientes/types"
import { getClienteName } from "@/pages/clientes/utils"
import type { EventoItem } from "@/pages/eventos/types"
import { todayISO } from "@/utils/format"
import { ACTIVIDADES, MODALIDAD_CITA_OPTIONS } from "./constants"
import type { AgendaEvent, AgendaForm, TipoAgendamiento } from "./types"
import { getEventISO, isReunion, parseISO } from "./utils"

export const EMPTY_AGENDA: AgendaForm = {
  tipo_agendamiento: "evento",
  title: "",
  motivo: ACTIVIDADES.evento[0],
  time: "10:00",
  dateISO: "",
  client: "",
  estado: "Pendiente",
  venue: "",
  modalidadCita: MODALIDAD_CITA_OPTIONS[0].value,
  notas: "",
  fechaTentativaEvento: "",
  tipoEventoTentativo: "",
  lugarTentativo: "",
}

export function agendaToForm(event: AgendaEvent): AgendaForm {
  const { title, time, client, cliente_id, evento_id, cotizacion_id } = event
  return {
    ...EMPTY_AGENDA,
    title,
    time,
    client,
    cliente_id,
    evento_id,
    cotizacion_id,
    tipo_agendamiento: event.tipo_agendamiento,
    motivo: event.motivo ?? ACTIVIDADES[event.tipo_agendamiento][0],
    estado: event.estado,
    dateISO: getEventISO(event),
    venue: event.venue ?? "",
    modalidadCita: event.modalidadCita ?? EMPTY_AGENDA.modalidadCita,
    notas: event.notas ?? "",
    fechaTentativaEvento: event.fechaTentativaEvento ?? "",
    tipoEventoTentativo: event.tipoEventoTentativo ?? "",
    lugarTentativo: event.lugarTentativo ?? "",
  }
}

export function cambiarTipo(tipo: TipoAgendamiento): Partial<AgendaForm> {
  return { tipo_agendamiento: tipo, motivo: ACTIVIDADES[tipo][0] }
}

export function seleccionarCliente(
  nombre: string,
  clientes: ClienteItem[],
): Partial<AgendaForm> {
  const cliente = clientes.find((c) => getClienteName(c) === nombre)
  return { client: nombre, cliente_id: cliente?.id }
}

/** El agendamiento de un evento hereda nombre, cliente, fecha y lugar. */
export function aplicarEvento(evento: EventoItem): Partial<AgendaForm> {
  const [date, time] = (evento.hora_inicio || "").split("T")
  return {
    evento_id: evento.id,
    title: evento.nombre,
    client: evento.cliente_nombre,
    cliente_id: evento.cliente_id ?? undefined,
    cotizacion_id: evento.cotizacion_id ?? undefined,
    venue: evento.direccion,
    ...(date && { dateISO: date }),
    ...(time && { time: time.slice(0, 5) }),
  }
}

export function validateAgenda(form: AgendaForm): string | null {
  if (!form.title.trim()) return "El asunto es obligatorio"
  if (!form.client.trim()) return "El cliente es obligatorio"
  if (!form.dateISO || !form.time) return "La fecha y la hora son obligatorias"
  if (form.dateISO < todayISO() && form.estado === "Pendiente") {
    return "No se puede agendar como pendiente en una fecha pasada"
  }
  return null
}

const optional = (value: string) => value.trim() || undefined

export function agendaToPayload(form: AgendaForm): Omit<AgendaEvent, "id"> {
  const { dateISO, ...data } = form
  const reunion = isReunion(form)
  return {
    ...data,
    ...parseISO(dateISO),
    title: form.title.trim(),
    client: form.client.trim(),
    venue: reunion ? undefined : optional(form.venue),
    modalidadCita: reunion ? form.modalidadCita : undefined,
    notas: optional(form.notas),
    fechaTentativaEvento: reunion ? optional(form.fechaTentativaEvento) : undefined,
    tipoEventoTentativo: reunion ? optional(form.tipoEventoTentativo) : undefined,
    lugarTentativo: reunion ? optional(form.lugarTentativo) : undefined,
  }
}
