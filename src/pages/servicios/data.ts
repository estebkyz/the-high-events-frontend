import React from "react"
import {
  Music,
  Lightbulb,
  Monitor,
  Theater,
  Camera,
  Video,
  Package,
  Disc,
} from "lucide-react"
import type { ServicioItem, TipoCobroServicio } from "./types"

export const CATEGORY_CONFIG: Record<string, {
  icon: React.ElementType; color: string
}> = {
  Sonido: { icon: Music, color: "text-[#3B82F6]" },
  Iluminación: { icon: Lightbulb, color: "text-[#F59E0B]" },
  Pantallas: { icon: Monitor, color: "text-[#EC4899]" },
  DJ: { icon: Disc, color: "text-[#A78BFA]" },
  Fotografía: { icon: Camera, color: "text-[#10B981]" },
  Video: { icon: Video, color: "text-[#6366F1]" },
  Escenografía: { icon: Theater, color: "text-[#F97316]" },
  Logística: { icon: Package, color: "text-[#94A3B8]" },
}

export const CATEGORIES = Object.keys(CATEGORY_CONFIG)

export const ESTADO_SERVICIOS_OPTIONS: ("Activo" | "Inactivo")[] = ["Activo", "Inactivo"]

export const TIPO_COBRO_OPTIONS: { value: TipoCobroServicio; label: string }[] = [
  { value: "por_evento", label: "Por Evento" },
  { value: "por_hora", label: "Por Hora" },
  { value: "por_dia", label: "Por Día" },
  { value: "por_persona", label: "Por Persona" },
  { value: "tarifa_fija", label: "Tarifa Fija" },
]

export const INITIAL_SERVICES: ServicioItem[] = [
  {
    id: "1",
    nombre: "Sonido Pro Line Array (hasta 1.000 pax)",
    categoria: "Sonido",
    tipo_cobro: "por_evento",
    descripcion:
      'Sistema de audio completo con arreglos colgados y subs de 18", ideal para eventos grandes al aire libre.',
    precioBase: "$ 4.500.000",
    precioBaseNum: 4500000,
    estado: "Activo",
  },
  {
    id: "2",
    nombre: "Sonido Compacto (hasta 300 pax)",
    categoria: "Sonido",
    tipo_cobro: "por_evento",
    descripcion:
      "Sistema JBL PRX con amplificación y consola digital de 32 canales para eventos medios.",
    precioBase: "$ 1.800.000",
    precioBaseNum: 1800000,
    estado: "Activo",
  },
  {
    id: "3",
    nombre: "Show de Luces Robóticas Beam/Spot 350W",
    categoria: "Iluminación",
    tipo_cobro: "por_evento",
    descripcion:
      "8 cabezas móviles programadas DMX, hazer y control de iluminación en tiempo real.",
    precioBase: "$ 3.200.000",
    precioBaseNum: 3200000,
    estado: "Activo",
  },
  {
    id: "4",
    nombre: "Iluminación Arquitectónica LED",
    categoria: "Iluminación",
    tipo_cobro: "por_evento",
    descripcion:
      "Wash LED RGBW para iluminación de fondos y escenarios, incluye barras LED de piso.",
    precioBase: "$ 1.400.000",
    precioBaseNum: 1400000,
    estado: "Activo",
  },
  {
    id: "5",
    nombre: "Pantalla LED P3.9 Outdoor (4×3 m)",
    categoria: "Pantallas",
    tipo_cobro: "por_dia",
    descripcion:
      "Pantalla modular de alta resolución con procesador Novastar, soporta señal 4K.",
    precioBase: "$ 5.000.000",
    precioBaseNum: 5000000,
    estado: "Activo",
  },
  {
    id: "6",
    nombre: "Pantalla de Proyección HD (8×4 m)",
    categoria: "Pantallas",
    tipo_cobro: "por_dia",
    descripcion:
      "Retroproyector láser 20.000 lúmenes con pantalla tensada y sistema de rigging.",
    precioBase: "$ 2.600.000",
    precioBaseNum: 2600000,
    estado: "Inactivo",
  },
  {
    id: "7",
    nombre: "DJ Profesional + Set Pioneer CDJ-3000",
    categoria: "DJ",
    tipo_cobro: "por_hora",
    descripcion:
      "Show de DJ en vivo de hasta 6 horas con equipo Pioneer de alto nivel y repertorio personalizado.",
    precioBase: "$ 1.800.000",
    precioBaseNum: 1800000,
    estado: "Activo",
  },
  {
    id: "8",
    nombre: "Cobertura Fotográfica Evento Completo",
    categoria: "Fotografía",
    tipo_cobro: "por_evento",
    descripcion:
      "Fotógrafo profesional, edición en 48 h, galería en línea con 500 fotos entregadas.",
    precioBase: "$ 2.200.000",
    precioBaseNum: 2200000,
    estado: "Activo",
  },
  {
    id: "9",
    nombre: "Producción de Video Corporativo",
    categoria: "Video",
    tipo_cobro: "tarifa_fija",
    descripcion:
      "Cámara Cinema 4K, edición con color grading, entrega en formato web y broadcast.",
    precioBase: "$ 3.800.000",
    precioBaseNum: 3800000,
    estado: "Activo",
  },
  {
    id: "10",
    nombre: "Escenografía Modular Premium",
    categoria: "Escenografía",
    tipo_cobro: "por_evento",
    descripcion:
      "Estructura de truss Q30, tarima modular 8×6 m con acabado en vinilo, 3 m de altura.",
    precioBase: "$ 6.200.000",
    precioBaseNum: 6200000,
    estado: "Activo",
  },
  {
    id: "11",
    nombre: "Logística y Transporte de Equipos",
    categoria: "Logística",
    tipo_cobro: "por_evento",
    descripcion:
      "Flete con camión de 3 toneladas, cargue y descargue incluidos, cobertura Bogotá y alrededores.",
    precioBase: "$ 800.000",
    precioBaseNum: 800000,
    estado: "Activo",
  },
]
