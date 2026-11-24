import { useEffect, useEffectEvent, useId, useRef, type ReactNode } from "react"
import { X } from "lucide-react"

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  /** `side`: panel lateral (detalle). `center`: modal (formularios y confirmaciones). */
  position?: "side" | "center"
  /** Pie fijo, siempre visible. */
  footer?: ReactNode
}

const OVERLAY = {
  side: "flex items-end sm:items-stretch sm:justify-end",
  center: "flex items-center justify-center p-3.5 sm:p-5",
}

const PANEL = {
  side: "w-full sm:w-[400px] max-h-[84vh] sm:max-h-full sm:h-full border-t sm:border-t-0 sm:border-l border-[#262D3D] rounded-t-3xl sm:rounded-none",
  center:
    "w-full max-w-[620px] max-h-[86vh] border border-[var(--section-border)] rounded-2xl",
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  position = "side",
  footer,
}: DrawerProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)

  /** Con varios diálogos abiertos, solo responde el de encima. */
  const isTopmost = () => {
    const dialogs = document.querySelectorAll('[role="dialog"][aria-modal="true"]')
    return dialogs[dialogs.length - 1] === dialogRef.current
  }

  const trapFocus = (e: KeyboardEvent) => {
    const items = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE)
    if (!items?.length) return
    const first = items[0]
    const last = items[items.length - 1]
    const isInside = dialogRef.current?.contains(document.activeElement)
    if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
      e.preventDefault()
      ;(e.shiftKey ? last : first).focus()
    } else if (!isInside) {
      e.preventDefault()
      first.focus()
    }
  }

  const handleKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (!isTopmost()) return
    if (e.key === "Escape") onClose()
    if (e.key === "Tab") trapFocus(e)
  })

  useEffect(() => {
    if (!isOpen) return
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    const onKeyDown = (e: KeyboardEvent) => handleKeyDown(e)

    document.body.style.overflow = "hidden"
    if (!dialogRef.current?.contains(previousFocus)) dialogRef.current?.focus()
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] animate-fade-in focus:outline-none ${OVERLAY[position]}`}
    >
      <div aria-hidden="true" className="fixed inset-0 -z-10" onClick={onClose} />
      <div
        className={`bg-[#181B22] flex flex-col shadow-2xl shadow-black/40 overflow-hidden ${PANEL[position]}`}
      >
        <div className="px-5 py-3.5 flex items-center justify-between gap-2 shrink-0">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-[15px] font-semibold text-[#F1F5F9] truncate leading-tight"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-[11.5px] text-[#94A3B8] mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#222734] transition-colors cursor-pointer shrink-0"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4 overscroll-contain">
          {children}
        </div>
        {footer && (
          <div className="shrink-0 border-t border-[#2D3748]/70 px-5 py-3">{footer}</div>
        )}
      </div>
    </div>
  )
}
