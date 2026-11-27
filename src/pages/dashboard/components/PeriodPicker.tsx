import { ChevronLeft, ChevronRight } from "lucide-react"
import { SegmentedControl } from "@/components/SegmentedControl"
import { ARROW_BUTTON, RANGE_OPTIONS } from "../constants"
import { shiftAnchor } from "../period"
import type { RangeType } from "../types"

interface PeriodPickerProps {
  type: RangeType
  anchor: string
  label: string
  onTypeChange: (type: RangeType) => void
  onAnchorChange: (iso: string) => void
}

export function PeriodPicker({
  type,
  anchor,
  label,
  onTypeChange,
  onAnchorChange,
}: PeriodPickerProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2.5">
      <SegmentedControl
        label="Rango de tiempo"
        value={type}
        options={RANGE_OPTIONS}
        onChange={(val) => onTypeChange(val as RangeType)}
      />
      <div className="flex items-center justify-between gap-1 px-0.5 min-h-8 rounded-lg bg-surface shadow-button">
        <button
          type="button"
          aria-label="Período anterior"
          onClick={() => onAnchorChange(shiftAnchor(type, anchor, -1))}
          className={ARROW_BUTTON}
        >
          <ChevronLeft size={14} aria-hidden="true" />
        </button>
        <span
          aria-live="polite"
          className="text-xs font-medium text-ink min-w-[130px] text-center first-letter:uppercase"
        >
          {label}
        </span>
        <button
          type="button"
          aria-label="Período siguiente"
          onClick={() => onAnchorChange(shiftAnchor(type, anchor, 1))}
          className={ARROW_BUTTON}
        >
          <ChevronRight size={14} aria-hidden="true" />
        </button>
      </div>
      {/* 16 px en celular: con menos, iOS amplía la página al enfocar. */}
      <input
        type="date"
        aria-label="Ir a una fecha"
        value={anchor}
        onChange={(e) => e.target.value && onAnchorChange(e.target.value)}
        className="field sm:!w-auto sm:!min-h-8 sm:!py-1 sm:!text-xs"
      />
    </div>
  )
}
