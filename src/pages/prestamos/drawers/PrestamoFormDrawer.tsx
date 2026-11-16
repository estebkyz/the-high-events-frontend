import React from "react"
import { Drawer } from "../../../components/Drawer"
import { FormInput } from "../../../components/FormInput"
import type { PrestamoItem, PrestamoFormData } from "../types"

interface PrestamoFormDrawerProps {
  mode: "new" | "edit"; isOpen: boolean
  onClose: () => void
  prestamo: PrestamoItem | null
  formData: PrestamoFormData
  setFormData: React.Dispatch<React.SetStateAction<PrestamoFormData>>
  onSubmit: (e: React.FormEvent) => void
}

export function PrestamoFormDrawer({
  mode,
  isOpen,
  onClose,
  prestamo,
  formData,
  setFormData,
  onSubmit,
}: PrestamoFormDrawerProps) {
  const isEdit = mode === "edit"

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      size="modal"
      title={
        isEdit ? `Editar Préstamo ${prestamo?.codigo}` : "Registrar Préstamo"
      }
      subtitle={
        isEdit
          ? "Modificar datos del préstamo activo"
          : "Asigna equipos a un responsable y evento"
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <FormInput
          label="Responsable"
          required
          value={formData.responsable ?? ""}
          onChange={(e) =>
            setFormData((f) => ({ ...f, responsable: e.target.value }))
          }
        />
        <FormInput
          label="Evento"
          required
          value={formData.evento ?? ""}
          onChange={(e) =>
            setFormData((f) => ({ ...f, evento: e.target.value }))
          }
        />
        {!isEdit && (
          <FormInput
            label="Fecha Salida"
            type="date"
            required
            value={formData.fechaSalida ?? ""}
            onChange={(e) =>
              setFormData((f) => ({ ...f, fechaSalida: e.target.value }))
            }
          />
        )}
        <FormInput
          label="Fecha Devolución Esperada"
          type="date"
          required
          value={formData.fechaDevolucion ?? ""}
          onChange={(e) =>
            setFormData((f) => ({ ...f, fechaDevolucion: e.target.value }))
          }
        />

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#262D3D]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-[#94A3B8] cursor-pointer hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors cursor-pointer"
          >
            {isEdit ? "Actualizar" : "Guardar Préstamo"}
          </button>
        </div>
      </form>
    </Drawer>
  )
}
