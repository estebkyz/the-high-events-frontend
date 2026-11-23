import React from "react"
import { Send, CheckCircle, XCircle, FileText, AlertTriangle } from "lucide-react"
import type { CotizacionItem, EstadoCotizacion } from "./types"

export const INITIAL_QUOTES: CotizacionItem[] = []

export const ALL_CLIENTS = ["Todos"]

export const ESTADO_ORDER: EstadoCotizacion[] = [
  "Borrador",
  "Enviada",
  "Aceptada",
  "Rechazada",
  "Vencida",
]

export const ESTADO_TIMELINE: Record<
  EstadoCotizacion,
  {
    icon: React.ElementType
    color: string
    label: string
  }
> = {
  Borrador: { icon: FileText, color: "text-[#94A3B8]", label: "Borrador" },
  Enviada: { icon: Send, color: "text-[#3B82F6]", label: "Enviada al cliente" },
  Aceptada: { icon: CheckCircle, color: "text-[#10B981]", label: "Aceptada" },
  Rechazada: { icon: XCircle, color: "text-[#EF4444]", label: "Rechazada" },
  Vencida: { icon: AlertTriangle, color: "text-[#64748B]", label: "Vencida" },
}

export const ESTADO_COTIZACION_OPTIONS: {
  label: string
  value: EstadoCotizacion
}[] = [
  { label: "Borrador", value: "Borrador" },
  { label: "Enviada", value: "Enviada" },
  { label: "Aceptada", value: "Aceptada" },
  { label: "Rechazada", value: "Rechazada" },
  { label: "Vencida", value: "Vencida" },
]

export const ESTADO_FILTER_OPTIONS = [
  { label: "Todos los Estados", value: "Todos" },
  ...ESTADO_COTIZACION_OPTIONS,
]
