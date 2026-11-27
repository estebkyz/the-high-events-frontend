import { formatCOP, parseCOP } from "@/utils/format"
import type { ServicioForm } from "./types"

export const EMPTY_SERVICIO: ServicioForm = {
  nombre: "",
  categoria: "",
  tipo_cobro: "por_evento",
  descripcion: "",
  precioBase: "",
  estado: "Activo",
}

export function validateServicio(form: ServicioForm): string | null {
  if (!form.nombre.trim()) return "El nombre del servicio es obligatorio"
  if (!form.categoria) return "La categoría es obligatoria"
  if (parseCOP(form.precioBase) <= 0) return "El precio base debe ser mayor a cero"
  return null
}

export function normalizeServicio(form: ServicioForm): ServicioForm {
  const precioBaseNum = parseCOP(form.precioBase)
  return {
    ...form,
    nombre: form.nombre.trim(),
    descripcion: form.descripcion.trim(),
    precioBase: formatCOP(precioBaseNum),
    precioBaseNum,
  }
}
