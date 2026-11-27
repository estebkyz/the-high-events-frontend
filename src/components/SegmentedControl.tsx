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
      className="grid grid-flow-col auto-cols-fr gap-0.5 bg-fill p-0.5 rounded-[10px]"
    >
      {options.map(({ label: text, value: optionValue, icon: Icon }) => (
        <button
          key={optionValue}
          type="button"
          aria-pressed={value === optionValue}
          onClick={() => onChange(optionValue)}
          className={`min-h-7 px-3 rounded-lg text-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-brand ${
            value === optionValue
              ? "bg-raised text-brand-ink font-semibold shadow-card"
              : "text-ink-muted font-medium hover:text-ink"
          }`}
        >
          {Icon && <Icon size={13} aria-hidden="true" />}
          {text}
        </button>
      ))}
    </div>
  )
}
