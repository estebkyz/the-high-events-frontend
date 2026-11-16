import React from "react"

interface StatusBadgeProps {
  status: string
  className?: string
  border?: boolean
}

export function StatusBadge({ status, className = "", border = true }: StatusBadgeProps) {
  const normalized = status.trim()

  let colorClasses = "bg-[#6B7280]/20 text-[#94A3B8]" // default gray
  let borderClasses = "border-[#6B7280]/30"

  // Green
  if (
    [
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
    ].includes(normalized)
  ) {
    colorClasses = "bg-[#10B981]/15 text-[#10B981]"
    borderClasses = ""
  }
  // Amber / Orange
  else if (
    [
      "Pendiente",
      "En proceso",
      "En Préstamo",
      "Media",
      "En Atención",
      "En Revisión",
      "En Ejecución",
      "En Producción",
      "Planificación",
      "Montaje",
      "Desmontaje",
      "Prueba de Sonido",
      "Pendiente Verificación",
      "Pendiente Anticipo",
      "Con Novedad",
      "Observada",
      "Parcial",
      "Por Evento",
      "Regular",
      "Urgente",
    ].includes(normalized)
  ) {
    colorClasses = "bg-[#F59E0B]/15 text-[#F59E0B]"
    borderClasses = ""
  }
  // Red
  else if (
    [
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
    ].includes(normalized)
  ) {
    colorClasses = "bg-[#EF4444]/15 text-[#EF4444]"
    borderClasses = ""
  }
  // Blue
  else if (
    [
      "Reportado",
      "Enviada",
      "Cotización",
      "Natural",
      "Cliente Externo",
      "Admin",
      "Entrega",
      "Recepcion Montaje",
    ].includes(normalized)
  ) {
    colorClasses = "bg-[#3B82F6]/15 text-[#3B82F6]"
    borderClasses = ""
  }
  // Violet / Purple
  else if (
    [
      "Cerrada",
      "Cerrado",
      "Cerrado Financiero",
      "Empresa",
      "Operador",
      "Financiero",
      "Super Admin",
      "Comercial",
      "Devolución",
      "Recepcion Desmontaje",
    ].includes(normalized)
  ) {
    colorClasses = "bg-[#7C3AED]/15 text-[#A78BFA]"
    borderClasses = ""
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium ${colorClasses} ${className}`}
    >
      {status}
    </span>
  )
}
