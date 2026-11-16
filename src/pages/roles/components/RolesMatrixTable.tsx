import React from "react"
import { Pencil, Trash2 } from "lucide-react"
import { RoleCheckbox } from "./RoleCheckbox"
import { PERMISSION_GROUPS } from "../data"
import type { Rol, PermsMap } from "../types"

interface RolesMatrixTableProps {
  roles: Rol[]; perms: PermsMap
  onTogglePerm: (roleId: string, privId: string) => void
  onEditRole: (role: Rol) => void
  onDeleteRole: (roleId: string) => void
}

export function RolesMatrixTable({
  roles,
  perms,
  onTogglePerm,
  onEditRole,
  onDeleteRole,
}: RolesMatrixTableProps) {
  return (
    <div className="rounded-2xl border border-[#262D3D] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Column Headers */}
          <thead>
            <tr className="border-b border-[#262D3D]">
              <th
                scope="col"
                className="text-left px-6 py-3.5 text-[12px] font-semibold text-[#94A3B8] bg-[#181B22] min-w-[300px] w-[300px]"
              >
                Permisos
              </th>

              {/* Role columns */}
              {roles.map((role) => (
                <th
                  key={role.id}
                  scope="col"
                  className="px-4 py-3.5 bg-[#181B22] text-center min-w-[110px]"
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <span
                      className={`text-[13px] font-semibold ${
                        role.estado === "Inactivo"
                          ? "text-[#64748B]"
                          : "text-[#F1F5F9]"
                      }`}
                    >
                      {role.nombre}
                    </span>
                    {role.estado === "Inactivo" && (
                      <span className="text-[10px] text-[#EF4444]">
                        Inactivo
                      </span>
                    )}
                    {/* Action icons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEditRole(role)}
                        aria-label={`Editar rol ${role.nombre}`}
                        className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/15 transition-colors cursor-pointer"
                        title="Editar rol"
                      >
                        <Pencil size={13} aria-hidden="true" />
                      </button>
                      <span aria-hidden="true" className="w-px h-3.5 bg-[#262D3D] mx-0.5" />
                      <button
                        type="button"
                        onClick={() => onDeleteRole(role.id)}
                        aria-label={`Eliminar rol ${role.nombre}`}
                        className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/15 transition-colors cursor-pointer"
                        title="Eliminar rol"
                      >
                        <Trash2 size={13} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Rows */}
          <tbody>
            {PERMISSION_GROUPS.map((group) => (
              <React.Fragment key={group.id}>
                {/* Category separator row */}
                <tr className="bg-[#14171E] border-t border-[#262D3D]">
                  <td
                    colSpan={roles.length + 1}
                    className="px-6 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]"
                  >
                    {group.label}
                  </td>
                </tr>

                {/* Privilege rows */}
                {group.privileges.map((priv) => (
                  <tr
                    key={priv.id}
                    className="border-t border-[#262D3D] bg-[#181B22] hover:bg-[#1E2330] transition-colors"
                  >
                    <td className="px-6 py-2.5 text-[13px] font-medium text-[#F1F5F9]">
                      {priv.label}
                    </td>

                    {/* Checkbox per role */}
                    {roles.map((role) => (
                      <td key={role.id} className="px-4 py-2.5 text-center">
                        <RoleCheckbox
                          checked={perms[role.id]?.has(priv.id) ?? false}
                          onChange={() => onTogglePerm(role.id, priv.id)}
                          label={`${priv.label} para ${role.nombre}`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
