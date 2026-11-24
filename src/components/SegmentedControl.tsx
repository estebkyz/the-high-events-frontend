import type { LucideIcon } from "lucide-react"

export interface SegmentedOption {
  label: string
  value: string
  icon?: LucideIcon
}

interface SegmentedControlProps {
  label: string
  value: string
  options: SegmentedOption[]
  onChange: (value: string) => void
}

/** Selector de vista o modo (2 a 4 opciones excluyentes). */
export function SegmentedControl({
  label,
  value,
  options,
  onChange,
}: SegmentedControlProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className="grid grid-flow-col auto-cols-fr gap-1 bg-[#111318] p-1 rounded-xl border border-[#262D3D]"
    >
      {options.map(({ label: text, value: optionValue, icon: Icon }) => (
        <button
          key={optionValue}
          type="button"
          aria-pressed={value === optionValue}
          onClick={() => onChange(optionValue)}
          className={`py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap ${
            value === optionValue
              ? "bg-[#7C3AED] text-white font-semibold"
              : "text-[#94A3B8] hover:text-[#F1F5F9]"
          }`}
        >
          {Icon && <Icon size={13} aria-hidden="true" />}
          {text}
        </button>
      ))}
    </div>
  )
}
