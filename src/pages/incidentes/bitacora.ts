import { nowLocal } from "@/utils/format"
import { ESTADOS_INCIDENTE } from "./constants"
import type { AccionForm, AccionIncidente, EstadoIncidente } from "./types"

const SEPARATOR = " | "

const clean = (text: string) => text.replace(/[|\n]/g, " ").trim()

const toEstado = (text: string): EstadoIncidente =>
  ESTADOS_INCIDENTE.find((estado) => estado === text) ?? "En Atención"

/** Agrega una línea `fecha | responsable | estado | acción` a la bitácora. */
export function appendAccion(bitacora: string | undefined, form: AccionForm): string {
  const line = [
    nowLocal(),
    clean(form.responsable) || "Sin responsable",
    form.estado,
    clean(form.accion),
  ].join(SEPARATOR)
  return bitacora ? `${bitacora}\n${line}` : line
}

export function parseBitacora(bitacora: string | undefined): AccionIncidente[] {
  return (bitacora ?? "")
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => {
      const [fecha, responsable, estado, ...accion] = line.split(SEPARATOR)
      // Texto libre anterior a este formato: se muestra tal cual.
      if (accion.length === 0) {
        return { fecha: "", responsable: "", estado: "En Atención", accion: line }
      }
      return {
        fecha,
        responsable,
        estado: toEstado(estado),
        accion: accion.join(SEPARATOR),
      }
    })
}
