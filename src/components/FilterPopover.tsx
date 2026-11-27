import { useEffect, useRef, useState, type ReactNode } from "react"
import { SlidersHorizontal, RotateCcw, X } from "lucide-react"
import { Button } from "./Button"

export interface FilterPopoverProps {
  activeCount?: number
  onReset?: () => void
  children: ReactNode
}

export function FilterPopover({
  activeCount = 0,
  onReset,
  children,
}: FilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* ── Filter Trigger Button (Shopify Polaris Style) ── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={`Filtrar datos${
          activeCount > 0
            ? `, ${activeCount} filtro${activeCount > 1 ? "s" : ""} activo${
                activeCount > 1 ? "s" : ""
              }`
            : ""
        }`}
        className={`btn btn-secondary ${activeCount > 0 || isOpen ? "!text-brand-ink" : ""}`}
        title="Filtrar registros"
      >
        <SlidersHorizontal size={13} className="shrink-0" aria-hidden="true" />
        <span>Filtrar</span>
        {activeCount > 0 && (
          <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-xs font-semibold flex items-center justify-center shrink-0">
            {activeCount}
          </span>
        )}
      </button>

      {/* ── Filter Dropdown Popover ── */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Panel de filtros"
          className="absolute right-0 top-full mt-2 z-50 w-72 sm:w-80 bg-surface rounded-xl shadow-popover p-4 text-[13px] space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal size={13} className="text-brand-ink" />
              <span className="font-semibold text-[13px] text-ink">Filtros</span>
              {activeCount > 0 && (
                <span className="text-xs text-brand-ink font-medium">
                  ({activeCount} activo{activeCount > 1 ? "s" : ""})
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {activeCount > 0 && onReset && (
                <button
                  type="button"
                  onClick={onReset}
                  className="text-xs text-brand-ink hover:text-brand-ink flex items-center gap-1 transition-colors cursor-pointer font-medium"
                  title="Restablecer filtros"
                >
                  <RotateCcw size={10} />
                  <span>Restablecer</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar filtros"
                className="icon-btn !size-7"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Filter Body Controls */}
          <div className="space-y-3.5">{children}</div>

          {/* Footer action */}
          <div className="pt-2.5 border-t border-line flex justify-end">
            <Button variant="primary" className="w-full" onClick={() => setIsOpen(false)}>
              Aplicar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
