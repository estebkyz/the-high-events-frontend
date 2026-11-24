export type StatusTone = "success" | "warning" | "danger" | "info" | "accent" | "neutral"

export interface ToneClasses {
  bg: string
  text: string
  hoverBg: string
}

// Las clases se escriben completas (no con plantillas) para que Tailwind las detecte.
export const TONE_CLASSES: Record<StatusTone, ToneClasses> = {
  success: {
    bg: "bg-[#10B981]/15",
    text: "text-[#34D399]",
    hoverBg: "hover:bg-[#10B981]/25",
  },
  warning: {
    bg: "bg-[#F59E0B]/15",
    text: "text-[#FBBF24]",
    hoverBg: "hover:bg-[#F59E0B]/25",
  },
  danger: {
    bg: "bg-[#EF4444]/15",
    text: "text-[#F87171]",
    hoverBg: "hover:bg-[#EF4444]/25",
  },
  info: {
    bg: "bg-[#3B82F6]/15",
    text: "text-[#60A5FA]",
    hoverBg: "hover:bg-[#3B82F6]/25",
  },
  accent: {
    bg: "bg-[#7C3AED]/15",
    text: "text-[#A78BFA]",
    hoverBg: "hover:bg-[#7C3AED]/25",
  },
  neutral: {
    bg: "bg-[#6B7280]/20",
    text: "text-[#94A3B8]",
    hoverBg: "hover:bg-[#6B7280]/25",
  },
}

/**
 * Registro único estado → tono, compartido por `StatusBadge`, `TableStatusSelect`
 * y `DetailStatusPicker`. Un estado nuevo se agrega solo aquí.
 */
const GRUPOS: Record<Exclude<StatusTone, "neutral">, string[]> = {
  success: [
    "Activo",
    "Aceptada",
    "Firmada",
    "Disponible",
    "Completada",
    "Completado",
    "Pagado",
    "Devuelto",
    "Resuelto",
    "Solucionado",
    "Confirmado",
    "Confirmada",
    "Conforme",
    "Cumplida",
    "Liquidada",
    "Realizado",
    "Excelente",
    "Bueno",
    "Exitosa",
    "Fijo",
    "Propio",
    "Baja",
    "Finalizado",
  ],
  warning: [
    "Pendiente",
    "En proceso",
    "En Préstamo",
    "Prestado",
    "Media",
    "En Atención",
    "En Revisión",
    "En Ejecución",
    "En Producción",
    "Montaje",
    "Desmontaje",
    "Prueba de sonido",
    "Pendiente Verificación",
    "Pendiente Anticipo",
    "Con Novedad",
    "Con Novedades",
    "Observada",
    "Parcial",
    "Por Evento",
    "Regular",
    "Urgente",
    "En Mantenimiento",
  ],
  danger: [
    "Cancelado",
    "Cancelada",
    "Vencido",
    "Vencida",
    "Rechazada",
    "Rechazado",
    "Mantenimiento",
    "Alta",
    "Crítica",
    "Dañado",
    "Con Daños",
    "Con Retraso",
    "Bloqueada",
    "Escalado",
    "Abierto",
    "Fallida",
    "Anulada",
    "De Baja",
    "Inactivo",
  ],
  info: [
    "Reportado",
    "Enviada",
    "Cotización",
    "Planificación",
    "Natural",
    "Cliente Externo",
    "Admin",
    "Entrega",
    "Recepción Montaje",
    "En Evento",
  ],
  accent: [
    "Cerrada",
    "Cerrado",
    "Cerrado financiero",
    "Empresa",
    "Operador",
    "Financiero",
    "Super Admin",
    "Comercial",
    "Devolución",
    "Recepción Desmontaje",
  ],
}

const normalizar = (estado: string) => estado.trim().toLowerCase()

const REGISTRO = new Map<string, StatusTone>(
  (Object.keys(GRUPOS) as (keyof typeof GRUPOS)[]).flatMap((tone) =>
    GRUPOS[tone].map((estado): [string, StatusTone] => [normalizar(estado), tone]),
  ),
)

/** Un estado desconocido es "neutral": se muestra gris en vez de romper la vista. */
export function getStatusTone(status: string): StatusTone {
  return REGISTRO.get(normalizar(status)) ?? "neutral"
}

export function getStatusClasses(status: string): ToneClasses {
  return TONE_CLASSES[getStatusTone(status)]
}
