export type TipoIncidente =
  | "falla_electrica"
  | "corte_agua"
  | "dano_equipo"
  | "inconveniente_proveedor"
  | "retraso_montaje"
  | "seguridad_orden_publico"
  | "emergencia_medica"
  | "otro"

export const TIPO_INCIDENTE_LABELS: Record<TipoIncidente, string> = {
  falla_electrica: "Falla Eléctrica",
  corte_agua: "Corte de Agua",
  dano_equipo: "Daño en Equipo",
  inconveniente_proveedor: "Inconveniente con Proveedor",
  retraso_montaje: "Retraso en Montaje",
  seguridad_orden_publico: "Seguridad u Orden Público",
  emergencia_medica: "Emergencia Médica",
  otro: "Otro",
}

export type Criticidad = "Baja" | "Media" | "Alta" | "Crítica"

// Mapped exactly to MySQL Workbench: ENUM('reportado','en_atencion','solucionado','escalado')
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
  areaAfectada?: string
  accionCorrectiva?: string
  acciones_tomadas?: string
  costo_adicional?: number
  resuelto_en?: string
}

export interface HistoryEntry {
  id: string
  accion: string
  responsable: string
  estado: EstadoIncidente
  timestamp: string
  tipo: "initial" | "action"
}

export type IncidenteFormData = Partial<IncidenteItem>
