import type { ClienteItem, HistorialItem } from "./types"

export const HISTORIAL: Record<string, HistorialItem[]> = {
  "1": [
    {
      referencia: "COT-8040",
      tipo: "Cotización",
      fecha: "Sep 2026",
      monto: "$ 12.200.000",
      estado: "Aceptada",
    },
    {
      referencia: "EVT-2026",
      tipo: "Evento",
      fecha: "Oct 2026",
      monto: "$ 45.000.000",
      estado: "Confirmado",
    },
  ],
  "2": [
    {
      referencia: "COT-8041",
      tipo: "Cotización",
      fecha: "Oct 2026",
      monto: "$ 18.500.000",
      estado: "Enviada",
    },
    {
      referencia: "EVT-2025",
      tipo: "Evento",
      fecha: "Ago 2025",
      monto: "$ 31.000.000",
      estado: "Completado",
    },
  ],
  "3": [
    {
      referencia: "COT-8039",
      tipo: "Cotización",
      fecha: "Sep 2026",
      monto: "$ 8.400.000",
      estado: "Aceptada",
    },
    {
      referencia: "EVT-2025",
      tipo: "Evento",
      fecha: "Nov 2025",
      monto: "$ 22.000.000",
      estado: "Completado",
    },
  ],
  "4": [
    {
      referencia: "COT-8038",
      tipo: "Cotización",
      fecha: "Sep 2026",
      monto: "$ 4.800.000",
      estado: "Borrador",
    },
  ],
  "5": [
    {
      referencia: "COT-8037",
      tipo: "Cotización",
      fecha: "Sep 2026",
      monto: "$ 6.000.000",
      estado: "Rechazada",
    },
  ],
  "6": [],
}

export const INITIAL_CLIENTS: ClienteItem[] = [
  {
    id: "1",
    tipo_cliente: "Empresa",
    razon_social: "Grupo Empresarial Norte S.A.S.",
    contacto_nombre: "Santiago Gómez — Dir. Eventos",
    tipo_documento: "NIT",
    numero_documento: "900.123.456-1",
    correo: "contacto@empresarialnorte.com",
    telefono: "+57 310 9876543",
    direccion: "Cra. 7 # 116-50 Of. 802",
    ciudad: "Bogotá",
    estado: "Activo",
  },
  {
    id: "2",
    tipo_cliente: "Empresa",
    razon_social: "TechCorp S.A.",
    contacto_nombre: "Mariana Duarte — Coordinadora",
    tipo_documento: "NIT",
    numero_documento: "800.555.222-9",
    correo: "eventos@techcorp.com",
    telefono: "+57 320 1112233",
    direccion: "Calle 10 # 43E-12",
    ciudad: "Medellín",
    estado: "Activo",
  },
  {
    id: "3",
    tipo_cliente: "Empresa",
    razon_social: "Colegio San José",
    contacto_nombre: "Padre Alberto Rivas",
    tipo_documento: "NIT",
    numero_documento: "860.001.999-4",
    correo: "admin@sanjose.edu.co",
    telefono: "+57 315 4445566",
    direccion: "Av. Circunvalar # 18-20",
    ciudad: "Cali",
    estado: "Activo",
  },
  {
    id: "4",
    tipo_cliente: "Natural",
    primer_nombre: "Carlos",
    segundo_nombre: "Eduardo",
    primer_apellido: "Rodríguez",
    segundo_apellido: "Silva",
    tipo_documento: "CC",
    numero_documento: "1018.442.102",
    correo: "rodriguez.eventos@gmail.com",
    telefono: "+57 300 7778899",
    direccion: "Calle 127 # 19-33 Apto 401",
    ciudad: "Bogotá",
    estado: "Activo",
  },
  {
    id: "5",
    tipo_cliente: "Empresa",
    razon_social: "Asociación Médica Colombiana",
    contacto_nombre: "Dra. Patricia Valderrama",
    tipo_documento: "NIT",
    numero_documento: "890.301.221-0",
    correo: "asociacion@medica.co",
    telefono: "+57 318 6661122",
    direccion: "Cra. 53 # 82-140",
    ciudad: "Barranquilla",
    estado: "Inactivo",
  },
  {
    id: "6",
    tipo_cliente: "Empresa",
    razon_social: "Constructora Andina S.A.S.",
    contacto_nombre: "Ing. Fernando Castro",
    tipo_documento: "NIT",
    numero_documento: "901.234.567-2",
    correo: "eventos@constructoraandina.com",
    telefono: "+57 312 3334455",
    direccion: "Av. Las Américas # 23-45",
    ciudad: "Pereira",
    estado: "Inactivo",
  },
]

export const TIPO_CLIENTE_OPTIONS = [
  { label: "Empresa", value: "Empresa" },
  { label: "Persona Natural", value: "Natural" },
]

export const TIPO_DOC_EMPRESA_OPTIONS = [
  { label: "NIT", value: "NIT" },
  { label: "Cédula de Extranjería (CE)", value: "CE" },
  { label: "Pasaporte", value: "Pasaporte" },
]

export const TIPO_DOC_NATURAL_OPTIONS = [
  { label: "Cédula de Ciudadanía (CC)", value: "CC" },
  { label: "Cédula de Extranjería (CE)", value: "CE" },
  { label: "Pasaporte", value: "Pasaporte" },
]

export const ESTADO_OPTIONS = [
  { label: "Activo", value: "Activo" },
  { label: "Inactivo", value: "Inactivo" },
]

export const ESTADO_FILTER_OPTIONS = [
  { label: "Todos los Estados", value: "Todos" },
  ...ESTADO_OPTIONS,
]
