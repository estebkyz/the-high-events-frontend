import { useId, useRef, useState, type KeyboardEvent } from "react"
import { FormInput } from "@/components/FormInput"
import { MapsLink } from "@/components/MapsLink"
import { useUbicaciones } from "@/hooks/useUbicaciones"
import { MAX_UBICACION } from "@/services/ubicaciones"
import { UbicacionListbox } from "./UbicacionListbox"

interface FormUbicacionProps {
  label: string
  value: string
  onChange: (ubicacion: string) => void
  placeholder?: string
  required?: boolean
}

function getMessage(search: ReturnType<typeof useUbicaciones>): string | null {
  if (search.items.length > 0) return null
  if (search.loading) return "Buscando…"
  return search.failed
    ? "No se pudieron cargar sugerencias. Puedes escribir la dirección."
    : "Sin coincidencias. Se guardará lo que escribiste."
}

/**
 * Campo de ubicación: sugiere lugares y direcciones reales, y los abre en Google
 * Maps. Elegir una sugerencia es opcional: siempre vale lo que se escriba.
 */
export function FormUbicacion({
  label,
  value,
  onChange,
  placeholder = "Ej. Plaza Mayor, Medellín",
  required,
}: FormUbicacionProps) {
  const baseId = useId()
  const listId = `${baseId}-list`
  const anchorRef = useRef<HTMLDivElement>(null)
  // Solo se consulta lo que la persona escribe, no lo que ya estaba guardado.
  const [isTyping, setIsTyping] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const search = useUbicaciones(isTyping ? value : "")
  const isOpen = isTyping && search.activa
  const optionId = (index: number) => `${baseId}-opt-${index}`

  const close = () => {
    setIsTyping(false)
    setActiveIndex(-1)
  }

  const choose = (item: string) => {
    onChange(item)
    close()
  }

  const move = (delta: number) =>
    setActiveIndex((i) => Math.max(-1, Math.min(search.items.length - 1, i + delta)))

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      move(e.key === "ArrowDown" ? 1 : -1)
      return
    }
    const active = search.items[activeIndex]
    if (e.key === "Enter" && active) {
      e.preventDefault()
      choose(active)
    }
    if (e.key === "Escape") {
      // No debe cerrar también el modal que contiene al campo.
      e.nativeEvent.stopImmediatePropagation()
      e.stopPropagation()
      close()
    }
  }

  return (
    <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
      <div ref={anchorRef} className="flex-1 min-w-[min(100%,15rem)]">
        <FormInput
          label={label}
          required={required}
          maxLength={MAX_UBICACION}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setIsTyping(true)
            setActiveIndex(-1)
            onChange(e.target.value)
          }}
          onKeyDown={handleKeyDown}
          onBlur={close}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-activedescendant={
            isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined
          }
        />
        {isOpen && (
          <UbicacionListbox
            id={listId}
            label={`Sugerencias de ${label.toLowerCase()}`}
            items={search.items}
            activeIndex={activeIndex}
            message={getMessage(search)}
            anchorRef={anchorRef}
            optionId={optionId}
            onActiveChange={setActiveIndex}
            onChoose={choose}
          />
        )}
      </div>
      <p role="status" className="sr-only">
        {isOpen && !search.loading ? `${search.items.length} sugerencias` : ""}
      </p>
      {value.trim() && <MapsLink ubicacion={value.trim()} className="min-h-10" />}
    </div>
  )
}
