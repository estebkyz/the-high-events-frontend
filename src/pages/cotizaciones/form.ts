import type { AgendaToCotizacionState } from "@/routes/navigationState"
import { formatCOP, parseCOP, todayISO } from "@/utils/format"
import type { ServicioItem } from "@/pages/servicios/types"
import type { CotizacionForm, CotizacionItem } from "./types"

export const EMPTY_COTIZACION: CotizacionForm = {
  cliente: "",
  asesor: "",
  nombre_evento: "",
  fecha_evento: "",
  direccion: "",
  hora_inicio: "",
  hora_fin: "",
  aforo_esperado: undefined,
  fecha: "",
  fechaVence: "",
  servicios: [],
  montos: [],
  total: formatCOP(0),
  totalNum: 0,
  notas: "",
  items: [],
}

export function emptyCotizacionHoy(): CotizacionForm {
  return { ...EMPTY_COTIZACION, fecha: todayISO() }
}

/** Precarga desde una cita o visita técnica de Agendamiento. */
export function cotizacionDesdeAgenda(state: AgendaToCotizacionState): CotizacionForm {
  const cliente = state.clientName ?? ""
  return {
    ...emptyCotizacionHoy(),
    cliente,
    nombre_evento: state.tipoEvento ? `${state.tipoEvento} - ${cliente}` : "",
    fecha_evento: state.fechaTentativa ?? "",
    direccion: state.lugar ?? "",
    notas: state.notas ? `Referencia de reunión: ${state.notas}` : "",
  }
}

export function cotizacionToForm(item: CotizacionItem): CotizacionForm {
  return { ...item, servicios: item.servicios ?? [], montos: item.montos ?? [] }
}

export function validateCotizacion(form: CotizacionForm): string | null {
  if (!form.cliente.trim()) return "El cliente es obligatorio"
  if (!form.asesor?.trim()) return "El empleado responsable es obligatorio"
  if (!form.nombre_evento.trim()) return "El nombre del evento es obligatorio"
  if (form.servicios.length === 0) return "Agrega al menos un servicio"
  if (!form.fecha || !form.fechaVence) {
    return "Las fechas de emisión y vencimiento son obligatorias"
  }
  if (form.fechaVence < form.fecha) {
    return "El vencimiento no puede ser anterior a la emisión"
  }
  if ((form.hora_inicio || form.hora_fin) && !form.fecha_evento) {
    return "Indica la fecha del evento para registrar su horario"
  }
  return null
}

function conServicios(servicios: string[], montos: string[]): Partial<CotizacionForm> {
  const totalNum = montos.reduce((sum, monto) => sum + parseCOP(monto), 0)
  return { servicios, montos, totalNum, total: formatCOP(totalNum) }
}

export function agregarServicio(
  form: CotizacionForm,
  servicio: ServicioItem,
): Partial<CotizacionForm> {
  if (form.servicios.includes(servicio.nombre)) return {}
  return conServicios(
    [...form.servicios, servicio.nombre],
    [...form.montos, servicio.precioBase],
  )
}

export function quitarServicio(
  form: CotizacionForm,
  index: number,
): Partial<CotizacionForm> {
  return conServicios(
    form.servicios.filter((_, i) => i !== index),
    form.montos.filter((_, i) => i !== index),
  )
}
