import { splitDateTime } from "@/pages/eventos/schedule"
import type { EventoItem } from "@/pages/eventos/types"
import type { AgendaToCotizacionState } from "@/routes/navigationState"
import { ESTADO_STYLES, EVENTO_STYLE } from "./constants"
import type { AgendaEntry, AgendaEvent } from "./types"
import { parseISO } from "./utils"

/**
 * Calendario: las reuniones agendadas más todos los eventos del módulo de Eventos.
 * Los eventos no se copian a la agenda: crear, reprogramar o cancelar uno se ve solo.
 */
export function buildAgenda(citas: AgendaEvent[], eventos: EventoItem[]): AgendaEntry[] {
  return [...citas, ...eventos.flatMap(eventoToEntry)]
}

/** Un evento en cotización sin fecha todavía no aparece en el calendario. */
function eventoToEntry(evento: EventoItem): AgendaEntry[] {
  const [date, time] = splitDateTime(evento.hora_inicio)
  if (!date) return []
  return [
    {
      id: `evento-${evento.id}`,
      tipo_agendamiento: "evento",
      title: evento.nombre,
      ...parseISO(date),
      time,
      client: evento.cliente_nombre,
      estado: evento.estado,
      venue: evento.direccion,
      evento_id: evento.id,
    },
  ]
}

/** Un evento se distingue de las reuniones; estas se colorean por estado. */
export function getEntryStyle({ tipo_agendamiento, estado }: AgendaEntry) {
  if (estado === "Cancelado") return ESTADO_STYLES.Cancelado
  if (tipo_agendamiento === "evento") return EVENTO_STYLE
  return ESTADO_STYLES[estado as AgendaEvent["estado"]]
}

/** Datos de la reunión que precargan una cotización. */
export function reunionToCotizacion(reunion: AgendaEvent): AgendaToCotizacionState {
  return {
    fromAgenda: true,
    clientName: reunion.client,
    clientId: reunion.cliente_id,
    fechaTentativa: reunion.fechaTentativaEvento,
    tipoEvento: reunion.tipoEventoTentativo,
    lugar: reunion.lugarTentativo,
    notas: reunion.notas,
  }
}
