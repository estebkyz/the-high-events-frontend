import React, { useState } from "react"
import { ShieldCheck, Check, Edit2 } from "lucide-react"
import { Drawer } from "../../../components/Drawer"
import { FormInput } from "../../../components/FormInput"
import { CustomSelect } from "../../../components/CustomSelect"
import { StatusBadge } from "../../../components/StatusBadge"
import { PERMISSION_GROUPS } from "../data"
import type { Rol } from "../types"

interface RoleFormDrawerProps {
  isOpen: boolean
  mode: "create" | "edit" | "view"
  onClose: () => void
  editingRole: Rol | null
  formNombre: string
  setFormNombre: (val: string) => void
  formDesc: string
  setFormDesc: (val: string) => void
  formEstado: "Activo" | "Inactivo"
  setFormEstado: (val: "Activo" | "Inactivo") => void
  rolePerms: Set<string>
  onTogglePrivilege: (privId: string) => void
  onToggleGroupAll: (groupId: string) => void
  onSave: (e: React.FormEvent) => void
  onSwitchToEdit?: () => void
}

const ESTADO_OPTIONS = [
  { value: "Activo", label: "Activo" },
  { value: "Inactivo", label: "Inactivo" },
]

export function RoleFormDrawer({
  isOpen,
  mode,
  onClose,
  editingRole,
  formNombre,
  setFormNombre,
  formDesc,
  setFormDesc,
  formEstado,
  setFormEstado,
  rolePerms,
  onTogglePrivilege,
  onToggleGroupAll,
  onSave,
  onSwitchToEdit,
}: RoleFormDrawerProps) {
  const [selectedPermId, setSelectedPermId] = useState<string>(
    PERMISSION_GROUPS[0].id,
  )

  const isReadOnly = mode === "view"
  const activeGroup =
    PERMISSION_GROUPS.find((g) => g.id === selectedPermId) ??
    PERMISSION_GROUPS[0]

  const activeGroupSelectedCount = activeGroup.privileges.filter((p) =>
    rolePerms.has(p.id),
  ).length
  const allInActiveGroupSelected =
    activeGroupSelectedCount === activeGroup.privileges.length

  const totalModulosConPermiso = PERMISSION_GROUPS.filter((g) =>
    g.privileges.some((p) => rolePerms.has(p.id)),
  ).length

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      width="max-w-4xl"
      title={
        mode === "view"
          ? `Detalle de rol`
          : mode === "edit"
            ? `Editar rol`
            : "Crear rol"
      }
    >
      <form onSubmit={onSave} className="space-y-4">
        {/* Datos básicos del rol en fila horizontal aprovechando el espacio */}
        {isReadOnly ? (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#111318] border border-[#262D3D] text-xs">
            <div>
              <p className="text-[11px] text-[#94A3B8]">Nombre</p>
              <p className="font-bold text-[#F8FAFC] text-sm mt-0.5">
                {editingRole?.nombre}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[11px] text-[#94A3B8]">Descripción</p>
              <p className="text-[#CBD5E1] mt-0.5">
                {editingRole?.descripcion || "Sin descripción"}
              </p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <div>
                <p className="text-[11px] text-[#94A3B8]">Estado</p>
                <div className="mt-1">
                  <StatusBadge status={editingRole?.estado || "Activo"} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className={editingRole ? "sm:col-span-4" : "sm:col-span-5"}>
              <FormInput
                label="Nombre"
                value={formNombre}
                onChange={(e) => setFormNombre(e.target.value)}
                placeholder="Ej. Coordinador de producción"
                required
              />
            </div>
            <div className={editingRole ? "sm:col-span-5" : "sm:col-span-7"}>
              <FormInput
                label="Descripción"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Responsabilidades y alcance del perfil"
              />
            </div>
            {editingRole && (
              <div className="sm:col-span-3">
                <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
                  Estado del rol
                </label>
                <CustomSelect
                  value={formEstado}
                  onChange={(val) => setFormEstado(val as "Activo" | "Inactivo")}
                  options={ESTADO_OPTIONS}
                />
              </div>
            )}
          </div>
        )}

        {/* ── Estructura de 2 Columnas: Izquierda Permisos (Quemados) | Derecha Privilegios (Switches) ── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F8FAFC]">
                Permisos y Privilegios
              </span>
            </div>
            <span className="text-[11px] text-[#94A3B8]">
              Selecciona un permiso a la izquierda para{" "}
              {isReadOnly ? "ver" : "activar/desactivar"} sus privilegios a la
              derecha
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#111318] border border-[#262D3D] rounded-2xl p-3">
            {/* COLUMNA 1 (IZQUIERDA): Lista de Permisos (Módulos quemados según BD) */}
            <div className="md:col-span-5 flex flex-col border-b md:border-b-0 md:border-r border-[#262D3D] pb-3 md:pb-0 md:pr-3">
              <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] border-b border-[#262D3D] mb-1.5 flex items-center justify-between">
                <span>Permisos</span>
                <span>Asignados</span>
              </div>

              <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1">
                {PERMISSION_GROUPS.map((group) => {
                  const isSelected = group.id === activeGroup.id
                  const activeCount = group.privileges.filter((p) =>
                    rolePerms.has(p.id),
                  ).length
                  const totalCount = group.privileges.length
                  const hasAny = activeCount > 0

                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => setSelectedPermId(group.id)}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs transition-all text-left cursor-pointer ${
                        isSelected
                          ? "bg-[#7C3AED] text-white font-semibold shadow-sm"
                          : "text-[#CBD5E1] hover:bg-[#181B22] hover:text-[#F8FAFC]"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            hasAny
                              ? isSelected
                                ? "bg-white"
                                : "bg-[#10B981]"
                              : "bg-[#475569]"
                          }`}
                        />
                        <span className="truncate">{group.label}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold shrink-0 ${
                          isSelected
                            ? "bg-black/25 text-white"
                            : hasAny
                              ? "bg-[#10B981]/15 text-[#34D399]"
                              : "bg-[#181B22] text-[#64748B]"
                        }`}
                      >
                        {activeCount}/{totalCount}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* COLUMNA 2 (DERECHA): Privilegios tipo Switch del permiso seleccionado a la izquierda */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#262D3D] pb-2.5 px-1">
                  <div>
                    <h4 className="text-sm font-bold text-[#F8FAFC]">
                      {activeGroup.label}
                    </h4>
                    <p className="text-[11px] text-[#94A3B8]">
                      {activeGroupSelectedCount} de{" "}
                      {activeGroup.privileges.length} privilegios habilitados en
                      este permiso
                    </p>
                  </div>

                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => onToggleGroupAll(activeGroup.id)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#181B22] border border-[#262D3D] text-[#A78BFA] hover:bg-[#222734] transition-colors cursor-pointer"
                    >
                      {allInActiveGroupSelected
                        ? "Desmarcar todos"
                        : "Activar todos"}
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-[270px] overflow-y-auto pr-1">
                  {activeGroup.privileges.map((priv) => {
                    const checked = rolePerms.has(priv.id)
                    return (
                      <div
                        key={priv.id}
                        onClick={() => {
                          if (!isReadOnly) onTogglePrivilege(priv.id)
                        }}
                        className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-colors ${
                          isReadOnly ? "cursor-default" : "cursor-pointer"
                        } ${
                          checked
                            ? "bg-[#7C3AED]/10 border-[#7C3AED]/40"
                            : "bg-[#181B22] border-[#262D3D] hover:border-[#333C50]"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#F8FAFC]">
                            {priv.label}
                          </p>
                        </div>

                        {/* Switch de Privilegio */}
                        <button
                          type="button"
                          role="switch"
                          aria-checked={checked}
                          disabled={isReadOnly}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (!isReadOnly) onTogglePrivilege(priv.id)
                          }}
                          className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isReadOnly
                              ? "opacity-90 cursor-default"
                              : "cursor-pointer"
                          } ${checked ? "bg-[#7C3AED]" : "bg-[#262D3D]"}`}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                              checked ? "translate-x-5" : "translate-x-0"
                            }`}
                          >
                            {checked && (
                              <Check size={11} className="text-[#7C3AED]" />
                            )}
                          </span>
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pie del Modal */}
        <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#262D3D]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-medium text-[#F1F5F9] bg-transparent border border-[#262D3D] hover:bg-[#242830] transition-colors cursor-pointer"
          >
            {isReadOnly ? "Cerrar" : "Cancelar"}
          </button>

          {isReadOnly ? (
            <button
              type="button"
              onClick={onSwitchToEdit}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all shadow-sm shadow-[#7C3AED]/25 cursor-pointer inline-flex items-center gap-1.5"
            >
              <Edit2 size={13} />
              <span>Editar rol y permisos</span>
            </button>
          ) : (
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all shadow-sm shadow-[#7C3AED]/25 cursor-pointer"
            >
              {mode === "edit" ? "Guardar cambios" : "Crear rol"}
            </button>
          )}
        </div>
      </form>
    </Drawer>
  )
}
