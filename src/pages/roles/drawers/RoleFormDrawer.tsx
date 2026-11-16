import React from "react"
import { Drawer } from "../../../components/Drawer"
import { FormInput } from "../../../components/FormInput"
import { CustomSelect } from "../../../components/CustomSelect"
import type { Rol } from "../types"

interface RoleFormDrawerProps {
  isOpen: boolean; onClose: () => void
  editingRole: Rol | null
  formNombre: string
  setFormNombre: (val: string) => void
  formDesc: string
  setFormDesc: (val: string) => void
  formEstado: "Activo" | "Inactivo"
  setFormEstado: (val: "Activo" | "Inactivo") => void
  onSave: (e: React.FormEvent) => void
}

const ESTADO_OPTIONS = [
  { value: "Activo", label: "Activo" },
  { value: "Inactivo", label: "Inactivo" },
]

export function RoleFormDrawer({
  isOpen,
  onClose,
  editingRole,
  formNombre,
  setFormNombre,
  formDesc,
  setFormDesc,
  formEstado,
  setFormEstado,
  onSave,
}: RoleFormDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title={editingRole ? "Editar rol" : "Crear nuevo rol"}
      subtitle={editingRole ? editingRole.nombre : undefined}
    >
      <form onSubmit={onSave} className="space-y-4">
        <FormInput
          label="Nombre del rol"
          value={formNombre}
          onChange={(e) => setFormNombre(e.target.value)}
          placeholder="Ej. Coordinador de producción"
          required
        />
        <FormInput
          label="Descripción"
          value={formDesc}
          onChange={(e) => setFormDesc(e.target.value)}
          placeholder="Breve resumen de responsabilidades"
        />

        <div>
          <label className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 block">
            Estado
          </label>
          <CustomSelect
            value={formEstado}
            onChange={(val) => setFormEstado(val as "Activo" | "Inactivo")}
            options={ESTADO_OPTIONS}
          />
          <p className="text-[11px] text-[#64748B] mt-1">
            Los privilegios específicos se marcan directamente en las columnas
            de la tabla
          </p>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#262D3D]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-[13px] font-medium text-[#F1F5F9] bg-transparent border border-[#262D3D] hover:bg-[#242830] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all shadow-sm shadow-[#7C3AED]/25 cursor-pointer"
          >
            {editingRole ? "Guardar cambios" : "Agregar rol"}
          </button>
        </div>
      </form>
    </Drawer>
  )
}
