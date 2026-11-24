import type { EmpleadoItem } from "@/pages/empleados/types"
import { getEmpleadoFullName } from "@/pages/empleados/utils"
import { todayISO } from "@/utils/format"
import type { DevolucionForm, Recepcion, RecepcionEquipo, RecepcionForm } from "./types"

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

const conNombre = (items: RecepcionEquipo[]) => items.filter((it) => it.nombre.trim())

export function validateRecepcion(form: RecepcionForm): string | null {
  if (!form.evento) return "El evento es obligatorio"
  if (!form.proveedor) return "El proveedor es obligatorio"
  if (!form.responsable) return "El empleado responsable es obligatorio"
  if (!form.fecha) return "La fecha de verificación es obligatoria"
  if (conNombre(form.items).length === 0) return "Debes incluir al menos un equipo"
  return null
}

export function normalizeRecepcion(form: RecepcionForm): RecepcionForm {
  return {
    ...form,
    observaciones: form.observaciones.trim(),
    items: conNombre(form.items).map((it) => ({
      ...it,
      nombre: it.nombre.trim(),
      cantidad: Math.max(1, it.cantidad),
    })),
  }
}

/** Solo un acta de montaje ya verificada admite devolución. */
export function admiteDevolucion(recepcion: Recepcion): boolean {
  return (
    recepcion.tipo === "Recepción Montaje" &&
    ["Conforme", "Con Novedades", "Cerrada"].includes(recepcion.estado)
  )
}

export function devolucionInicial(origen: Recepcion): DevolucionForm {
  return {
    responsable: origen.responsable,
    responsable_id: origen.responsable_id,
    observaciones: "",
    items: origen.items.map(({ nombre, cantidad }) => ({
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
