import type { Fase } from "@/pages/tareas/types"

export type ModalidadEvento = "Cliente" | "Propio"

export type EstadoEvento =
  | "Cotización"
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

/** Préstamo o recepción del evento; se gestiona en su módulo. */
export interface EventoDocumento {
  tipo: "prestamo" | "recepcion"
  id: string
  codigo: string
  titulo: string
  estado: string
  equipos: number
}

export interface EventoItem {
  id: string
  /** Empleado a cargo de los préstamos, recepciones y pagos. Vacío en eventos antiguos. */
  responsable_id: string
  responsable_nombre?: string
  cliente_id: string | null
  cliente_nombre: string
  /** Cotización que fijó el valor (o la más reciente); solo lectura: la cotización apunta al evento. */
  cotizacion_id: string | null
  cotizacion_codigo: string
  modalidad: ModalidadEvento
  nombre: string
  direccion: string
  /** `YYYY-MM-DDTHH:mm`; vacío mientras el evento está en cotización. */
  hora_inicio: string
  /** `YYYY-MM-DDTHH:mm` */
  hora_fin: string
  /** Lo que la empresa espera gastar. */
  presupuesto_estimado: number
  /** Valor real del evento: lo acordado con el cliente o lo que se espera vender. */
  valor_total?: number
  estado: EstadoEvento
  fecha_creacion: string
  aforo_esperado?: string
  concepto_evento?: string
  observaciones?: string
  servicios: string[]
  serviciosDetalles?: ServicioEvento[]
  empleadosAsignados?: EmpleadoAsignado[]
  equiposAsignados?: string[]
  documentos?: EventoDocumento[]
  /** Diferencias entre el evento y sus documentos ya confirmados. */
  avisos?: string[]
}

export interface EventoForm extends Omit<
  EventoItem,
  "id" | "fecha_creacion" | "responsable_nombre" | "documentos" | "avisos"
> {
  /** Evento de la cotización aceptada que se está completando (al crear un evento de cliente). */
  id?: string
  aforo_esperado: string
  concepto_evento: string
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
