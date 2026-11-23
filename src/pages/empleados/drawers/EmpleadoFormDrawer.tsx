import React from "react"
import { Drawer } from "../../../components/Drawer"
import { FormInput } from "../../../components/FormInput"
import { CustomSelect } from "../../../components/CustomSelect"
import {
  TIPOS_DOCUMENTO_OPTIONS,
  CARGOS_OPTIONS,
  VINCULACION_OPTIONS,
  ESTADOS_OPTIONS,
} from "../data"
import type { EmpleadoItem, EmpleadoFormData } from "../types"

interface EmpleadoFormDrawerProps {
  isOpen: boolean
  onClose: () => void
  isEditing: boolean
  selectedEmp: EmpleadoItem | null
  formState: EmpleadoFormData
  setFormState: React.Dispatch<React.SetStateAction<EmpleadoFormData>>
  onSubmit: (e: React.FormEvent) => void
}

export function EmpleadoFormDrawer({
  isOpen,
  onClose,
  isEditing,
  formState,
  setFormState,
  onSubmit,
}: EmpleadoFormDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      width="max-w-2xl"
      title={isEditing ? "Editar empleado" : "Crear empleado"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* ── Fila 1: Identificación (Proporcional a la BD) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3.5">
          <div>
            <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block whitespace-nowrap">
              Tipo de documento <span className="text-[#EF4444]">*</span>
            </label>
            <CustomSelect
              options={TIPOS_DOCUMENTO_OPTIONS}
              value={formState.tipo_documento}
              onChange={(val) =>
                setFormState((f) => ({
                  ...f,
                  tipo_documento: val as EmpleadoFormData["tipo_documento"],
                }))
              }
            />
          </div>

          <div>
            <FormInput
              label="Número de documento"
              maxLength={20}
              placeholder="Ej. 1000100527"
              value={formState.numero_documento}
              onChange={(e) =>
                setFormState((f) => ({
                  ...f,
                  numero_documento: e.target.value,
                }))
              }
              required
            />
          </div>
        </div>

        {/* ── Fila 2: Nombres y Apellidos en 2 columnas ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormInput
            label="Nombre"
            maxLength={60}
            placeholder="Ej. Andrés Felipe"
            value={formState.primer_nombre}
            onChange={(e) =>
              setFormState((f) => ({ ...f, primer_nombre: e.target.value }))
            }
            required
          />

          <FormInput
            label="Apellido"
            maxLength={60}
            placeholder="Ej. Restrepo Gómez"
            value={formState.primer_apellido}
            onChange={(e) =>
              setFormState((f) => ({
                ...f,
                primer_apellido: e.target.value,
              }))
            }
            required
          />
        </div>

        {/* ── Fila 3: Contacto (Correo y Teléfono) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          <div className="sm:col-span-7">
            <FormInput
              label="Correo electrónico"
              type="email"
              maxLength={100}
              placeholder="colaborador@thehighevents.com"
              value={formState.correo}
              onChange={(e) =>
                setFormState((f) => ({ ...f, correo: e.target.value }))
              }
              required
            />
          </div>
          <div className="sm:col-span-5">
            <FormInput
              label="Teléfono"
              type="tel"
              maxLength={15}
              placeholder="Ej. 3105381442"
              value={formState.telefono}
              onChange={(e) =>
                setFormState((f) => ({ ...f, telefono: e.target.value }))
              }
              required
            />
          </div>
        </div>

        {/* ── Fila 4: Cargo, Tipo de Vinculación y Estado (solo edición) ── */}
        <div
          className={`grid grid-cols-1 ${isEditing ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-3.5 pt-2 border-t border-[#262D3D]`}
        >
          <div>
            <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
              Cargo del empleado <span className="text-[#EF4444]">*</span>
            </label>
            <CustomSelect
              options={CARGOS_OPTIONS}
              value={formState.cargo}
              onChange={(val) => setFormState((f) => ({ ...f, cargo: val }))}
              searchable={true}
              placeholder="Seleccionar cargo"
            />
          </div>

          <div>
            <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
              Tipo de vinculación <span className="text-[#EF4444]">*</span>
            </label>
            <CustomSelect
              options={VINCULACION_OPTIONS}
              value={formState.vinculacion || "Fijo"}
              onChange={(val) =>
                setFormState((f) => ({
                  ...f,
                  vinculacion: val as EmpleadoFormData["vinculacion"],
                }))
              }
            />
          </div>

          {isEditing && (
            <div>
              <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
                Estado
              </label>
              <CustomSelect
                options={ESTADOS_OPTIONS}
                value={formState.estado}
                onChange={(val) =>
                  setFormState((f) => ({
                    ...f,
                    estado: val as EmpleadoFormData["estado"],
                  }))
                }
              />
            </div>
          )}
        </div>

        {/* ── Footer: Botones de Acción Coherentes ── */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#262D3D]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] border border-[#262D3D] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all shadow-sm shadow-[#7C3AED]/25 cursor-pointer"
          >
            {isEditing ? "Guardar cambios" : "Crear empleado"}
          </button>
        </div>
      </form>
    </Drawer>
  )
}
