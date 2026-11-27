import { StatusBadge } from "@/components/StatusBadge"
import { useModuleAccess } from "@/hooks/useAccess"
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
  const { canChangeStatus } = useModuleAccess()
  if (!canChangeStatus) return <StatusBadge status={value} />

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
            className={`btn flex-1 min-w-fit disabled:opacity-100 ${
              isActive
                ? `${tone.bg} ${tone.text} ring-1 ring-inset ring-current/40`
                : "btn-secondary"
            }`}
          >
            <span aria-hidden="true" className={`size-1.5 rounded-full ${tone.dot}`} />
            {option}
          </button>
        )
      })}
    </div>
  )
}
