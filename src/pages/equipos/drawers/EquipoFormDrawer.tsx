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
}

const CATEGORIA_SELECT_OPTIONS = CATEGORIA_OPTIONS.map((c) => ({
  value: c,
  label: c,
}))

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
}: EquipoFormDrawerProps) {
  const isEdit = mode === "edit"

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      size="modal"
      title={isEdit ? "Editar Equipo" : "Registrar Nuevo Equipo"}
      subtitle={
        isEdit
          ? equipo?.nombre
          : "Registra recursos propios o equipos alquilados asociados a su proveedor"
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <FormInput
          label="Nombre del Equipo"
          required
          placeholder="Ej. Consola Digital Behringer X32"
          value={formData.nombre ?? ""}
          onChange={(e) =>
            setFormData((f) => ({ ...f, nombre: e.target.value }))
          }
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 block">
              Categoría
            </label>
            <CustomSelect
              value={formData.categoria ?? "Audio"}
              onChange={(val) =>
                setFormData((f) => ({ ...f, categoria: val as Categoria }))
              }
              options={CATEGORIA_SELECT_OPTIONS}
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 block">
              Tipo Propiedad
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
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Número de Serie"
            required
            placeholder="SN-XXXXX"
            value={formData.serie ?? ""}
            onChange={(e) =>
              setFormData((f) => ({ ...f, serie: e.target.value }))
            }
          />

          <div>
            <label className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 block">
              Estado Operativo
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
          <div className="p-3.5 bg-[#111318] border border-[#262D3D] rounded-xl space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-[#F59E0B] uppercase tracking-wider mb-1 block">
                Proveedor Propietario (id_proveedor) *
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
              />
              <p className="text-[10px] text-[#64748B] mt-1">
                Indispensable para el Formato Digital de Entrega y Recepción en montaje y desmontaje.
              </p>
            </div>
            <FormInput
              label="Costo Alquiler / Día ($)"
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
        ) : (
          <div className="p-3.5 bg-[#111318] border border-[#262D3D] rounded-xl space-y-3">
            <p className="text-[11px] text-[#10B981] font-medium">
              Recurso propio de The High Events — se registra sin proveedor externo (id_proveedor = NULL).
            </p>
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Costo Adquisición ($)"
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
                label="Próximo Mantenimiento"
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
            className="px-4 py-2 rounded-lg text-xs font-medium text-[#94A3B8] hover:bg-[#181B22] cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors cursor-pointer"
          >
            {isEdit ? "Actualizar Equipo" : "Guardar Equipo"}
          </button>
        </div>
      </form>
    </Drawer>
  )
}

