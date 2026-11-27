import { Drawer } from "@/components/Drawer"
import { FormInput } from "@/components/FormInput"
import { FormActions } from "@/components/form/FormActions"
import { FormMoneyInput } from "@/components/form/FormMoneyInput"
import { FormSelect } from "@/components/form/FormSelect"
import type { FormDrawerProps } from "@/components/form/types"
import { ESTADO_ACTIVO_OPTIONS, type EstadoActivo } from "@/constants/common"
import { fieldSetter } from "@/utils/form"
import { formatCOP, parseCOP } from "@/utils/format"
import { toOptions } from "@/utils/list"
import { TIPO_COBRO_OPTIONS } from "../constants"
import type { ServicioForm, TipoCobroServicio } from "../types"

interface ServicioFormDrawerProps extends FormDrawerProps<ServicioForm> {
  categorias: string[]
  onCreateCategoria: (nombre: string) => void
}

export function ServicioFormDrawer({
  isOpen,
  isEditing,
  saving,
  form,
  setForm,
  onClose,
  onSubmit,
  categorias,
  onCreateCategoria,
}: ServicioFormDrawerProps) {
  const set = fieldSetter(setForm)

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title={isEditing ? "Editar servicio" : "Crear servicio"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <FormInput
          label="Nombre del servicio"
          placeholder="Ej. Sonido Pro Line Array"
          value={form.nombre}
          onChange={(e) => set({ nombre: e.target.value })}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
            createNeeds={["servicios.categorias"]}
            onCreate={(nombre) => {
              onCreateCategoria(nombre)
              set({ categoria: nombre.trim() })
            }}
          />
          <FormSelect
            label="Modalidad de cobro"
            value={form.tipo_cobro}
            onChange={(val) => set({ tipo_cobro: val as TipoCobroServicio })}
            options={TIPO_COBRO_OPTIONS}
          />
          <FormMoneyInput
            label="Precio base (COP)"
            placeholder="Ej. $ 2.500.000"
            value={form.precioBase ? parseCOP(form.precioBase) : undefined}
            onChange={(val) =>
              set({ precioBase: val === undefined ? "" : formatCOP(val) })
            }
            required
            hint="Tarifa estándar antes de cotización"
          />
          {isEditing && (
            <FormSelect
              label="Estado"
              value={form.estado}
              onChange={(val) => set({ estado: val as EstadoActivo })}
              options={ESTADO_ACTIVO_OPTIONS}
            />
          )}
        </div>
        <FormInput
          label="Descripción técnica y alcance"
          placeholder="Especificaciones, marcas, potencia o requerimientos"
          value={form.descripcion}
          onChange={(e) => set({ descripcion: e.target.value })}
          required
          hint="Visible en la cotización para el cliente"
        />
        <FormActions
          onCancel={onClose}
          saving={saving}
          submitLabel={isEditing ? "Guardar cambios" : "Crear servicio"}
        />
      </form>
    </Drawer>
  )
}
