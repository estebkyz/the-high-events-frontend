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
      title={isEditing ? "Editar empleado" : "Crear empleado"}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        {/* ── Bloque 1: Identificación y Nombres ── */}
        <div className="space-y-3 pb-4 border-b border-[#262D3D]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
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

            <FormInput
              label="Número de documento"
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

          <div className="grid grid-cols-1 sm:grid-cols-1 gap-3.5 pt-1">
            <FormInput
              label="Nombre"
              value={formState.primer_nombre}
              onChange={(e) =>
                setFormState((f) => ({ ...f, primer_nombre: e.target.value }))
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 gap-3.5">
            <FormInput
              label="Apellido"
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
        </div>

        {/* ── Bloque 2: Contacto ── */}
        <div className="space-y-3 pb-4 border-b border-[#262D3D]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormInput
              label="Correo electrónico"
              type="email"
              value={formState.correo}
              onChange={(e) =>
                setFormState((f) => ({ ...f, correo: e.target.value }))
              }
              required
            />
            <FormInput
              label="Teléfono"
              type="tel"
              value={formState.telefono}
              onChange={(e) =>
                setFormState((f) => ({ ...f, telefono: e.target.value }))
              }
              required
            />
          </div>
        </div>

        {/* ── Bloque 3: Cargo, Vinculación y Estado ── */}
        <div className="space-y-3 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                Estado del empleado
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
          </div>
        </div>

        {/* ── Bloque 4: Contacto de Emergencia / SST ── */}
        

        {/* ── Footer: Botones de Acción Coherentes ── */}
        <div className="pt-4 flex items-center justify-between border-t border-[#262D3D]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <div className="flex items-center gap-2.5">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-medium bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all shadow-sm shadow-[#7C3AED]/25 cursor-pointer flex items-center gap-1.5"
            >
              <span>{isEditing ? "Guardar cambios" : "Guardar empleado"}</span>
            </button>
          </div>
        </div>
      </form>
    </Drawer>
  )
}
