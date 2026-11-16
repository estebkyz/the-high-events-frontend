import type { UsuarioItem } from "./types"

export const INITIAL_USERS: UsuarioItem[] = [
  {
    id: "1",
    tipo_documento: "CC",
    numero_documento: "1020.450.891",
    primer_nombre: "Esteban",
    segundo_nombre: "Darío",
    primer_apellido: "De León",
    segundo_apellido: "Castrillón",
    correo: "esteban@thehighevents.com",
    telefono: "+57 3112345678",
    rol: "Admin",
    ultimoAcceso: "Hoy, 10:45 AM",
    estado: "Activo",
    sesiones: [
      {
        fecha: "Hoy, 10:45 AM",
        ip: "181.12.90.14",
        dispositivo: "Chrome / Windows",
        resultado: "Exitosa",
      },
      {
        fecha: "Ayer, 08:30 PM",
        ip: "181.12.90.14",
        dispositivo: "Chrome / Windows",
        resultado: "Exitosa",
      },
      {
        fecha: "14 Oct, 03:15 PM",
        ip: "190.144.10.5",
        dispositivo: "Safari / iPhone",
        resultado: "Exitosa",
      },
    ],
  },
  {
    id: "2",
    tipo_documento: "CC",
    numero_documento: "1035.882.114",
    primer_nombre: "Laura",
    segundo_nombre: "Camila",
    primer_apellido: "Medina",
    segundo_apellido: "Ospina",
    correo: "laura@thehighevents.com",
    telefono: "+57 320 8901234",
    rol: "Financiero",
    ultimoAcceso: "Ayer, 4:20 PM",
    estado: "Activo",
    sesiones: [
      {
        fecha: "Ayer, 04:20 PM",
        ip: "190.144.10.5",
        dispositivo: "Edge / Windows",
        resultado: "Exitosa",
      },
      {
        fecha: "12 Oct, 09:10 AM",
        ip: "190.144.10.5",
        dispositivo: "Edge / Windows",
        resultado: "Exitosa",
      },
    ],
  },
  {
    id: "3",
    tipo_documento: "CC",
    numero_documento: "1017.654.321",
    primer_nombre: "Camilo",
    segundo_nombre: "Andrés",
    primer_apellido: "Serna",
    segundo_apellido: "García",
    correo: "camilo@thehighevents.com",
    telefono: "+57 315 7654321",
    rol: "Operador",
    ultimoAcceso: "12 Oct 2026",
    estado: "Activo",
    sesiones: [
      {
        fecha: "12 Oct, 11:00 AM",
        ip: "200.35.12.88",
        dispositivo: "Firefox / Android",
        resultado: "Exitosa",
      },
      {
        fecha: "12 Oct, 10:58 AM",
        ip: "200.35.12.88",
        dispositivo: "Firefox / Android",
        resultado: "Fallida",
      },
    ],
  },
  {
    id: "4",
    tipo_documento: "CE",
    numero_documento: "548.220.190",
    primer_nombre: "Mariana",
    segundo_nombre: "Lucía",
    primer_apellido: "Reyes",
    segundo_apellido: "Peña",
    correo: "mreyes@thehighevents.com",
    telefono: "+57 301 3456789",
    rol: "Comercial",
    ultimoAcceso: "01 Oct 2026",
    estado: "Inactivo",
    sesiones: [
      {
        fecha: "01 Oct, 09:00 AM",
        ip: "186.28.140.2",
        dispositivo: "Chrome / Windows",
        resultado: "Exitosa",
      },
    ],
  },
]

export const ROL_OPTIONS = [
  { label: "Administrador", value: "Admin" },
  { label: "Super Admin", value: "Super Admin" },
  { label: "Coordinador de Eventos", value: "Coordinador" },
  { label: "Financiero", value: "Financiero" },
  { label: "Operador Técnico", value: "Operador" },
  { label: "Comercial", value: "Comercial" },
]

export const TIPO_DOC_OPTIONS = [
  { label: "Cédula de Ciudadanía (CC)", value: "CC" },
  { label: "Cédula de Extranjería (CE)", value: "CE" },
  { label: "NIT", value: "NIT" },
  { label: "Pasaporte", value: "Pasaporte" },
]

export const ESTADO_OPTIONS = [
  { label: "Activo", value: "Activo" },
  { label: "Inactivo", value: "Inactivo" },
]

export const ROL_FILTER_OPTIONS = [
  { label: "Todos los Roles", value: "Todos" },
  ...ROL_OPTIONS,
]

export const ESTADO_FILTER_OPTIONS = [
  { label: "Todos los Estados", value: "Todos" },
  ...ESTADO_OPTIONS,
]
