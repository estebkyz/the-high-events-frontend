import { todayISO } from "@/utils/format"
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

/** Un préstamo vigente o atrasado puede devolverse. */
export function admiteDevolucion(prestamo: PrestamoItem): boolean {
  return prestamo.estado === "Activo" || prestamo.estado === "Con Retraso"
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
