import type { EstadoActivo, TipoDocumento } from "@/constants/common"

export type TipoCliente = "Empresa" | "Natural"

export interface ClienteItem {
  id: string
  tipo_cliente: TipoCliente
  razon_social?: string
  primer_nombre?: string
  segundo_nombre?: string
  primer_apellido?: string
  segundo_apellido?: string
  contacto_nombre?: string
  tipo_documento: TipoDocumento
  numero_documento: string
  correo: string
  telefono: string
  direccion: string
  estado: EstadoActivo
  fecha_creacion?: string
}

export type ClienteForm = Omit<ClienteItem, "id">
