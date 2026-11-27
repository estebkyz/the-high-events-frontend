export type StatusTone = "success" | "warning" | "danger" | "info" | "accent" | "neutral"

export interface ToneClasses {
  bg: string
  text: string
  dot: string
}

// Las clases se escriben completas (no con plantillas) para que Tailwind las detecte.
export const TONE_CLASSES: Record<StatusTone, ToneClasses> = {
  success: { bg: "bg-ok-soft", text: "text-ok-ink", dot: "bg-ok" },
  warning: { bg: "bg-warn-soft", text: "text-warn-ink", dot: "bg-warn" },
  danger: { bg: "bg-danger-soft", text: "text-danger-ink", dot: "bg-danger" },
  info: { bg: "bg-info-soft", text: "text-info-ink", dot: "bg-info" },
  accent: { bg: "bg-brand-soft", text: "text-brand-ink", dot: "bg-brand" },
  neutral: { bg: "bg-neutral-soft", text: "text-ink-soft", dot: "bg-ink-muted" },
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
    "Afuera",
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
    "No disponible",
    "Inactivo",
  ],
  info: [
    "Reportado",
    "Enviada",
    "Cotización",
    "Planificación",
    "Programado",
    "Natural",
    "Cliente Externo",
    "Admin",
    "Entrega",
    "Recepción Montaje",
    "En Evento",
    "Reservado",
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
