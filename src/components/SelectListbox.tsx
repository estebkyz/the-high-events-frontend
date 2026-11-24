import { useEffect, type ReactNode } from "react"
import { Check, Plus } from "lucide-react"
import type { SelectOption } from "@/components/CustomSelect"

interface SelectListboxProps {
  id: string
  options: SelectOption[]
  selectedValue: string | undefined
  activeIndex: number
  /** Texto de la opción "crear", la última de la lista. */
  createLabel?: string
  optionId: (index: number) => string
  onActiveChange: (index: number) => void
  onChoose: (index: number) => void
}

/** Lista desplegable de `CustomSelect`. */
export function SelectListbox({
  id,
  options,
  selectedValue,
  activeIndex,
  createLabel,
  optionId,
  onActiveChange,
  onChoose,
}: SelectListboxProps) {
  const activeId = optionId(activeIndex)

  useEffect(() => {
    document.getElementById(activeId)?.scrollIntoView({ block: "nearest" })
  }, [activeId])

  const renderOption = (
    index: number,
    isSelected: boolean,
    className: string,
    content: ReactNode,
  ) => (
    <li
      key={optionId(index)}
      id={optionId(index)}
      role="option"
      aria-selected={isSelected}
      onClick={() => onChoose(index)}
      onMouseEnter={() => onActiveChange(index)}
      className={`px-3.5 py-2.5 text-xs cursor-pointer flex items-center gap-2 ${className}`}
    >
      {content}
    </li>
  )

  return (
    <ul
      id={id}
      role="listbox"
      className="absolute left-0 top-full mt-1.5 z-50 min-w-full w-max max-w-[min(340px,calc(100vw-2rem))] max-h-60 overflow-y-auto py-1 bg-[#181B22] border border-[#262D3D] rounded-xl shadow-2xl"
    >
      {options.map((option, index) => {
        const isSelected = option.value === selectedValue
        return renderOption(
          index,
          isSelected,
          `justify-between ${index === activeIndex ? "bg-[#222734] text-[#F8FAFC]" : "text-[#CBD5E1]"}`,
          <OptionContent option={option} isSelected={isSelected} />,
        )
      })}
      {options.length === 0 && (
        <li className="px-3.5 py-3 text-center text-xs text-[#94A3B8]">
          No se encontraron opciones
        </li>
      )}
      {createLabel &&
        renderOption(
          options.length,
          false,
          `mt-1 border-t border-[#262D3D] font-medium text-[#A78BFA] ${
            activeIndex === options.length ? "bg-[#7C3AED]/20" : ""
          }`,
          <>
            <Plus size={14} aria-hidden="true" />
            {createLabel}
          </>,
        )}
    </ul>
  )
}

interface OptionContentProps {
  option: SelectOption
  isSelected: boolean
}

function OptionContent({ option, isSelected }: OptionContentProps) {
  return (
    <>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          {option.label}
          {option.badge && (
            <span className="px-2 py-0.5 rounded-md bg-[#222734] text-[10px] text-[#A78BFA] shrink-0">
              {option.badge}
            </span>
          )}
        </span>
        {option.sublabel && (
          <span className="block text-[11px] text-[#94A3B8] truncate mt-0.5">
            {option.sublabel}
          </span>
        )}
      </span>
      {isSelected && (
        <Check size={13} className="text-[#A78BFA] shrink-0" aria-hidden="true" />
      )}
    </>
  )
}
