export interface Contratacion {
  evento: string
  fecha: string
  monto: string
  estado: string
  modalidadPago?: "Anticipo 50% Pagado" | "Liquidado 100% (50% + 50%)" | "Pendiente Anticipo"
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
  /** Servicios y Personal Especializado (DJs, artistas, fotógrafos, técnicos, logística, producción audiovisual) */
  servicios: string[]
  /** Equipos e Insumos Técnicos alquilados sujetos a Formato Digital de Entrega y Recepción (montaje/desmontaje) */
  equipos: string[]
  estado: "Activo" | "Inactivo"
  contratosCount: number
  historial: Contratacion[]
  fecha_creacion?: string
}

export type ProveedorDrawerMode = "none" | "view" | "edit" | "create"
export type ProveedorViewTab = "info" | "historial"
export type ProveedorFormData = Partial<ProveedorItem>
