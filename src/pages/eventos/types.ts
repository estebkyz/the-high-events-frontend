import type { Fase } from "@/pages/tareas/types"

export type ModalidadEvento = "Cliente" | "Propio"

export type EstadoEvento =
  | "Planificación"
  | "Confirmado"
  | "Montaje"
  | "En ejecución"
  | "Desmontaje"
  | "Finalizado"
  | "Cerrado financiero"
  | "Cancelado"

export interface EmpleadoAsignado {
  empleado_id: string
  nombre: string
  cargo: string
  tarea_id: string
  nombre_tarea: string
  fase: Fase
  estado: "Pendiente" | "En proceso" | "Completada"
}

export interface ServicioEvento {
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

export interface EventoItem {
  id: string
  cliente_id: string | null
  cliente_nombre: string
  /** `null` en eventos propios (columna opcional en la BD). */
  cotizacion_id: string | null
  cotizacion_codigo: string
  modalidad: ModalidadEvento
  nombre: string
  direccion: string
  /** `YYYY-MM-DDTHH:mm` */
  hora_inicio: string
  /** `YYYY-MM-DDTHH:mm` */
  hora_fin: string
  presupuesto_estimado: number
  estado: EstadoEvento
  fecha_creacion: string
  aforo_esperado?: string
  concepto_espectaculo?: string
  publico_objetivo?: string
  observaciones?: string
  servicios: string[]
  serviciosDetalles?: ServicioEvento[]
  empleadosAsignados?: EmpleadoAsignado[]
  equiposAsignados?: string[]
}

export interface EventoForm extends Omit<
  EventoItem,
  "id" | "fecha_creacion" | "publico_objetivo"
> {
  aforo_esperado: string
  concepto_espectaculo: string
  observaciones: string
  serviciosDetalles: ServicioEvento[]
  empleadosAsignados: EmpleadoAsignado[]
  equiposAsignados: string[]
}

/** Props comunes de las secciones del formulario. */
export interface EventoSectionProps {
  form: EventoForm
  onChange: (changes: Partial<EventoForm>) => void
}
