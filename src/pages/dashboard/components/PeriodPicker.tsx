import { ChevronLeft, ChevronRight } from "lucide-react"
import { SegmentedControl } from "@/components/SegmentedControl"
import { RANGE_OPTIONS } from "../constants"
import { shiftAnchor } from "../period"
import type { RangeType } from "../types"

interface PeriodPickerProps {
  type: RangeType
  anchor: string
  label: string
  onTypeChange: (type: RangeType) => void
  onAnchorChange: (iso: string) => void
}

const ARROW =
  "p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#222734] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"

export function PeriodPicker({
  type,
  anchor,
  label,
  onTypeChange,
  onAnchorChange,
}: PeriodPickerProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <SegmentedControl
        label="Rango de tiempo"
        value={type}
        options={RANGE_OPTIONS}
        onChange={(val) => onTypeChange(val as RangeType)}
      />
      <div className="flex items-center gap-1 px-1.5 py-1 rounded-xl bg-[#181B22] border border-[#262D3D]">
        <button
          type="button"
          aria-label="Período anterior"
          onClick={() => onAnchorChange(shiftAnchor(type, anchor, -1))}
          className={ARROW}
        >
          <ChevronLeft size={14} aria-hidden="true" />
        </button>
        <span
          aria-live="polite"
          className="text-xs font-medium text-[#F8FAFC] min-w-[130px] text-center first-letter:uppercase"
        >
          {label}
        </span>
        <button
          type="button"
          aria-label="Período siguiente"
          onClick={() => onAnchorChange(shiftAnchor(type, anchor, 1))}
          className={ARROW}
        >
          <ChevronRight size={14} aria-hidden="true" />
        </button>
      </div>
      <input
        type="date"
        aria-label="Ir a una fecha"
        value={anchor}
        onChange={(e) => e.target.value && onAnchorChange(e.target.value)}
        className="h-[36px] px-2.5 rounded-xl bg-[#181B22] border border-[#262D3D] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#7C3AED]"
      />
    </div>
  )
}
