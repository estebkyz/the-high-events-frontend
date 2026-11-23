import type { ProveedorItem } from "./types"

export const INITIAL_PROVIDERS: ProveedorItem[] = []

/** Servicios y Personal Especializado (prestaciones operativas o artísticas por personal externo) */
export const ALL_SERVICIOS = [
  "DJ",
  "Show de Artistas",
  "Fotografía",
  "Producción Audiovisual",
  "Técnicos de Sonido/Luces",
  "Personal de Logística",
  "Streaming",
  "Catering",
]

/** Equipos e Insumos Técnicos (recursos físicos alquilados sujetos a Acta de Entrega y Recepción) */
export const ALL_EQUIPOS_PROVEEDOR = [
  "Sistemas de Sonido Profesional",
  "Torres de Iluminación",
  "Cabezas Móviles LED",
  "Pantallas LED",
  "Estructuras Truss",
  "Efectos Especiales",
  "Máquinas de Chispa Fría / CO2",
  "Consolas Digitales",
  "Menaje y Mobiliario",
]

export const ESTADO_OPTIONS = [
  { label: "Activo", value: "Activo" },
  { label: "Inactivo", value: "Inactivo" },
]

export const ESTADO_FILTER_OPTIONS = [
  { label: "Todos los Estados", value: "Todos" },
  ...ESTADO_OPTIONS,
]
