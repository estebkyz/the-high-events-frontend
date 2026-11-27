import type { ProveedorToEquipoState } from "@/routes/navigationState"
import type { EquipoForm, TipoPropiedadEquipo } from "./types"

export const EMPTY_EQUIPO: EquipoForm = {
  nombre: "",
  serie: "",
  categoria: "",
  estadoOperativo: "Disponible",
  propiedad: "Propio",
  proveedor_id: null,
}

/** Equipo alquilado que se registra desde su proveedor. */
export function equipoDeProveedor(state: ProveedorToEquipoState): Partial<EquipoForm> {
  return {
    propiedad: "Alquilado",
    proveedor_id: Number(state.proveedorId),
    proveedor_nombre: state.proveedorNombre,
  }
}

export function validateEquipo(form: EquipoForm): string | null {
  if (!form.nombre.trim()) return "El nombre del equipo es obligatorio"
  if (!form.serie.trim()) return "El número de serie es obligatorio"
  if (!form.categoria) return "La categoría es obligatoria"
  if (form.propiedad === "Alquilado" && !form.proveedor_nombre?.trim()) {
    return "Para un equipo alquilado debes seleccionar el proveedor que lo suministra"
  }
  return null
}

export function normalizeEquipo(form: EquipoForm): EquipoForm {
  return {
    ...form,
    nombre: form.nombre.trim(),
    serie: form.serie.trim(),
    ...(form.propiedad === "Propio" && clearedByPropiedad("Propio")),
  }
}

/** Campos que dejan de aplicar al cambiar el tipo de propiedad. */
export function clearedByPropiedad(propiedad: TipoPropiedadEquipo): Partial<EquipoForm> {
  return propiedad === "Propio"
    ? { proveedor_id: null, proveedor_nombre: undefined, costo_alquiler: undefined }
    : { costo_adquisicion: undefined }
}
