import React from "react"
import { Drawer } from "../../../components/Drawer"
import { FormInput } from "../../../components/FormInput"
import { CustomSelect } from "../../../components/CustomSelect"
import type { UsuarioItem, TipoDocumentoUsuario } from "../types"
import { TIPO_DOC_OPTIONS, ROL_OPTIONS, ESTADO_OPTIONS } from "../data"

interface UsuarioFormDrawerProps {
  isOpen: boolean; mode: "create" | "edit"
  formState: Partial<UsuarioItem>
  setFormState: React.Dispatch<React.SetStateAction<Partial<UsuarioItem>>>
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export const UsuarioFormDrawer: React.FC<UsuarioFormDrawerProps> = ({
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
      title={mode === "edit" ? "Editar usuario" : "Crear usuario"}
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
                value={formState.tipo_documento || "CC"}
                onChange={(val) =>
                  setFormState((f) => ({
                    ...f,
                    tipo_documento: val as TipoDocumentoUsuario,
                  }))
                }
                options={TIPO_DOC_OPTIONS}
              />
            </div>

            <FormInput
              label="Número de documento"
              value={formState.numero_documento || ""}
              onChange={(e) =>
                setFormState((f) => ({
                  ...f,
                  numero_documento: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-1 gap-3.5 pt-1">
            <FormInput
              label="Nombres"
              value={formState.primer_nombre || ""}
              onChange={(e) =>
                setFormState((f) => ({ ...f, primer_nombre: e.target.value }))
              }
              required
            />
            </div>

          <div className="grid grid-cols-2 sm:grid-cols-1 gap-3.5">
            <FormInput
              label="Apellidos"
              value={formState.primer_apellido || ""}
              onChange={(e) =>
                setFormState((f) => ({ ...f, primer_apellido: e.target.value }))
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
          </div>
        </div>

        {/* ── Bloque 3: Rol, Seguridad y Estado ── */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
                Rol de acceso <span className="text-[#EF4444]">*</span>
              </label>
              <CustomSelect
                value={formState.rol || "Operador"}
                onChange={(val) => setFormState((f) => ({ ...f, rol: val }))}
                options={ROL_OPTIONS}
              />
            </div>

            <div>
              <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
                Estado de la cuenta
              </label>
              <CustomSelect
                value={formState.estado || "Activo"}
                onChange={(val) =>
                  setFormState((f) => ({
                    ...f,
                    estado: val as "Activo" | "Inactivo",
                  }))
                }
                options={ESTADO_OPTIONS}
              />
            </div>
          </div>

          <FormInput
            label={
              mode === "edit"
                ? "Nueva contraseña (opcional)"
                : "Contraseña inicial"
            }
            type="password"
            value={formState.contrasena || ""}
            onChange={(e) =>
              setFormState((f) => ({ ...f, contrasena: e.target.value }))
            }
            hint="Mínimo 6 caracteres"
            required={mode === "create"}
          />
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
                {mode === "edit" ? "Guardar cambios" : "Guardar usuario"}
              </span>
            </button>
          </div>
        </div>
      </form>
    </Drawer>
  )
}

