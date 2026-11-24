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
  const fieldClass = `w-full h-[40px] pl-3.5 pr-9 bg-[#111318] border rounded-lg text-[13px] text-left truncate transition-colors focus:outline-none focus:border-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed ${
    isOpen ? "border-[#7C3AED]" : "border-[var(--field-border)] hover:border-[#3B455A]"
  }`

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
          className={`${fieldClass} text-[#F8FAFC] placeholder-[#64748B]`}
        />
      ) : (
        <button
          {...field}
          type="button"
          onClick={isOpen ? onClose : onOpen}
          className={`${fieldClass} cursor-pointer ${selectedLabel ? "text-[#F8FAFC]" : "text-[#64748B]"}`}
        >
          {selectedLabel ?? placeholder}
        </button>
      )}
      <ChevronDown
        size={14}
        aria-hidden="true"
        className={`absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </>
  )
}
