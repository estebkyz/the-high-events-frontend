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
import type { ServicioItem, TipoCobroServicio, CategoriaServicioItem } from "./types"

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

export const INITIAL_CATEGORIAS_SERVICIO: CategoriaServicioItem[] = []

export const CATEGORIES = Object.keys(CATEGORY_CONFIG)

export const ESTADO_SERVICIOS_OPTIONS: ("Activo" | "Inactivo")[] = ["Activo", "Inactivo"]

export const TIPO_COBRO_OPTIONS: { value: TipoCobroServicio; label: string }[] = [
  { value: "por_evento", label: "Por Evento" },
  { value: "por_hora", label: "Por Hora" },
  { value: "por_dia", label: "Por Día" },
  { value: "por_persona", label: "Por Persona" },
  { value: "tarifa_fija", label: "Tarifa Fija" },
]

export const INITIAL_SERVICES: ServicioItem[] = []
