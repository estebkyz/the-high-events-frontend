import React, { useMemo } from "react"
import { Drawer } from "../../../components/Drawer"
import { FormInput } from "../../../components/FormInput"
import { CustomSelect } from "../../../components/CustomSelect"
import { useCrudResource } from "../../../hooks/useCrudResource"
import type { ServicioItem, CategoriaServicioItem } from "../../servicios/types"
import type { ProveedorItem, ProveedorFormData } from "../types"
import { ESTADO_OPTIONS } from "../data"

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
  const { items: rawServices } = useCrudResource<ServicioItem>({ endpoint: "/servicios" })
  const { items: rawCatServices } = useCrudResource<CategoriaServicioItem>({
    endpoint: "/categorias-servicio",
  })
  const availableServicios = useMemo(
    () =>
      Array.from(
        new Set([
          ...rawServices.map((s) => s.nombre),
          ...rawCatServices.map((c) => c.nombre),
        ]),
      ).filter(Boolean),
    [rawServices, rawCatServices],
  )
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      width="max-w-2xl"
      title={mode === "edit" ? "Editar proveedor" : "Crear proveedor"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* ── Fila 1: NIT y Razón Social ── */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          <div className="sm:col-span-5">
            <FormInput
              label="Número de NIT / Documento"
              maxLength={20}
              placeholder="Ej. 900.451.230-1"
              value={formState.nit_documento || ""}
              onChange={(e) =>
                setFormState((f) => ({ ...f, nit_documento: e.target.value }))
              }
              required
            />
          </div>
          <div className="sm:col-span-7">
            <FormInput
              label="Razón social / Empresa"
              maxLength={100}
              placeholder="Ej. AudioPro Medellin S.A.S."
              value={formState.razon_social || ""}
              onChange={(e) =>
                setFormState((f) => ({ ...f, razon_social: e.target.value }))
              }
              required
            />
          </div>
        </div>

        {/* ── Fila 2: Nombres y Apellidos del Contacto en 2 columnas ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormInput
            label="Nombres de contacto"
            maxLength={60}
            placeholder="Ej. Roberto Carlos"
            value={formState.contacto_primer_nombre || ""}
            onChange={(e) =>
              setFormState((f) => ({
                ...f,
                contacto_primer_nombre: e.target.value,
              }))
            }
            required
          />

          <FormInput
            label="Apellidos de contacto"
            maxLength={60}
            placeholder="Ej. Gómez Vélez"
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

        {/* ── Fila 3: Correo, Teléfono y Estado (solo edición) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          <div className={mode === "edit" ? "sm:col-span-6" : "sm:col-span-7"}>
            <FormInput
              label="Correo electrónico"
              type="email"
              maxLength={100}
              placeholder="contacto@proveedor.com"
              value={formState.correo || ""}
              onChange={(e) =>
                setFormState((f) => ({ ...f, correo: e.target.value }))
              }
              required
            />
          </div>
          <div className={mode === "edit" ? "sm:col-span-3" : "sm:col-span-5"}>
            <FormInput
              label="Teléfono"
              maxLength={15}
              placeholder="310..."
              value={formState.telefono || ""}
              onChange={(e) =>
                setFormState((f) => ({ ...f, telefono: e.target.value }))
              }
              required
            />
          </div>
          {mode === "edit" && (
            <div className="sm:col-span-3">
              <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
                Estado
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
          )}
        </div>

        {/* ── Fila 4: Especialidades / Categorías de Servicio Ofrecidas ── */}
        <div className="pt-2 border-t border-[#262D3D] space-y-2">
          <div>
            <label className="text-[13px] font-medium text-[#F1F5F9] block">
              Especialidades y servicios que provee
            </label>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">
              Los equipos individuales en alquiler se vinculan a este proveedor desde el módulo de Equipos
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 p-3 bg-[#111318] border border-[#262D3D] rounded-xl">
            {availableServicios.length === 0 ? (
              <span className="text-xs text-[#64748B]">
                Crea servicios o categorías de servicio en el módulo de Servicios para asignarlos al proveedor.
              </span>
            ) : (
              availableServicios.map((s) => {
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
              })
            )}
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
            {mode === "edit" ? "Guardar cambios" : "Crear proveedor"}
          </button>
        </div>
      </form>
    </Drawer>
  )
}
