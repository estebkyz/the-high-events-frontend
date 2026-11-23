import React from "react"
import { Drawer } from "../../../components/Drawer"
import { FormInput } from "../../../components/FormInput"
import { CustomSelect } from "../../../components/CustomSelect"
import { CATEGORIES, ESTADO_SERVICIOS_OPTIONS, TIPO_COBRO_OPTIONS } from "../data"
import type { ServicioItem, ServicioFormData, TipoCobroServicio } from "../types"

interface ServicioFormDrawerProps {
  isOpen: boolean
  onClose: () => void
  isEditing: boolean
  service: ServicioItem | null
  formData: ServicioFormData
  setFormData: React.Dispatch<React.SetStateAction<ServicioFormData>>
  onSubmit: (e: React.FormEvent) => void
  categorias?: string[]
  onCreateCategoria?: (nombre: string) => void
}

const CATEGORY_SELECT_OPTIONS = CATEGORIES.map((c) => ({
  value: c,
  label: c,
}))

const ESTADO_SELECT_OPTIONS = ESTADO_SERVICIOS_OPTIONS.map((e) => ({
  value: e,
  label: e,
}))

export function ServicioFormDrawer({
  isOpen,
  onClose,
  isEditing,
  service,
  formData,
  setFormData,
  onSubmit,
  categorias,
  onCreateCategoria,
}: ServicioFormDrawerProps) {
  const categoryOptions = (categorias && categorias.length > 0 ? categorias : CATEGORIES).map((c) => ({
    value: c,
    label: c,
  }))

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title={isEditing ? "Editar servicio" : "Crear servicio"}
      subtitle={isEditing ? service?.nombre : "Define el catálogo comercial de servicios según el modelo oficial"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-3.5">
          <FormInput
            label="Nombre del servicio"
            placeholder="Ej. Sonido Pro Line Array"
            value={formData.nombre || ""}
            onChange={(e) =>
              setFormData((f) => ({ ...f, nombre: e.target.value }))
            }
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 block">
                Categoría
              </label>
              <CustomSelect
                value={formData.categoria || (categoryOptions[0]?.value ?? "Sonido")}
                onChange={(val) => setFormData((f) => ({ ...f, categoria: val }))}
                options={categoryOptions}
                searchable
                allowCreate={!!onCreateCategoria}
                createLabel="Crear categoría"
                onCreate={(newCat) => {
                  if (onCreateCategoria) {
                    onCreateCategoria(newCat)
                    setFormData((f) => ({ ...f, categoria: newCat }))
                  }
                }}
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 block">
                Modalidad de Cobro
              </label>
              <CustomSelect
                value={formData.tipo_cobro || "por_evento"}
                onChange={(val) => setFormData((f) => ({ ...f, tipo_cobro: val as TipoCobroServicio }))}
                options={TIPO_COBRO_OPTIONS}
              />
            </div>
          </div>

          <div
            className={
              isEditing ? "grid grid-cols-1 sm:grid-cols-2 gap-3.5" : ""
            }
          >
            <FormInput
              label="Precio base (COP)"
              placeholder="Ej. $ 2.500.000"
              value={formData.precioBase || ""}
              onChange={(e) =>
                setFormData((f) => ({ ...f, precioBase: e.target.value }))
              }
              required
              hint="Tarifa estándar antes de cotización"
            />

            {isEditing && (
              <div>
                <label className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 block">
                  Estado del servicio
                </label>
                <CustomSelect
                  value={formData.estado || "Activo"}
                  onChange={(val) =>
                    setFormData((f) => ({
                      ...f,
                      estado: val as "Activo" | "Inactivo",
                    }))
                  }
                  options={ESTADO_SELECT_OPTIONS}
                />
              </div>
            )}
          </div>

          <FormInput
            label="Descripción técnica y alcance"
            placeholder="Especificaciones técnicas, marcas, potencia o requerimientos..."
            value={formData.descripcion || ""}
            onChange={(e) =>
              setFormData((f) => ({ ...f, descripcion: e.target.value }))
            }
            required
            hint="Detalle visible en la cotización oficial para el cliente"
          />
        </div>

        <div className="pt-2 flex justify-end gap-2 border-t border-[#262D3D]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#222734] rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            {isEditing ? "Guardar cambios" : "Crear servicio"}
          </button>
        </div>
      </form>
    </Drawer>
  )
}
