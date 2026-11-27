import type { AriaAttributes, KeyboardEvent } from "react"
import { ChevronDown } from "lucide-react"

interface ComboboxAttributes extends AriaAttributes {
  role: "combobox"
  disabled: boolean
  onKeyDown: (e: KeyboardEvent) => void
}

interface SelectTriggerProps {
  searchable: boolean
  isOpen: boolean
  query: string
  selectedLabel: string | undefined
  placeholder: string
  field: ComboboxAttributes
  onOpen: () => void
  onClose: () => void
  onQueryChange: (text: string) => void
}

/** Campo de `CustomSelect`: de texto si permite buscar; si no, un botón. */
export function SelectTrigger({
  searchable,
  isOpen,
  query,
  selectedLabel,
  placeholder,
  field,
  onOpen,
  onClose,
  onQueryChange,
}: SelectTriggerProps) {
  const fieldClass = "field !pr-9 text-left truncate"

  return (
    <>
      {searchable ? (
        <input
          {...field}
          type="text"
          autoComplete="off"
          aria-autocomplete="list"
          placeholder={selectedLabel ?? placeholder}
          value={isOpen ? query : (selectedLabel ?? "")}
          onClick={onOpen}
          onChange={(e) => onQueryChange(e.target.value)}
          className={fieldClass}
        />
      ) : (
        <button
          {...field}
          type="button"
          onClick={isOpen ? onClose : onOpen}
          className={`${fieldClass} cursor-pointer ${selectedLabel ? "" : "!text-ink-muted"}`}
        >
          {selectedLabel ?? placeholder}
        </button>
      )}
      <ChevronDown
        size={14}
        aria-hidden="true"
        className={`absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </>
  )
}
