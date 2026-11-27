import type { EmpleadoItem } from "@/pages/empleados/types"
import { getEmpleadoFullName } from "@/pages/empleados/utils"
import { todayISO } from "@/utils/format"
import { EQUIPOS_PROPIOS, ESTADOS_RECEPCION } from "./constants"
import type {
  DevolucionForm,
  EstadoRecepcion,
  Recepcion,
  RecepcionEquipo,
  RecepcionForm,
} from "./types"

export const EMPTY_ITEM: RecepcionEquipo = {
  nombre: "",
  cantidad: 1,
  estado: "Bueno",
  observaciones: "",
  evidencia_foto: "",
}

export const EMPTY_RECEPCION: RecepcionForm = {
  evento: "",
  responsable: "",
  proveedor: "",
  tipo: "Recepción Montaje",
  fecha: "",
  observaciones: "",
  estado: "Pendiente",
  items: [EMPTY_ITEM],
}

export const EMPTY_DEVOLUCION: DevolucionForm = {
  responsable: "",
  observaciones: "",
  items: [],
}

/** Guarda nombre e id: dos empleados pueden llamarse igual. */
export function seleccionarResponsable(
  nombre: string,
  empleados: EmpleadoItem[],
): Pick<RecepcionForm, "responsable" | "responsable_id"> {
  const match = empleados.find((e) => getEmpleadoFullName(e) === nombre)
  return { responsable: nombre, responsable_id: match && Number(match.id) }
}

export function recepcionToForm(item: Recepcion): RecepcionForm {
  return { ...item, proveedor: getOrigen(item) }
}

/** De quién son los equipos del acta. */
export function getOrigen({ proveedor }: Pick<Recepcion, "proveedor">): string {
  return proveedor || EQUIPOS_PROPIOS
}

const conNombre = (items: RecepcionEquipo[]) => items.filter((it) => it.nombre.trim())

export function validateRecepcion(form: RecepcionForm): string | null {
  if (!form.evento) return "El evento es obligatorio"
  if (!form.proveedor) return "Indica el origen de los equipos"
  if (!form.responsable) return "El empleado responsable es obligatorio"
  if (!form.fecha) return "La fecha de verificación es obligatoria"
  if (conNombre(form.items).length === 0) return "Debes incluir al menos un equipo"
  return null
}

export function normalizeRecepcion(form: RecepcionForm): RecepcionForm {
  return {
    ...form,
    proveedor: form.proveedor === EQUIPOS_PROPIOS ? "" : form.proveedor,
    observaciones: form.observaciones.trim(),
    items: conNombre(form.items).map((it) => ({
      ...it,
      nombre: it.nombre.trim(),
      cantidad: Math.max(1, it.cantidad),
    })),
  }
}

const CONFIRMADOS: EstadoRecepcion[] = ["Conforme", "Con Novedades", "Cerrada"]
const confirmada = ({ estado }: Recepcion) => CONFIRMADOS.includes(estado)

/** Devolución en borrador que el sistema dejó lista para este montaje. */
export function devolucionPendiente(
  origen: Recepcion,
  recepciones: Recepcion[],
): Recepcion | undefined {
  return recepciones.find(
    (r) => r.parentCodigo === origen.codigo && r.estado === "Pendiente",
  )
}

/** Un montaje ya verificado que aún no tiene su devolución confirmada. */
export function admiteDevolucion(
  recepcion: Recepcion,
  recepciones: Recepcion[],
): boolean {
  return (
    recepcion.tipo === "Recepción Montaje" &&
    confirmada(recepcion) &&
    !recepciones.some((r) => r.parentCodigo === recepcion.codigo && confirmada(r))
  )
}

/** El regreso a bodega ya confirmado cerró su préstamo: no cambia. */
export function esDefinitiva(recepcion: Recepcion): boolean {
  return (
    recepcion.tipo === "Recepción Desmontaje" &&
    !recepcion.proveedor &&
    confirmada(recepcion)
  )
}

export function estadosDisponibles(recepcion: Recepcion): EstadoRecepcion[] {
  return esDefinitiva(recepcion) ? CONFIRMADOS : ESTADOS_RECEPCION
}

export function devolucionInicial(origen: Recepcion): DevolucionForm {
  return {
    responsable: origen.responsable,
    responsable_id: origen.responsable_id,
    observaciones: "",
    items: origen.items.map(({ equipo_id, nombre, cantidad }) => ({
      equipo_id,
      nombre,
      cantidad,
      estado: "Bueno",
    })),
  }
}

export function nuevaDevolucion(
  origen: Recepcion,
  form: DevolucionForm,
): Partial<Recepcion> {
  return {
    evento: origen.evento,
    evento_id: origen.evento_id,
    proveedor: origen.proveedor,
    responsable: form.responsable,
    responsable_id: form.responsable_id,
    tipo: "Recepción Desmontaje",
    fecha: todayISO(),
    estado: "Cerrada",
    parentCodigo: origen.codigo,
    observaciones: form.observaciones.trim(),
    items: form.items,
  }
}
