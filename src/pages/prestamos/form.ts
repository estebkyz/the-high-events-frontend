import type { RangoFechas } from "@/pages/equipos/types"
import type { EventoItem } from "@/pages/eventos/types"
import { nowLocal, todayISO } from "@/utils/format"
import { ESTADOS_PRESTAMO } from "./constants"
import type {
  DevolucionPrestamoForm,
  PrestamoEstado,
  PrestamoForm,
  PrestamoItem,
} from "./types"

export const EMPTY_PRESTAMO: PrestamoForm = {
  responsable: "",
  evento: "",
  equipos: [],
  fechaSalida: "",
  fechaDevolucion: "",
  observaciones_entrega: "",
}

export const EMPTY_DEVOLUCION: DevolucionPrestamoForm = {
  fecha: "",
  observaciones: "",
  condiciones: {},
}

export function validatePrestamo(form: PrestamoForm): string | null {
  if (!form.responsable) return "El empleado responsable es obligatorio"
  if (!form.evento) return "El evento es obligatorio"
  if (!form.fechaSalida || !form.fechaDevolucion) return "Las fechas son obligatorias"
  if (form.fechaDevolucion < form.fechaSalida) {
    return "La devolución no puede ser anterior a la salida"
  }
  if (form.equipos.length === 0) return "Debes seleccionar al menos un equipo"
  return null
}

/** Desde ahora hasta la devolución; si vuelve el día del evento, se libera al terminar. */
export function rangoPrestamo(
  form: PrestamoForm,
  eventos: EventoItem[],
): RangoFechas | null {
  if (!form.fechaDevolucion) return null
  const evento = eventos.find((e) => e.id === String(form.evento_id))
  const inicio = nowLocal().replace(" ", "T")
  const fin = evento?.hora_fin.startsWith(form.fechaDevolucion)
    ? evento.hora_fin
    : `${form.fechaDevolucion}T23:59`
  return fin > inicio ? { inicio, fin } : null
}

const enCurso = ({ estado, fecha_devolucion_real }: PrestamoItem) =>
  (estado === "Activo" || estado === "Con Retraso") && !fecha_devolucion_real

/** Un borrador espera que alguien confirme que los equipos salieron de bodega. */
export function admiteSalida(prestamo: PrestamoItem): boolean {
  return prestamo.estado === "Programado"
}

/** Vigente o atrasado. Con recepción, la devolución se registra allí. */
export function admiteDevolucion(prestamo: PrestamoItem): boolean {
  return enCurso(prestamo) && !prestamo.recepcion
}

/** Estados a los que se puede pasar desde la tabla. */
export function estadosDisponibles(prestamo: PrestamoItem): PrestamoEstado[] {
  if (admiteSalida(prestamo)) return ["Programado", "Activo"]
  if (!prestamo.recepcion) return ESTADOS_PRESTAMO.filter((e) => e !== "Programado")
  return enCurso(prestamo) ? ["Activo", "Con Retraso"] : []
}

export function devolucionInicial(prestamo: PrestamoItem): DevolucionPrestamoForm {
  return {
    fecha: todayISO(),
    observaciones: "",
    condiciones: Object.fromEntries(prestamo.equipos.map((eq) => [eq.id, "Bueno"])),
  }
}

export function validateDevolucion(
  form: DevolucionPrestamoForm,
  prestamo: PrestamoItem,
): string | null {
  if (!form.fecha) return "La fecha de devolución es obligatoria"
  if (form.fecha < prestamo.fechaSalida) {
    return "La devolución no puede ser anterior a la salida"
  }
  return null
}

function estadoAlDevolver(
  prestamo: PrestamoItem,
  form: DevolucionPrestamoForm,
): PrestamoEstado {
  const tieneDanos = Object.values(form.condiciones).includes("Dañado")
  if (tieneDanos) return "Con Daños"
  return form.fecha > prestamo.fechaDevolucion ? "Con Retraso" : "Devuelto"
}

export function devolucionToChanges(
  prestamo: PrestamoItem,
  form: DevolucionPrestamoForm,
): Partial<PrestamoItem> & { estado: PrestamoEstado } {
  return {
    estado: estadoAlDevolver(prestamo, form),
    fecha_devolucion_real: form.fecha,
    observaciones_devolucion: form.observaciones.trim() || undefined,
    equipos: prestamo.equipos.map((eq) => ({
      ...eq,
      condicionRetorno: form.condiciones[eq.id],
    })),
  }
}
