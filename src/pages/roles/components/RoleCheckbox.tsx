import React from "react"
import { Check } from "lucide-react"

interface RoleCheckboxProps {
  checked: boolean; onChange: () => void
  label: string
}

export function RoleCheckbox({ checked, onChange, label }: RoleCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`w-[18px] h-[18px] rounded flex items-center justify-center border transition-all cursor-pointer mx-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] ${
        checked
          ? "bg-[#7C3AED] border-[#7C3AED] text-white"
          : "border-[#4A5568] bg-transparent hover:border-[#7C3AED]"
      }`}
    >
      {checked && <Check size={11} strokeWidth={3} aria-hidden="true" />}
    </button>
  )
}
