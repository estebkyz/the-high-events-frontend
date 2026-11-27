import { Drawer } from "@/components/Drawer"
import { FormInput } from "@/components/FormInput"
import { FormActions } from "@/components/form/FormActions"
import { FormMoneyInput } from "@/components/form/FormMoneyInput"
import { FormSelect } from "@/components/form/FormSelect"
import type { FormDrawerProps } from "@/components/form/types"
import type { ProveedorItem } from "@/pages/proveedores/types"
import { fieldSetter } from "@/utils/form"
import { toOptions } from "@/utils/list"
import { ESTADO_OPERATIVO_OPTIONS, PROPIEDAD_OPTIONS } from "../constants"
import { clearedByPropiedad } from "../form"
import type { EquipoForm, EstadoOperativo, TipoPropiedadEquipo } from "../types"

interface EquipoFormDrawerProps extends FormDrawerProps<EquipoForm> {
  categorias: string[]
  proveedores: ProveedorItem[]
  onCreateCategoria: (nombre: string) => void
}

export function EquipoFormDrawer({
  isOpen,
  isEditing,
  saving,
  form,
  setForm,
  onClose,
  onSubmit,
  categorias,
  proveedores,
  onCreateCategoria,
}: EquipoFormDrawerProps) {
  const set = fieldSetter(setForm)

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title={isEditing ? "Editar equipo" : "Crear equipo"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormInput
            label="Nombre del equipo"
            required
            placeholder="Ej. Consola Digital Behringer X32"
            value={form.nombre}
            onChange={(e) => set({ nombre: e.target.value })}
          />
          <FormInput
            label="Número de serie"
            maxLength={80}
            required
            placeholder="SN-XXXXX"
            value={form.serie}
            onChange={(e) => set({ serie: e.target.value })}
          />
          <FormSelect
            label="Categoría"
            required
            value={form.categoria}
            onChange={(val) => set({ categoria: val })}
            options={toOptions(categorias)}
            searchable
            placeholder="Selecciona o crea una categoría"
            allowCreate
            createLabel="Crear categoría"
            createNeeds={["equipos.categorias"]}
            onCreate={(nombre) => {
              onCreateCategoria(nombre)
              set({ categoria: nombre.trim() })
            }}
          />
          <FormSelect
            label="Tipo de propiedad"
            value={form.propiedad}
            onChange={(val) => {
              const propiedad = val as TipoPropiedadEquipo
              set({ propiedad, ...clearedByPropiedad(propiedad) })
            }}
            options={PROPIEDAD_OPTIONS}
          />
          {form.propiedad === "Alquilado" ? (
            <>
              <FormSelect
                label="Proveedor propietario"
                required
                searchable
                disabled={proveedores.length === 0}
                placeholder={
                  proveedores.length > 0
                    ? "Seleccionar proveedor"
                    : "Primero crea el proveedor"
                }
                value={form.proveedor_nombre ?? ""}
                onChange={(val) => {
                  const match = proveedores.find((p) => p.razon_social === val)
                  set({
                    proveedor_id: match ? Number(match.id) : null,
                    proveedor_nombre: val,
                  })
                }}
                options={proveedores.map((p) => ({
                  value: p.razon_social,
                  label: `${p.razon_social} (NIT ${p.nit_documento})`,
                }))}
              />
              <FormMoneyInput
                label="Costo de alquiler"
                value={form.costo_alquiler}
                onChange={(val) => set({ costo_alquiler: val })}
              />
            </>
          ) : (
            <>
              <FormMoneyInput
                label="Costo de adquisición"
                value={form.costo_adquisicion}
                onChange={(val) => set({ costo_adquisicion: val })}
              />
            </>
          )}
          {isEditing && (
            <FormSelect
              label="Estado operativo"
              value={form.estadoOperativo}
              onChange={(val) => set({ estadoOperativo: val as EstadoOperativo })}
              options={ESTADO_OPERATIVO_OPTIONS}
            />
          )}
        </div>

        <FormActions
          onCancel={onClose}
          saving={saving}
          submitLabel={isEditing ? "Guardar cambios" : "Crear equipo"}
        />
      </form>
    </Drawer>
  )
}
