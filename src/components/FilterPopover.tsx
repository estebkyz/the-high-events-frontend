import React, { useState, useRef, useEffect } from "react"
import { SlidersHorizontal, RotateCcw, X } from "lucide-react"

export interface FilterPopoverProps {
  activeCount?: number
  onReset?: () => void
  children: React.ReactNode
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
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
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
      {/* ── Filter Trigger Button ── */}
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
        className={`h-[36px] px-3.5 rounded-xl text-[13px] font-medium flex items-center gap-2 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] ${
          activeCount > 0 || isOpen
            ? "bg-[#7C3AED]/15 text-[#F1F5F9] shadow-sm shadow-[#7C3AED]/20"
            : "bg-[#1A1D23] text-[#94A3B8] hover:text-[#F1F5F9]"
        }`}
        title="Filtrar datos"
      >
        <SlidersHorizontal
          size={13}
          className={activeCount > 0 ? "text-[#A78BFA]" : "text-[#64748B]"}
          aria-hidden="true"
        />
        <span>Filtrar</span>
        {activeCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-[#7C3AED] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
            {activeCount}
          </span>
        )}
      </button>

      {/* ── Filter Dropdown Popover ── */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Panel de filtros"
          className="absolute right-0 top-full mt-2 z-50 w-72 sm:w-80 bg-[#1A1D23] border border-[#2D3748] rounded-2xl shadow-2xl p-4 text-xs space-y-4 animate-in fade-in duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2D3748] pb-2.5">
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal size={13} className="text-[#A78BFA]" />
              <span className="font-semibold text-[13px] text-[#F1F5F9]">
                Filtros
              </span>
              {activeCount > 0 && (
                <span className="text-[11px] text-[#A78BFA] font-medium">
                  ({activeCount} activo{activeCount > 1 ? "s" : ""})
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {activeCount > 0 && onReset && (
                <button
                  type="button"
                  onClick={onReset}
                  className="text-[11px] text-[#94A3B8] hover:text-[#F1F5F9] flex items-center gap-1 transition-colors cursor-pointer"
                  title="Restablecer filtros"
                >
                  <RotateCcw size={10} />
                  <span>Limpiar</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-[#64748B] hover:text-[#F1F5F9] hover:bg-[#2D3748] transition-colors cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          </div>

          {/* Filter Body Controls */}
          <div className="space-y-3.5">{children}</div>

          {/* Footer action */}
          <div className="pt-2 border-t border-[#2D3748] flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[12px] font-semibold transition-all cursor-pointer text-center"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
