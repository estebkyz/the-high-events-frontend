import {
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react"
import { SelectListbox } from "@/components/SelectListbox"
import { SelectTrigger } from "@/components/SelectTrigger"
import { matchesSearch } from "@/utils/list"
import { useCan } from "@/hooks/useAccess"

export interface SelectOption {
  label: string
  value: string
  badge?: string
  sublabel?: string
}

interface CustomSelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  ariaLabel: string
  searchable?: boolean
  disabled?: boolean
  /** No conserva la selección: para "agregar a una lista". */
  clearOnSelect?: boolean
  allowCreate?: boolean
  createLabel?: string
  onCreate?: (query: string) => void
  /** Privilegios que permiten crear desde aquí. */
  createNeeds?: readonly string[]
}

const OPEN_KEYS = ["ArrowDown", "ArrowUp", "Enter", " "]

/** Selector único del sistema: teclado, búsqueda y creación en línea. */
export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Seleccionar",
  ariaLabel,
  searchable = false,
  disabled = false,
  clearOnSelect = false,
  allowCreate = false,
  createLabel = "Crear",
  onCreate,
  createNeeds,
}: CustomSelectProps) {
  const baseId = useId()
  const listId = `${baseId}-list`
  const rootRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)

  const selected = clearOnSelect ? undefined : options.find((o) => o.value === value)
  const filtered = options.filter((o) =>
    matchesSearch(query, [o.label, o.sublabel, o.badge]),
  )
  const can = useCan()
  const canCreate =
    allowCreate && onCreate !== undefined && (!createNeeds || can(createNeeds))
  const itemCount = filtered.length + (canCreate ? 1 : 0)
  const createText = query.trim() ? `Crear "${query.trim()}"` : createLabel
  const optionId = (index: number) => `${baseId}-opt-${index}`

  const open = () => {
    if (disabled || isOpen) return
    setActiveIndex(
      Math.max(
        0,
        options.findIndex((o) => o.value === value),
      ),
    )
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
    setQuery("")
  }

  const handleOutside = useEffectEvent((e: PointerEvent) => {
    if (!rootRef.current?.contains(e.target as Node)) close()
  })

  useEffect(() => {
    if (!isOpen) return
    const listener = (e: PointerEvent) => handleOutside(e)
    document.addEventListener("pointerdown", listener)
    return () => document.removeEventListener("pointerdown", listener)
  }, [isOpen])

  const choose = (index: number) => {
    const option = filtered[index]
    if (option) onChange(option.value)
    else if (canCreate) onCreate(query.trim())
    close()
  }

  const keyActions: Record<string, () => void> = {
    ArrowDown: () => setActiveIndex((i) => Math.min(itemCount - 1, i + 1)),
    ArrowUp: () => setActiveIndex((i) => Math.max(0, i - 1)),
    Enter: () => choose(activeIndex),
    Escape: close,
    // En un selector con búsqueda el espacio se escribe.
    ...(!searchable && { " ": () => choose(activeIndex) }),
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) {
      if (!OPEN_KEYS.includes(e.key)) return
      e.preventDefault()
      open()
      return
    }
    if (e.key === "Tab") close()
    const action = keyActions[e.key]
    if (!action) return
    e.preventDefault()
    // Escape no debe cerrar también el modal que contiene al selector.
    if (e.key === "Escape") {
      e.nativeEvent.stopImmediatePropagation()
      e.stopPropagation()
    }
    action()
  }

  return (
    <div ref={rootRef} className="relative w-full">
      <SelectTrigger
        searchable={searchable}
        isOpen={isOpen}
        query={query}
        selectedLabel={selected?.label}
        placeholder={placeholder}
        onOpen={open}
        onClose={close}
        onQueryChange={(text) => {
          open()
          setQuery(text)
          setActiveIndex(0)
        }}
        field={{
          role: "combobox",
          "aria-label": ariaLabel,
          "aria-expanded": isOpen,
          "aria-controls": listId,
          "aria-haspopup": "listbox",
          "aria-activedescendant":
            isOpen && itemCount > 0 ? optionId(activeIndex) : undefined,
          disabled,
          onKeyDown: handleKeyDown,
        }}
      />
      {isOpen && (
        <SelectListbox
          id={listId}
          options={filtered}
          selectedValue={selected?.value}
          activeIndex={activeIndex}
          createLabel={canCreate ? createText : undefined}
          optionId={optionId}
          onActiveChange={setActiveIndex}
          onChoose={choose}
        />
      )}
    </div>
  )
}
