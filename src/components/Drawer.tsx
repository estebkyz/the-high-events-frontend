import React, { useEffect, useMemo } from "react"
import { X } from "lucide-react"

export type DrawerSize = "detail" | "modal" | "sm" | "md" | "lg" | "xl" | "full"
export type DrawerPosition = "side" | "center"

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  /** Ancho personalizado o clase de Tailwind */
  width?: string
  /** Tamaño semántico: 'detail' (380px, compacto), 'sm' (360px), 'md' (440px), 'lg' (540px), 'xl' (640px) */
  size?: DrawerSize
  /** Posición: 'side' (panel lateral derecho) o 'center' (modal centrado en pantalla para crear/editar) */
  position?: DrawerPosition
  /** Contenido fijo opcional al pie del panel */
  footer?: React.ReactNode
}

const SIZE_CLASSES: Record<DrawerSize, string> = {
  sm: "sm:w-[360px] sm:max-w-[370px]",
  detail: "sm:w-[380px] sm:max-w-[395px]",
  modal: "sm:w-[460px] sm:max-w-[460px]",
  md: "sm:w-[440px] sm:max-w-[460px]",
  lg: "sm:w-[500px] sm:max-w-[520px]",
  xl: "sm:w-[560px] sm:max-w-[580px]",
  full: "sm:w-full sm:max-w-4xl",
}

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width,
  size = "detail",
  position,
  footer,
}: DrawerProps) {
  // Lock body scroll when drawer/sheet is open
  useEffect(() => {
    if (!isOpen) return
    const originalStyle = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Detección automática: Los drawers de crear/editar van en el centro; los de detalles son laterales
  const isCentered = useMemo(() => {
    if (position) return position === "center"
    if (size === "detail") return false
    if (size === "modal") return true

    const lower = title.toLowerCase()
    const isCreateOrEdit =
      lower.includes("crear") ||
      lower.includes("nuevo") ||
      lower.includes("nueva") ||
      lower.includes("registrar") ||
      lower.includes("editar") ||
      lower.includes("agregar") ||
      lower.includes("form") ||
      lower.includes("devolución") ||
      lower.includes("devolver")

    const isDetail =
      lower.includes("detalle") ||
      lower.includes("perfil") ||
      lower.includes("consulta") ||
      lower.includes("información") ||
      lower.includes("historial")

    if (isDetail && !isCreateOrEdit) return false
    if (isCreateOrEdit) return true

    return false
  }, [position, size, title])

  if (!isOpen) return null

  // Resolver ancho según modo:
  // Si está centrado (crear/editar): ancho compacto controlado (máx 460px) para que nunca se expanda a toda la pantalla
  // Si es lateral (detalle): ancho compacto de 380px
  const panelWidthClass = isCentered
    ? "w-full max-w-[550px]"
    : width
      ? `w-full ${width}`
      : SIZE_CLASSES[size || "detail"]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      className={
        isCentered
          ? "fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-5 bg-black/40 dark:bg-black/60 backdrop-blur-[2px] transition-opacity animate-fade-in"
          : "fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end bg-black/30 dark:bg-black/45 backdrop-blur-[1.5px] transition-opacity animate-fade-in"
      }
    >
      {/* Backdrop clickable */}
      <div
        className="fixed inset-0 -z-10 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Centrado (Crear/Editar) o Panel Lateral (Detalles) */}
      <div
        className={
          isCentered
            ? `${panelWidthClass} max-h-[82vh] bg-[#181B22] border border-[var(--section-border)] rounded-2xl flex flex-col shadow-2xl shadow-black/50 overflow-hidden transition-all duration-200 animate-in fade-in zoom-in-95`
            : `w-full ${panelWidthClass} max-w-full max-h-[84vh] sm:max-h-full h-auto sm:h-full bg-[#181B22] border-t sm:border-t-0 sm:border-l border-[#262D3D] rounded-t-3xl sm:rounded-none flex flex-col shadow-2xl shadow-black/30 overflow-hidden transition-all duration-300 ease-out`
        }
      >
        {/* Mobile Drag Handle Indicator (solo en mobile para side sheet) */}
        {!isCentered && (
          <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-[#111318] shrink-0">
            <div
              className="w-10 h-1 bg-[#475569] rounded-full"
              aria-hidden="true"
            />
          </div>
        )}

        {/* Drawer Header (Compact & Crisp) */}
        <div className="px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between shrink-0">
          <div className="min-w-0 pr-2">
            <h2
              id="drawer-title"
              className="text-[14.5px] sm:text-[15px] font-semibold text-[#F1F5F9] truncate leading-tight"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-[11px] sm:text-[11.5px] text-[#94A3B8] mt-0.5 truncate leading-tight">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel"
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#222734] active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 sm:space-y-4 overscroll-contain">
          {children}
        </div>

        {/* Drawer Optional Footer */}
        {footer && (
          <div className="shrink-0 border-t border-[#2D3748]/70 bg-[#181B22] px-4 sm:px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
