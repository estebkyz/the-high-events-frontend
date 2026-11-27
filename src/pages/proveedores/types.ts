import type { EstadoActivo } from "@/constants/common"

export interface Contratacion {
  evento: string
  fecha: string
  monto: string
  estado: string
  modalidadPago?: string
  actaRecepcion?: string
}

export interface ProveedorItem {
  id: string
  nit_documento: string
  razon_social: string
  contacto_primer_nombre: string
  contacto_segundo_nombre?: string
  contacto_primer_apellido: string
  contacto_segundo_apellido?: string
  telefono: string
  correo: string
  /** Servicios y personal especializado. */
  servicios: string[]
  /** Equipos e insumos técnicos alquilados (sujetos a acta de recepción). */
  equipos: string[]
  estado: EstadoActivo
  contratosCount: number
  historial: Contratacion[]
  fecha_creacion?: string
}

export type ProveedorForm = Omit<
  ProveedorItem,
  "id" | "contratosCount" | "historial" | "fecha_creacion"
> & {
  /** Al guardar, continúa con el alta de un equipo alquilado. No se envía a la API. */
  registrar_equipo: boolean
}
