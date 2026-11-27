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
            className={`min-h-7 px-2.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand ${
              isSelected
                ? "bg-brand-soft text-brand-ink border-brand-line font-semibold"
                : "bg-surface text-ink-soft border-line hover:border-line-strong hover:text-ink"
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
