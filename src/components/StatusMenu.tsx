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
import { useAnchoredPosition } from "@/hooks/useAnchoredPosition"
import { getStatusClasses } from "@/utils/statusTones"

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
      className="fixed z-[60] bg-[#181B22] border border-[#2D3748] rounded-xl shadow-2xl p-1.5 space-y-1 min-w-max focus:outline-none"
    >
      {options.map((option, index) => {
        const tone = getStatusClasses(option)
        const isSelected = option === selected
        return (
          <div
            key={option}
            id={optionId(index)}
            role="option"
            aria-selected={isSelected}
            onClick={() => onChoose(option)}
            onMouseEnter={() => setActiveIndex(index)}
            className={`flex items-center justify-between gap-3 px-2.5 py-1 rounded text-[11px] font-medium cursor-pointer ${tone.bg} ${tone.text} ${tone.hoverBg} ${
              isSelected ? "font-semibold" : ""
            } ${index === activeIndex ? "ring-2 ring-[#7C3AED]/70" : ""}`}
          >
            <span>{option}</span>
            {isSelected && (
              <Check size={11} className="shrink-0 opacity-90" aria-hidden="true" />
            )}
          </div>
        )
      })}
    </div>
  )
}
