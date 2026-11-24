import { getStatusClasses } from "@/utils/statusTones"

interface DetailStatusPickerProps<S extends string> {
  value: S
  options: readonly S[]
  onChange: (value: S) => void
}

/** Selector de estado dentro del detalle: un botón por estado. */
export function DetailStatusPicker<S extends string>({
  value,
  options,
  onChange,
}: DetailStatusPickerProps<S>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option === value
        const tone = getStatusClasses(option)
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isActive}
            disabled={isActive}
            onClick={() => onChange(option)}
            className={`flex-1 min-w-fit px-3 py-2 rounded-xl text-xs font-semibold transition-colors border cursor-pointer disabled:cursor-default ${
              isActive
                ? `${tone.bg} ${tone.text} border-current`
                : "text-[#94A3B8] border-[#2D3748] hover:bg-[#222734] hover:text-[#F1F5F9]"
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
