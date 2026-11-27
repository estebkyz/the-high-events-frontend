export type TipoIncidente =
  | "falla_electrica"
  | "corte_agua"
  | "dano_equipo"
  | "inconveniente_proveedor"
  | "retraso_montaje"
  | "seguridad_orden_publico"
  | "emergencia_medica"
  | "otro"

export type Criticidad = "Baja" | "Media" | "Alta" | "Crítica"

/** ENUM('reportado','en_atencion','solucionado','escalado') */
export type EstadoIncidente = "Reportado" | "En Atención" | "Solucionado" | "Escalado"

export interface IncidenteItem {
  id: string
  codigo: string
  titulo: string
  evento: string
  evento_id?: number
  reporta: string
  reportado_por_id?: number
  tipo_incidente: TipoIncidente
  criticidad: Criticidad
  fecha: string
  estado: EstadoIncidente
  descripcion: string
  /** Bitácora: una línea por acción (ver `bitacora.ts`). */
  acciones_tomadas?: string
  resuelto_en?: string
}

export type IncidenteForm = Pick<
  IncidenteItem,
  | "titulo"
  | "evento"
  | "evento_id"
  | "reporta"
  | "reportado_por_id"
  | "tipo_incidente"
  | "criticidad"
  | "descripcion"
>

export interface AccionIncidente {
  fecha: string
  responsable: string
  estado: EstadoIncidente
  accion: string
}

export type AccionForm = Omit<AccionIncidente, "fecha">
