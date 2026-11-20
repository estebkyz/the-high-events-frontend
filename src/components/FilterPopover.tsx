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
        className={`h-[36px] px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] ${
          activeCount > 0 || isOpen
            ? "bg-[#7C3AED]/15 border-[#7C3AED]/50 text-[#F1F5F9] shadow-xs"
            : "bg-[#181B22] border-[#262D3D] text-[#CBD5E1] hover:border-[#3B455A] hover:text-[#F1F5F9]"
        }`}
        title="Filtrar registros"
      >
        <SlidersHorizontal
          size={13}
          className={activeCount > 0 ? "text-[#A78BFA]" : "text-[#94A3B8]"}
          aria-hidden="true"
        />
        <span>Filtrar</span>
        {activeCount > 0 && (
          <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#7C3AED] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
            {activeCount}
          </span>
        )}
      </button>

      {/* ── Filter Dropdown Popover ── */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Panel de filtros"
          className="absolute right-0 top-full mt-2 z-50 w-72 sm:w-80 bg-[#181B22] border border-[#262D3D] rounded-2xl shadow-2xl p-4 text-xs space-y-4 animate-in fade-in duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#262D3D] pb-2.5">
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
                  className="text-[11px] text-[#A78BFA] hover:text-[#C4B5FD] flex items-center gap-1 transition-colors cursor-pointer font-medium"
                  title="Restablecer filtros"
                >
                  <RotateCcw size={10} />
                  <span>Restablecer</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#222734] transition-colors cursor-pointer"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Filter Body Controls */}
          <div className="space-y-3.5">{children}</div>

          {/* Footer action */}
          <div className="pt-2.5 border-t border-[#262D3D] flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold transition-all cursor-pointer text-center"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
