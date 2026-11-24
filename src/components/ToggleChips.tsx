interface ToggleChipsProps {
  options: string[]
  selected: string[]
  onToggle: (option: string) => void
}

/** Selección múltiple mediante etiquetas. */
export function ToggleChips({ options, selected, onToggle }: ToggleChipsProps) {
  return (
    <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
      {options.map((option) => {
        const isSelected = selected.includes(option)
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onToggle(option)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
              isSelected
                ? "bg-[#7C3AED]/20 text-[#A78BFA] border-[#7C3AED]/50 font-semibold"
                : "bg-[#111318] text-[#94A3B8] border-[#262D3D] hover:border-[#3B4254] hover:text-[#F1F5F9]"
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
