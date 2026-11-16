import React, { useState, useRef, useEffect, useId } from "react"
import { ChevronDown, Plus, Check } from "lucide-react"

export interface SelectOption {
  label: string; value: string
  badge?: string
  sublabel?: string
}

interface CustomSelectProps {
  label?: React.ReactNode
  required?: boolean
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  searchable?: boolean
  allowCreate?: boolean
  createLabel?: string
  onCreate?: (searchQuery: string) => void
  disabled?: boolean
  className?: string
  id?: string
  error?: string
  clearOnSelect?: boolean
}

/**
 * Selector desplegable con la estética solicitada:
 * - Separador vertical antes del icono de flecha hacia abajo `| v`.
 * - Desplegable flotante estilizado con bordes redondeados y sombra suave.
 * - Modo buscador interactivo (`searchable`).
 * - Opción de creación dinámica si no se encuentra el elemento (`allowCreate`).
 */
export function CustomSelect({
  label,
  required = false,
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  searchable = false,
  allowCreate = false,
  createLabel,
  onCreate,
  disabled = false,
  className = "",
  id,
  error,
  clearOnSelect = false,
}: CustomSelectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const generatedId = useId()
  const selectId = id || generatedId

  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Encontrar opción actualmente seleccionada
  const selectedOption = options.find((opt) => opt.value === value)

  // Cerrar al hacer clic fuera del componente
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSearchQuery("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Filtrar opciones por búsqueda
  const filteredOptions = options.filter((opt) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase().trim()
    return (
      opt.label.toLowerCase().includes(q) ||
      (opt.sublabel && opt.sublabel.toLowerCase().includes(q)) ||
      (opt.badge && opt.badge.toLowerCase().includes(q))
    )
  })

  const handleSelect = (val: string) => {
    onChange?.(val)
    if (clearOnSelect) {
      setSearchQuery("")
    } else {
      const match = options.find((o) => o.value === val)
      setSearchQuery(match ? match.label : "")
    }
    setIsOpen(false)
  }

  const handleCreate = () => {
    onCreate?.(searchQuery.trim())
    setIsOpen(false)
    setSearchQuery("")
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 flex items-center">
          <span>{label}</span>
          {required && (
            <span
              className="text-[#EF4444] ml-1 text-sm leading-none"
              title="Campo obligatorio"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}
      {/* Contenedor del selector con el separador vertical antes de la flecha */}
      <div
        id={selectId}
        onClick={() => {
          if (disabled) return
          setIsOpen((prev) => !prev)
          if (!isOpen && searchable) {
            setTimeout(() => inputRef.current?.focus(), 50)
          }
        }}
        className={`w-full h-[42px] px-3.5 bg-[#111318] border ${
          error
            ? "border-[#EF4444]"
            : isOpen
              ? "border-[#7C3AED] ring-2 ring-[#7C3AED]/20"
              : "border-[var(--field-border)] hover:border-[#3B455A]"
        } rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer select-none ${
          disabled ? "opacity-50 cursor-not-allowed bg-[#111318]/50" : ""
        }`}
      >
        {/* Contenido / Input de búsqueda */}
        <div className="flex-1 min-w-0 pr-2">
          {searchable ? (
            <input
              ref={inputRef}
              type="text"
              disabled={disabled}
              placeholder={selectedOption ? selectedOption.label : placeholder}
              value={
                isOpen
                  ? searchQuery
                  : selectedOption
                    ? selectedOption.label
                    : ""
              }
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (!isOpen) setIsOpen(true)
              }}
              onFocus={() => {
                if (!isOpen) setIsOpen(true)
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-transparent text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none cursor-text truncate"
            />
          ) : (
            <span
              className={`block truncate ${
                selectedOption ? "text-[#F8FAFC] font-medium" : "text-[#64748B]"
              }`}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          )}
        </div>

        {/* Separador vertical característico y flecha hacia abajo */}
        <div className="flex items-center shrink-0 pl-1">
          <div className="w-[1px] h-4 bg-[#262D3D] mr-2.5" />
          <ChevronDown
            size={14}
            className={`text-[#94A3B8] transition-transform duration-200 ${
              isOpen ? "rotate-180 text-[#7C3AED]" : ""
            }`}
          />
        </div>
      </div>

      {/* Menú desplegable flotante */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#181B22] border border-[#262D3D] rounded-xl shadow-2xl shadow-black/80 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="max-h-60 overflow-y-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value
                return (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`px-3.5 py-2.5 text-xs transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? "bg-[#7C3AED]/15 text-[#A78BFA] font-medium"
                        : "text-[#CBD5E1] hover:bg-[#222734] hover:text-[#F8FAFC]"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{opt.label}</span>
                        {opt.badge && (
                          <span className="px-2 py-0.5 rounded-md bg-[#222734] border border-[#2D3748] text-[10px] text-[#A78BFA] shrink-0 font-medium">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      {opt.sublabel && (
                        <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                          {opt.sublabel}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <Check size={13} className="text-[#A78BFA] shrink-0" />
                    )}
                  </div>
                )
              })
            ) : (
              <div className="px-3.5 py-3 text-center text-xs text-[#64748B]">
                No se encontraron opciones
              </div>
            )}

            {/* Opción de creación si allowCreate está activo y hay texto o no hay coincidencia */}
            {allowCreate && (
              <div
                onClick={handleCreate}
                className="mt-1 p-2.5 border-t border-[#262D3D] text-xs font-medium text-[#A78BFA] hover:text-white hover:bg-[#7C3AED]/20 transition-colors cursor-pointer flex items-center gap-2 rounded-b-xl"
              >
                <Plus size={14} className="shrink-0" />
                <span className="truncate">
                  {searchQuery.trim()
                    ? `Crear "${searchQuery.trim()}"`
                    : createLabel || "Crear nuevo"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <span className="text-[11px] font-medium text-[#EF4444] mt-1 block">
          {error}
        </span>
      )}
    </div>
  )
}
