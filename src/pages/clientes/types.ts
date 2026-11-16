export type TipoCliente = "Empresa" | "Natural"
export type TipoDocumentoCliente = "NIT" | "CC" | "CE" | "Pasaporte"

export interface ClienteItem {
  id: string; tipo_cliente: TipoCliente
  razon_social?: string
  primer_nombre?: string
  segundo_nombre?: string
  primer_apellido?: string
  segundo_apellido?: string
  contacto_nombre?: string
  tipo_documento: TipoDocumentoCliente
  numero_documento: string
  correo: string
  telefono: string
  direccion: string
  ciudad: string
  estado: string // 'Activo' | 'Inactivo'
  fecha_creacion?: string
}

export interface HistorialItem {
  referencia: string; tipo: string
  fecha: string
  monto: string
  estado: string
}

export type ClienteDrawerMode = "view" | "create" | "edit"

export type ClienteFormData = Partial<ClienteItem>
