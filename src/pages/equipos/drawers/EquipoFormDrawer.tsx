import React from "react"
import { Drawer } from "../../../components/Drawer"
import { FormInput } from "../../../components/FormInput"
import { CustomSelect } from "../../../components/CustomSelect"
import { CATEGORIA_OPTIONS, ESTADO_OPERATIVO_OPTIONS, PROPIEDAD_OPTIONS } from "../data"
import { INITIAL_PROVIDERS } from "../../proveedores/data"
import type {
  EquipoItem,
  EquipoFormData,
  Categoria,
  EstadoOperativo,
  TipoPropiedadEquipo,
} from "../types"

interface EquipoFormDrawerProps {
  mode: "new" | "edit"
  isOpen: boolean
  onClose: () => void
  equipo: EquipoItem | null
  formData: EquipoFormData
  setFormData: React.Dispatch<React.SetStateAction<EquipoFormData>>
  onSubmit: (e: React.FormEvent) => void
  categorias?: string[]
  onCreateCategoria?: (nombre: string) => void
}

const ESTADO_SELECT_OPTIONS = ESTADO_OPERATIVO_OPTIONS.map((e) => ({
  value: e,
  label: e,
}))

const PROPIEDAD_SELECT_OPTIONS = PROPIEDAD_OPTIONS.map((p) => ({
  value: p,
  label: p === "Propio" ? "Propio (The High Events)" : "Alquilado (Proveedor Externo)",
}))

const PROVEEDOR_SELECT_OPTIONS = [
  { value: "", label: "Seleccionar proveedor propietario..." },
  ...INITIAL_PROVIDERS.map((prov) => ({
    value: prov.razon_social,
    label: `${prov.razon_social} (NIT ${prov.nit_documento})`,
  })),
]

export function EquipoFormDrawer({
  mode,
  isOpen,
  onClose,
  equipo,
  formData,
  setFormData,
  onSubmit,
  categorias = CATEGORIA_OPTIONS,
  onCreateCategoria,
}: EquipoFormDrawerProps) {
  const isEdit = mode === "edit"

  const categoriaSelectOptions = categorias.map((c) => ({
    value: c,
    label: c,
  }))

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      width="max-w-2xl"
      title={isEdit ? "Editar equipo" : "Crear equipo"}
      subtitle={
        isEdit
          ? equipo?.nombre
          : "Registra recursos propios o equipos alquilados asociados a su proveedor"
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          <div className="sm:col-span-7">
            <FormInput
              label="Nombre del equipo"
              required
              placeholder="Ej. Consola Digital Behringer X32"
              value={formData.nombre ?? ""}
              onChange={(e) =>
                setFormData((f) => ({ ...f, nombre: e.target.value }))
              }
            />
          </div>
          <div className="sm:col-span-5">
            <FormInput
              label="Número de serie"
              required
              placeholder="SN-XXXXX"
              value={formData.serie ?? ""}
              onChange={(e) =>
                setFormData((f) => ({ ...f, serie: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
              Categoría (FK id_categoria)
            </label>
            <CustomSelect
              value={formData.categoria ?? categorias[0] ?? "Audio"}
              onChange={(val) =>
                setFormData((f) => ({ ...f, categoria: val as Categoria }))
              }
              options={categoriaSelectOptions}
              searchable={true}
              allowCreate={Boolean(onCreateCategoria)}
              createLabel="Crear nueva categoría"
              onCreate={(newCat) => {
                onCreateCategoria?.(newCat)
                setFormData((f) => ({ ...f, categoria: newCat }))
              }}
            />
          </div>

          <div>
            <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
              Tipo de propiedad
            </label>
            <CustomSelect
              value={formData.propiedad ?? "Propio"}
              onChange={(val) => {
                const nextProp = val as TipoPropiedadEquipo
                setFormData((f) => ({
                  ...f,
                  propiedad: nextProp,
                  ...(nextProp === "Propio"
                    ? {
                        proveedor_id: null,
                        proveedor_nombre: undefined,
                        costo_alquiler_dia: undefined,
                      }
                    : {
                        costo_adquisicion: undefined,
                      }),
                }))
              }}
              options={PROPIEDAD_SELECT_OPTIONS}
            />
          </div>

          <div>
            <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
              Estado operativo
            </label>
            <CustomSelect
              value={formData.estadoOperativo ?? "Disponible"}
              onChange={(val) =>
                setFormData((f) => ({
                  ...f,
                  estadoOperativo: val as EstadoOperativo,
                }))
              }
              options={ESTADO_SELECT_OPTIONS}
            />
          </div>
        </div>

        {formData.propiedad === "Alquilado" ? (
          <div className="p-3.5 bg-[#111318] border border-[#262D3D] rounded-xl grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-start">
            <div className="sm:col-span-7">
              <label className="text-[13px] font-medium text-[#F59E0B] mb-1.5 block">
                Proveedor propietario (FK id_proveedor) *
              </label>
              <CustomSelect
                value={formData.proveedor_nombre ?? ""}
                onChange={(val) => {
                  const matched = INITIAL_PROVIDERS.find(
                    (p) => p.razon_social === val,
                  )
                  setFormData((f) => ({
                    ...f,
                    proveedor_id: matched ? Number(matched.id) : null,
                    proveedor_nombre: val,
                  }))
                }}
                options={PROVEEDOR_SELECT_OPTIONS}
                searchable={true}
              />
            </div>
            <div className="sm:col-span-5">
              <FormInput
                label="Costo alquiler / día ($)"
                type="number"
                placeholder="0"
                value={String(formData.costo_alquiler_dia ?? "")}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    costo_alquiler_dia: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-[#111318] border border-[#262D3D] rounded-xl space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <FormInput
                label="Costo de adquisición ($)"
                type="number"
                placeholder="0"
                value={String(formData.costo_adquisicion ?? "")}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    costo_adquisicion: Number(e.target.value),
                  }))
                }
              />
              <FormInput
                label="Próximo mantenimiento"
                type="date"
                value={formData.mantenimiento_proximo ?? ""}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    mantenimiento_proximo: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        )}

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#262D3D]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] border border-[#262D3D] cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors cursor-pointer"
          >
            {isEdit ? "Guardar cambios" : "Crear equipo"}
          </button>
        </div>
      </form>
    </Drawer>
  )
}
