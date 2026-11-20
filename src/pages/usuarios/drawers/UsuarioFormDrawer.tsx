import React, { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Drawer } from "../../../components/Drawer"
import { FormInput } from "../../../components/FormInput"
import { CustomSelect } from "../../../components/CustomSelect"
import type { UsuarioItem, TipoDocumentoUsuario } from "../types"
import { TIPO_DOC_OPTIONS, ROL_OPTIONS, ESTADO_OPTIONS } from "../data"

interface UsuarioFormDrawerProps {
  isOpen: boolean
  mode: "create" | "edit"
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
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      width="max-w-2xl"
      title={mode === "edit" ? "Editar usuario" : "Crear usuario"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* ── Fila 1: Identificación (Proporcional al tamaño en BD: Tipo Doc corto, Número Doc medio) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          <div className="sm:col-span-4">
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

          <div className="sm:col-span-8">
            <FormInput
              label="Número de documento"
              maxLength={20}
              placeholder="Ej. 1000100527"
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
        </div>

        {/* ── Fila 2: Nombres y Apellidos lado a lado aprovechando el espacio lateral ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormInput
            label="Nombres"
            maxLength={60}
            placeholder="Ej. Carlos Alberto"
            value={formState.primer_nombre || ""}
            onChange={(e) =>
              setFormState((f) => ({ ...f, primer_nombre: e.target.value }))
            }
            required
          />

          <FormInput
            label="Apellidos"
            maxLength={60}
            placeholder="Ej. Ruiz Montoya"
            value={formState.primer_apellido || ""}
            onChange={(e) =>
              setFormState((f) => ({ ...f, primer_apellido: e.target.value }))
            }
            required
          />
        </div>

        {/* ── Fila 3: Correo (VARCHAR 100) y Teléfono (VARCHAR 15) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          <div className="sm:col-span-7">
            <FormInput
              label="Correo electrónico"
              type="email"
              maxLength={100}
              placeholder="usuario@thehighevents.com"
              value={formState.correo || ""}
              onChange={(e) =>
                setFormState((f) => ({ ...f, correo: e.target.value }))
              }
              required
            />
          </div>
          <div className="sm:col-span-5">
            <FormInput
              label="Teléfono"
              maxLength={15}
              placeholder="Ej. 3105381442"
              value={formState.telefono || ""}
              onChange={(e) =>
                setFormState((f) => ({ ...f, telefono: e.target.value }))
              }
              required
            />
          </div>
        </div>

        {/* ── Fila 4: Rol, Estado y Contraseña con opción de visualizar para verificar ── */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 pt-2 border-t border-[#262D3D]">
          <div className="sm:col-span-4">
            <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
              Rol de acceso <span className="text-[#EF4444]">*</span>
            </label>
            <CustomSelect
              value={formState.rol || "Operador"}
              onChange={(val) => setFormState((f) => ({ ...f, rol: val }))}
              options={ROL_OPTIONS}
            />
          </div>

          <div className="sm:col-span-3">
            <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
              Estado
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

          <div className="sm:col-span-5">
            <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
              {mode === "edit"
                ? "Nueva contraseña (opcional)"
                : "Contraseña asignada"}{" "}
              {mode === "create" && <span className="text-[#EF4444]">*</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required={mode === "create"}
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                value={formState.contrasena || ""}
                onChange={(e) =>
                  setFormState((f) => ({ ...f, contrasena: e.target.value }))
                }
                className="w-full h-[42px] pl-3.5 pr-10 bg-[#111318] border border-[#262D3D] rounded-xl text-xs text-[#F8FAFC] placeholder-[#64748B] hover:border-[#333C50] focus:outline-none focus:border-[#7C3AED] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                title={
                  showPassword
                    ? "Ocultar contraseña"
                    : "Ver contraseña para verificar"
                }
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] rounded-lg transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
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
            {mode === "edit" ? "Guardar cambios" : "Crear usuario"}
          </button>
        </div>
      </form>
    </Drawer>
  )
}
