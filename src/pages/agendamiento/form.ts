import type { ClienteItem } from "@/pages/clientes/types"
import { getClienteName } from "@/pages/clientes/utils"
import { todayISO } from "@/utils/format"
import { MOTIVO_OPTIONS } from "./constants"
import type { AgendaEvent, AgendaForm } from "./types"
import { getEventISO, parseISO } from "./utils"

export const EMPTY_AGENDA: AgendaForm = {
  tipo_agendamiento: "reunion_cliente",
  title: "",
  motivo: MOTIVO_OPTIONS[0].value,
  time: "10:00",
  timeEnd: "11:00",
  dateISO: "",
  client: "",
  estado: "Pendiente",
  responsable_id: "",
  notas: "",
  fechaTentativaEvento: "",
  tipoEventoTentativo: "",
  lugarTentativo: "",
}

export function agendaToForm(event: AgendaEvent): AgendaForm {
  const { title, time, client, estado, cliente_id, evento_id, tipo_agendamiento } = event
  return {
    ...EMPTY_AGENDA,
    tipo_agendamiento,
    title,
    time,
    timeEnd: event.timeEnd ?? "",
    client,
    estado,
    cliente_id,
    evento_id,
    responsable_id: event.responsable_id ?? "",
    dateISO: getEventISO(event),
    motivo: event.motivo ?? EMPTY_AGENDA.motivo,
    notas: event.notas ?? "",
    fechaTentativaEvento: event.fechaTentativaEvento ?? "",
    tipoEventoTentativo: event.tipoEventoTentativo ?? "",
    lugarTentativo: event.lugarTentativo ?? "",
  }
}

export function seleccionarCliente(
  nombre: string,
  clientes: ClienteItem[],
): Partial<AgendaForm> {
  const cliente = clientes.find((c) => getClienteName(c) === nombre)
  return { client: nombre, cliente_id: cliente?.id }
}

export function validateAgenda(form: AgendaForm): string | null {
  // Sobre un evento, el cliente es el del evento
  if (!form.evento_id && !form.client.trim()) return "El cliente es obligatorio"
  if (!form.title.trim()) return "El asunto es obligatorio"
  if (!form.dateISO || !form.time) return "La fecha y la hora son obligatorias"
  if (form.timeEnd && form.timeEnd < form.time) {
    return "La hora de fin no puede ser anterior a la de inicio"
  }
  if (form.dateISO < todayISO() && form.estado === "Pendiente") {
    return "No se puede agendar como pendiente en una fecha pasada"
  }
  return null
}

const optional = (value: string) => value.trim() || undefined

export function agendaToPayload(form: AgendaForm): Omit<AgendaEvent, "id"> {
  const { dateISO, ...data } = form
  return {
    ...data,
    ...parseISO(dateISO),
    title: form.title.trim(),
    client: form.client.trim(),
    timeEnd: optional(form.timeEnd),
    responsable_id: optional(form.responsable_id ?? ""),
    notas: optional(form.notas),
    fechaTentativaEvento: optional(form.fechaTentativaEvento),
    tipoEventoTentativo: optional(form.tipoEventoTentativo),
    lugarTentativo: optional(form.lugarTentativo),
  }
}
