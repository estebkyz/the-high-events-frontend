export type ModalidadEvento = "Cliente" | "Propio"

export type EstadoEvento = "Planificación" | "Confirmado" | "Montaje" | "En ejecución" | "Desmontaje" | "Finalizado" | "Cerrado financiero" | "Cancelado"

export type FaseTareaEvento = "Planificación" | "Montaje" | "Ejecución" | "Desmontaje"

export interface EmpleadoTareaAsignada {
  empleado_id: string; nombre: string
  cargo: string
  tarea_id: string
  nombre_tarea: string
  fase: FaseTareaEvento
  estado: "Pendiente" | "En proceso" | "Completada"
}

export interface ServicioDetalleEvento {
  id: string
  servicio_catalogo_id?: string
  nombre: string
  categoria: string
  observaciones: string
  costo: string
  cantidad?: number
  proveedor_id?: string
  proveedor_nombre?: string
}

export interface CotizacionCatalogoItem {
  id: string
  codigo: string
  cliente_id: string
  cliente_nombre: string
  nombre_evento: string
  fecha_evento: string
  fecha_emision?: string
  fecha_vencimiento?: string
  direccion: string
  hora_inicio: string
  hora_fin: string
  aforo_esperado: number
  observaciones?: string
  servicios: string[]
  total: number
  desc: string
  estado: string
}

export interface EquipoCatalogoItem {
  id: string
  codigo: string
  nombre: string
  categoria: string
  disponible: boolean
  propiedad: "Propio" | "Alquilado"
  proveedor_id?: string
  proveedor_nombre?: string
}

export interface EventoItem {
  id: string
  cliente_id: string | null
  cliente_nombre: string
  cotizacion_id: string
  cotizacion_codigo: string
  modalidad: ModalidadEvento
  nombre: string
  direccion: string
  hora_inicio: string // YYYY-MM-DDTHH:mm (DATETIME)
  hora_fin: string // YYYY-MM-DDTHH:mm (DATETIME)
  presupuesto_estimado: number
  estado: EstadoEvento
  fecha_creacion: string
  aforo_esperado?: string
  concepto_espectaculo?: string
  publico_objetivo?: string
  observaciones?: string
  servicios: string[]
  serviciosDetalles?: ServicioDetalleEvento[]
  empleadosAsignados?: EmpleadoTareaAsignada[]
  equiposAsignados?: string[]
}

export const ESTADOS_EVENTO: EstadoEvento[] = [
  "Planificación",
  "Confirmado",
  "Montaje",
  "En ejecución",
  "Desmontaje",
  "Finalizado",
  "Cerrado financiero",
  "Cancelado",
]

export const FASES_TAREA: FaseTareaEvento[] = [
  "Planificación",
  "Montaje",
  "Ejecución",
  "Desmontaje",
]

export type AsignacionEmpleado = {
  checked: boolean; tarea_id: string
  fase: FaseTareaEvento
}

/** Selección de personal del formulario, indexada por id de empleado. */
export type AsignacionesMap = Record<string, AsignacionEmpleado>

export type EventoFormValues = Partial<EventoItem>
