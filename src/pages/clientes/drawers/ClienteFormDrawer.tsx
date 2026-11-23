import React from "react"
import { Drawer } from "../../../components/Drawer"
import { FormInput } from "../../../components/FormInput"
import { CustomSelect } from "../../../components/CustomSelect"
import type {
  ClienteItem,
  ClienteFormData,
  TipoCliente,
  TipoDocumentoCliente,
} from "../types"
import {
  TIPO_CLIENTE_OPTIONS,
  TIPO_DOC_EMPRESA_OPTIONS,
  TIPO_DOC_NATURAL_OPTIONS,
  ESTADO_OPTIONS,
} from "../data"

interface ClienteFormDrawerProps {
  isOpen: boolean
  mode: "create" | "edit"
  selectedClient: ClienteItem | null
  formState: ClienteFormData
  setFormState: React.Dispatch<React.SetStateAction<ClienteFormData>>
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

export const ClienteFormDrawer: React.FC<ClienteFormDrawerProps> = ({
  isOpen,
  mode,
  formState,
  setFormState,
  onClose,
  onSubmit,
}) => {
  const isEmpresa = formState.tipo_cliente === "Empresa"

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title={mode === "edit" ? "Editar cliente" : "Crear cliente"}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        {/* ── Bloque 1: Clasificación, Documento e Identidad ── */}
        <div className="space-y-3 pb-4 border-b border-[#262D3D]">
          <div className="grid grid-cols-1 sm:grid-cols-[1.15fr_135px_1.35fr] gap-3.5">
            <div>
              <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
                Tipo de cliente <span className="text-[#EF4444]">*</span>
              </label>
              <CustomSelect
                value={formState.tipo_cliente || "Empresa"}
                onChange={(val) =>
                  setFormState((f) => ({
                    ...f,
                    tipo_cliente: val as TipoCliente,
                    tipo_documento: val === "Empresa" ? "NIT" : "CC",
                  }))
                }
                options={TIPO_CLIENTE_OPTIONS}
              />
            </div>

            <div>
              <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block whitespace-nowrap">
                Tipo de documento <span className="text-[#EF4444]">*</span>
              </label>
              <CustomSelect
                value={formState.tipo_documento || (isEmpresa ? "NIT" : "CC")}
                onChange={(val) =>
                  setFormState((f) => ({
                    ...f,
                    tipo_documento: val as TipoDocumentoCliente,
                  }))
                }
                options={
                  isEmpresa
                    ? TIPO_DOC_EMPRESA_OPTIONS
                    : TIPO_DOC_NATURAL_OPTIONS
                }
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

          {isEmpresa ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <FormInput
                label="Razón social"
                value={formState.razon_social || ""}
                onChange={(e) =>
                  setFormState((f) => ({ ...f, razon_social: e.target.value }))
                }
                required
              />
              <FormInput
                label="Nombre de contacto"
                value={formState.contacto_nombre || ""}
                onChange={(e) =>
                  setFormState((f) => ({
                    ...f,
                    contacto_nombre: e.target.value,
                  }))
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <FormInput
                label="Nombre"
                maxLength={60}
                value={formState.primer_nombre || ""}
                onChange={(e) =>
                  setFormState((f) => ({ ...f, primer_nombre: e.target.value }))
                }
                required
              />

              <FormInput
                label="Apellido"
                maxLength={60}
                value={formState.primer_apellido || ""}
                onChange={(e) =>
                  setFormState((f) => ({
                    ...f,
                    primer_apellido: e.target.value,
                  }))
                }
                required
              />
            </div>
          )}
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

        {/* ── Bloque 3: Ubicación y Estado ── */}
        <div className="space-y-3">
          <div
            className={`grid grid-cols-1 ${mode === "edit" ? "sm:grid-cols-2" : ""} gap-3.5`}
          >
            <FormInput
              label="Dirección"
              value={formState.direccion || ""}
              onChange={(e) =>
                setFormState((f) => ({ ...f, direccion: e.target.value }))
              }
            />
            {mode === "edit" && (
              <div>
                <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
                  Estado
                </label>
                <CustomSelect
                  value={formState.estado || "Activo"}
                  onChange={(val) => setFormState((f) => ({ ...f, estado: val }))}
                  options={ESTADO_OPTIONS}
                />
              </div>
            )}
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
                {mode === "edit" ? "Guardar cambios" : "Guardar cliente"}
              </span>
            </button>
          </div>
        </div>
      </form>
    </Drawer>
  )
}
