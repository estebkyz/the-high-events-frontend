import { useEffect, useRef, type RefObject } from "react"
import { MapPin } from "lucide-react"
import { useAnchoredPosition } from "@/hooks/useAnchoredPosition"

interface UbicacionListboxProps {
  id: string
  label: string
  items: string[]
  activeIndex: number
  /** Estado de la búsqueda cuando no hay nada que elegir. */
  message: string | null
  anchorRef: RefObject<HTMLElement | null>
  optionId: (index: number) => string
  onActiveChange: (index: number) => void
  onChoose: (item: string) => void
}

/** Lista desplegable de `FormUbicacion`. */
export function UbicacionListbox({
  id,
  label,
  items,
  activeIndex,
  message,
  anchorRef,
  optionId,
  onActiveChange,
  onChoose,
}: UbicacionListboxProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  // `fixed`: dentro de un modal no la recorta el área con scroll.
  const position = useAnchoredPosition(anchorRef, menuRef)
  const activeId = activeIndex >= 0 ? optionId(activeIndex) : null

  useEffect(() => {
    if (activeId) document.getElementById(activeId)?.scrollIntoView({ block: "nearest" })
  }, [activeId])

  return (
    <div
      ref={menuRef}
      style={
        position
          ? { top: position.top, left: position.left, width: position.minWidth }
          : { top: 0, left: 0, opacity: 0, pointerEvents: "none" }
      }
      // Elegir con el puntero no debe quitarle el foco al campo.
      onMouseDown={(e) => e.preventDefault()}
      className="fixed z-[60] max-w-[calc(100vw-1rem)] p-1.5 bg-surface rounded-xl shadow-popover"
    >
      <ul
        id={id}
        role="listbox"
        aria-label={label}
        className="max-h-60 overflow-y-auto overscroll-contain"
      >
        {items.map((item, index) => (
          <li
            key={item}
            id={optionId(index)}
            role="option"
            aria-selected={index === activeIndex}
            onClick={() => onChoose(item)}
            onMouseEnter={() => onActiveChange(index)}
            className={`px-2.5 py-2 rounded-lg text-[13px] cursor-pointer flex items-start gap-2 ${
              index === activeIndex ? "bg-hover text-ink" : "text-ink-soft"
            }`}
          >
            <MapPin
              size={13}
              aria-hidden="true"
              className="shrink-0 mt-px text-ink-muted"
            />
            <span className="min-w-0 break-words">{item}</span>
          </li>
        ))}
      </ul>
      {message && <p className="px-3.5 py-2.5 text-xs text-ink-muted">{message}</p>}
    </div>
  )
}
