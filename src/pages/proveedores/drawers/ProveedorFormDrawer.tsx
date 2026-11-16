import React from "react"
import { Drawer } from "../../../components/Drawer"
import { FormInput } from "../../../components/FormInput"
import { CustomSelect } from "../../../components/CustomSelect"
import type { ProveedorItem, ProveedorFormData } from "../types"
import { ALL_SERVICIOS, ALL_EQUIPOS_PROVEEDOR, ESTADO_OPTIONS } from "../data"

interface ProveedorFormDrawerProps {
  isOpen: boolean
  mode: "create" | "edit"
  selectedProvider: ProveedorItem | null
  formState: ProveedorFormData
  setFormState: React.Dispatch<React.SetStateAction<ProveedorFormData>>
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export const ProveedorFormDrawer: React.FC<ProveedorFormDrawerProps> = ({
  isOpen,
  mode,
  formState,
  setFormState,
  onClose,
  onSubmit,
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title={mode === "edit" ? "Editar proveedor" : "Crear proveedor"}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        {/* ── Bloque 1: Datos de la Empresa y Persona de Contacto ── */}
        <div className="space-y-3 pb-4 border-b border-[#262D3D]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <FormInput
              label="Numero de NIT / Documento"
              value={formState.nit_documento || ""}
              onChange={(e) =>
                setFormState((f) => ({ ...f, nit_documento: e.target.value }))
              }
              required
            />
            <FormInput
              label="Razón social / Empresa"
              value={formState.razon_social || ""}
              onChange={(e) =>
                setFormState((f) => ({ ...f, razon_social: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 gap-3.5 pt-1">
            <FormInput
              label="Nombres de contacto"
              value={formState.contacto_primer_nombre || ""}
              onChange={(e) =>
                setFormState((f) => ({
                  ...f,
                  contacto_primer_nombre: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 gap-3.5">
            <FormInput
              label="Apellidos de contacto"
              value={formState.contacto_primer_apellido || ""}
              onChange={(e) =>
                setFormState((f) => ({
                  ...f,
                  contacto_primer_apellido: e.target.value,
                }))
              }
              required
            />
          </div>
        </div>

        {/* ── Bloque 2: Canales de Contacto y Estado ── */}
        <div className="space-y-3 pb-4 border-b border-[#262D3D]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <FormInput
              label="Correo electrónico"
              type="email"
              value={formState.correo || ""}
              onChange={(e) =>
                setFormState((f) => ({ ...f, correo: e.target.value }))
              }
              required
            />
            <FormInput
              label="Teléfono"
              value={formState.telefono || ""}
              onChange={(e) =>
                setFormState((f) => ({ ...f, telefono: e.target.value }))
              }
              required
            />
            <div>
              <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
                Estado del proveedor
              </label>
              <CustomSelect
                value={formState.estado || "Activo"}
                onChange={(val) =>
                  setFormState((f) => ({
                    ...f,
                    estado: val as ProveedorItem["estado"],
                  }))
                }
                options={ESTADO_OPTIONS}
              />
            </div>
          </div>
        </div>

        {/* ── Bloque 3: Servicios y Equipos Suministrados ── */}
        <div className="space-y-3">
          <div>
            <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
              Servicios y personal especializado
            </label>
            <div className="flex flex-wrap gap-1.5 p-2.5 bg-[#111318] border border-[#262D3D] rounded-xl min-h-[42px]">
              {ALL_SERVICIOS.map((s) => {
                const selected = (formState.servicios || []).includes(s)
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() =>
                      setFormState((f) => ({
                        ...f,
                        servicios: selected
                          ? (f.servicios || []).filter((x) => x !== s)
                          : [...(f.servicios || []), s],
                      }))
                    }
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                      selected
                        ? "bg-[#7C3AED]/20 text-[#A78BFA] border-[#7C3AED]/50 font-semibold"
                        : "bg-[#181B22] text-[#94A3B8] border-[#262D3D] hover:border-[#3B4254] hover:text-[#F1F5F9]"
                    }`}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
              Equipos e insumos técnicos en alquiler
            </label>
            <div className="flex flex-wrap gap-1.5 p-2.5 bg-[#111318] border border-[#262D3D] rounded-xl min-h-[42px]">
              {ALL_EQUIPOS_PROVEEDOR.map((eq) => {
                const selected = (formState.equipos || []).includes(eq)
                return (
                  <button
                    key={eq}
                    type="button"
                    onClick={() =>
                      setFormState((f) => ({
                        ...f,
                        equipos: selected
                          ? (f.equipos || []).filter((x) => x !== eq)
                          : [...(f.equipos || []), eq],
                      }))
                    }
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                      selected
                        ? "bg-[#7C3AED]/20 text-[#A78BFA] border-[#7C3AED]/50 font-semibold"
                        : "bg-[#181B22] text-[#94A3B8] border-[#262D3D] hover:border-[#3B4254] hover:text-[#F1F5F9]"
                    }`}
                  >
                    {eq}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

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
              <span>
                {mode === "edit" ? "Guardar cambios" : "Guardar proveedor"}
              </span>
            </button>
          </div>
        </div>
      </form>
    </Drawer>
  )
}
