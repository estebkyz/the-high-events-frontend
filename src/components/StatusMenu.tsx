import {
  useEffect,
  useEffectEvent,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react"
import { Check } from "lucide-react"
import { StatusBadge } from "@/components/StatusBadge"
import { useAnchoredPosition } from "@/hooks/useAnchoredPosition"

interface StatusMenuProps<S extends string> {
  id: string
  label: string
  options: readonly S[]
  selected: S
  anchorRef: RefObject<HTMLElement | null>
  onChoose: (option: S) => void
  onClose: (returnFocus: boolean) => void
}

const TYPEAHEAD_RESET_MS = 600

/** Menú flotante de `TableStatusSelect`; existe solo mientras está abierto. */
export function StatusMenu<S extends string>({
  id,
  label,
  options,
  selected,
  anchorRef,
  onChoose,
  onClose,
}: StatusMenuProps<S>) {
  const baseId = useId()
  const menuRef = useRef<HTMLDivElement>(null)
  const typeahead = useRef<{ buffer: string; timer?: ReturnType<typeof setTimeout> }>({
    buffer: "",
  })
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, options.indexOf(selected)),
  )
  const position = useAnchoredPosition(anchorRef, menuRef)
  const optionId = (index: number) => `${baseId}-opt-${index}`
  const activeId = optionId(activeIndex)

  useLayoutEffect(() => menuRef.current?.focus({ preventScroll: true }), [])

  useEffect(() => {
    document.getElementById(activeId)?.scrollIntoView({ block: "nearest" })
  }, [activeId])

  const handleOutside = useEffectEvent((e: PointerEvent) => {
    const target = e.target as Node
    const isInside =
      anchorRef.current?.contains(target) || menuRef.current?.contains(target)
    if (!isInside) onClose(false)
  })

  useEffect(() => {
    const listener = (e: PointerEvent) => handleOutside(e)
    const { current: search } = typeahead
    document.addEventListener("pointerdown", listener)
    return () => {
      document.removeEventListener("pointerdown", listener)
      clearTimeout(search.timer)
    }
  }, [])

  /** Escribir una letra salta a la primera opción que empieza así. */
  const searchOption = (key: string) => {
    const search = typeahead.current
    clearTimeout(search.timer)
    search.buffer += key.toLowerCase()
    search.timer = setTimeout(() => (search.buffer = ""), TYPEAHEAD_RESET_MS)
    const found = options.findIndex((o) => o.toLowerCase().startsWith(search.buffer))
    if (found >= 0) setActiveIndex(found)
  }

  const last = options.length - 1
  const keyActions: Record<string, () => void> = {
    ArrowDown: () => setActiveIndex((i) => (i === last ? 0 : i + 1)),
    ArrowUp: () => setActiveIndex((i) => (i === 0 ? last : i - 1)),
    Home: () => setActiveIndex(0),
    End: () => setActiveIndex(last),
    Enter: () => onChoose(options[activeIndex]),
    " ": () => onChoose(options[activeIndex]),
    Escape: () => onClose(true),
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    // Sin preventDefault: el foco continúa al elemento siguiente.
    if (e.key === "Tab") {
      onClose(true)
      return
    }
    const action = keyActions[e.key]
    if (action) {
      e.preventDefault()
      // Dentro de un Drawer, Esc cierra solo este menú.
      e.stopPropagation()
      action()
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      searchOption(e.key)
    }
  }

  return (
    <div
      ref={menuRef}
      id={id}
      role="listbox"
      tabIndex={-1}
      aria-label={label}
      aria-activedescendant={activeId}
      onKeyDown={handleKeyDown}
      // opacity (no visibility) mientras se mide: lo invisible no recibe foco.
      style={position ?? { top: 0, left: 0, opacity: 0, pointerEvents: "none" }}
      className="fixed z-[60] bg-surface rounded-xl shadow-popover p-1.5 min-w-max focus:outline-none"
    >
      {options.map((option, index) => {
        const isSelected = option === selected
        return (
          <div
            key={option}
            id={optionId(index)}
            role="option"
            aria-selected={isSelected}
            onClick={() => onChoose(option)}
            onMouseEnter={() => setActiveIndex(index)}
            className={`min-h-8 flex items-center justify-between gap-4 px-2 rounded-lg cursor-pointer ${
              index === activeIndex ? "bg-hover" : ""
            }`}
          >
            <StatusBadge status={option} />
            {isSelected && (
              <Check size={14} className="shrink-0 text-brand-ink" aria-hidden="true" />
            )}
          </div>
        )
      })}
    </div>
  )
}
