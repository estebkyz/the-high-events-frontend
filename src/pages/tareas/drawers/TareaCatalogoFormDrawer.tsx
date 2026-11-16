import React from "react"
import { Drawer } from "../../../components/Drawer"
import { FormInput } from "../../../components/FormInput"
import { CustomSelect } from "../../../components/CustomSelect"
import type { Fase, TareaCatalogoFormValues } from "../types"
import { FASE_OPTIONS } from "../data"

interface TareaCatalogoFormDrawerProps {
  isOpen: boolean
  mode: "new_catalogo" | "edit_catalogo"
  form: TareaCatalogoFormValues
  setForm: React.Dispatch<React.SetStateAction<TareaCatalogoFormValues>>
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export const TareaCatalogoFormDrawer: React.FC<
  TareaCatalogoFormDrawerProps
> = ({ isOpen, mode, form, setForm, onClose, onSubmit }) => {
  const isEditing = mode === "edit_catalogo"

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      size="modal"
      title={
        isEditing
          ? "Editar Plantilla del Catálogo (`tarea`)"
          : "Nueva Tarea en el Catálogo (`tarea`)"
      }
      subtitle="Define una actividad técnica u operativa reutilizable que podrá asignarse al crear o gestionar cualquier evento."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <FormInput
          label="Nombre de la Tarea Estándar"
          placeholder="Ej: Montaje de Line Array y Subwoofers"
          required
          value={form.nombre_tarea}
          onChange={(e) =>
            setForm((f) => ({ ...f, nombre_tarea: e.target.value }))
          }
        />

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
            Fase Sugerida por Defecto
          </label>
          <CustomSelect
            value={form.fase_sugerida}
            onChange={(val) =>
              setForm((f) => ({ ...f, fase_sugerida: val as Fase }))
            }
            options={FASE_OPTIONS}
          />
          <p className="text-[11px] text-[#64748B] mt-1">
            Al elegir esta tarea al crear un evento, se preseleccionará
            automáticamente esta fase operativa.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider">
            Descripción Técnica Estándar <span className="text-[#EF4444]">*</span>
          </label>
          <textarea
            required
            value={form.descripcion}
            onChange={(e) =>
              setForm((f) => ({ ...f, descripcion: e.target.value }))
            }
            placeholder="Describe el protocolo técnico estándar que el empleado debe cumplir al ejecutar esta actividad..."
            rows={4}
            className="px-3.5 py-2.5 bg-[#111318] border border-[#2D3748] rounded-xl text-[13px] text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED] resize-none"
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#2D3748]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all shadow-sm shadow-[#7C3AED]/25 cursor-pointer"
          >
            {isEditing ? "Actualizar en Catálogo" : "Guardar en Catálogo"}
          </button>
        </div>
      </form>
    </Drawer>
  )
}
