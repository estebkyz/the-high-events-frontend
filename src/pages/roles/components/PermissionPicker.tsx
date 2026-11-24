import { useState } from "react"
import { toggleValue } from "@/utils/list"
import { toggleGroup } from "../form"
import { PERMISSION_GROUPS } from "../permissions"

interface PermissionPickerProps {
  permisos: string[]
  onChange: (permisos: string[]) => void
}

/** Módulos a la izquierda, privilegios del módulo elegido a la derecha. */
export function PermissionPicker({ permisos, onChange }: PermissionPickerProps) {
  const [groupId, setGroupId] = useState(PERMISSION_GROUPS[0].id)
  const active = PERMISSION_GROUPS.find((g) => g.id === groupId) ?? PERMISSION_GROUPS[0]

  const countSelected = (group: typeof active) =>
    group.privileges.filter((p) => permisos.includes(p.id)).length
  const allSelected = countSelected(active) === active.privileges.length

  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4">
      <div className="space-y-0.5 max-h-[300px] overflow-y-auto pr-1" role="tablist">
        {PERMISSION_GROUPS.map((group) => (
          <button
            key={group.id}
            type="button"
            role="tab"
            aria-selected={group.id === active.id}
            onClick={() => setGroupId(group.id)}
            className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
              group.id === active.id
                ? "bg-[#7C3AED] text-white font-semibold"
                : "text-[#CBD5E1] hover:bg-[#222734]"
            }`}
          >
            <span className="truncate">{group.label}</span>
            <span className="text-[11px] tabular-nums shrink-0">
              {countSelected(group)}/{group.privileges.length}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-[13px] font-semibold text-[#F8FAFC]">{active.label}</h4>
          <button
            type="button"
            onClick={() => onChange(toggleGroup(permisos, active))}
            className="text-[11px] font-semibold text-[#A78BFA] hover:text-[#C4B5FD] cursor-pointer"
          >
            {allSelected ? "Desmarcar todos" : "Activar todos"}
          </button>
        </div>
        <div className="divide-y divide-[#2D3748]/60">
          {active.privileges.map((privilege) => (
            <label
              key={privilege.id}
              className="py-2.5 flex items-center justify-between gap-3 text-xs text-[#F1F5F9] cursor-pointer"
            >
              {privilege.label}
              <input
                type="checkbox"
                checked={permisos.includes(privilege.id)}
                onChange={() => onChange(toggleValue(permisos, privilege.id))}
                className="w-4 h-4 accent-[#7C3AED] cursor-pointer"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
