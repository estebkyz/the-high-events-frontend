import { useState } from "react"
import { esAcceso, toggleGroup, togglePermiso } from "../form"
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
            className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-[13px] text-left transition-colors cursor-pointer ${
              group.id === active.id
                ? "bg-brand-soft text-brand-ink font-semibold"
                : "text-ink-soft hover:bg-hover"
            }`}
          >
            <span className="truncate">{group.label}</span>
            <span className="text-xs tabular-nums shrink-0">
              {countSelected(group)}/{group.privileges.length}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-[13px] font-semibold text-ink">{active.label}</h4>
          <button
            type="button"
            onClick={() => onChange(toggleGroup(permisos, active))}
            className="text-xs font-semibold text-brand-ink hover:underline cursor-pointer"
          >
            {allSelected ? "Desmarcar todos" : "Activar todos"}
          </button>
        </div>
        <div className="divide-y divide-line-soft">
          {active.privileges.map((privilege) => {
            const checked = permisos.includes(privilege.id)
            // El acceso queda fijo mientras otra acción del módulo lo necesite
            const requerido =
              checked &&
              esAcceso(privilege.id) &&
              active.privileges.some(
                (p) => p.id !== privilege.id && permisos.includes(p.id),
              )
            return (
              <label
                key={privilege.id}
                className={`py-2.5 flex items-center justify-between gap-3 text-xs text-ink ${requerido ? "" : "cursor-pointer"}`}
              >
                <span>
                  {privilege.label}
                  {esAcceso(privilege.id) && (
                    <span className="block text-ink-muted mt-0.5">
                      {requerido
                        ? "Requerido por las demás acciones marcadas"
                        : "Requisito de las demás acciones del módulo"}
                    </span>
                  )}
                </span>
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={requerido}
                  onChange={() => onChange(togglePermiso(permisos, privilege.id))}
                  className="w-4 h-4 accent-brand cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}
