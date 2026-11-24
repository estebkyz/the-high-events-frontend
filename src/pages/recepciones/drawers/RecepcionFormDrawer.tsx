import { Plus } from "lucide-react"
import { Drawer } from "@/components/Drawer"
import { FormInput } from "@/components/FormInput"
import { HeaderButton } from "@/components/list/HeaderButton"
import { FormActions } from "@/components/form/FormActions"
import { FormSection } from "@/components/form/FormSection"
import { FormSelect } from "@/components/form/FormSelect"
import type { FormDrawerProps } from "@/components/form/types"
import type { EmpleadoItem } from "@/pages/empleados/types"
import { getEmpleadoFullName } from "@/pages/empleados/utils"
import type { EquipoItem } from "@/pages/equipos/types"
import { getEquipoTexto } from "@/pages/equipos/utils"
import type { EventoItem } from "@/pages/eventos/types"
import type { ProveedorItem } from "@/pages/proveedores/types"
import { fieldSetter } from "@/utils/form"
import { RecepcionItemFields } from "../components/RecepcionItemFields"
import { ESTADO_RECEPCION_OPTIONS, TIPO_RECEPCION_OPTIONS } from "../constants"
import { EMPTY_ITEM, seleccionarResponsable } from "../form"
import type {
  EstadoRecepcion,
  RecepcionEquipo,
  RecepcionForm,
  TipoRecepcion,
} from "../types"

interface RecepcionFormDrawerProps extends FormDrawerProps<RecepcionForm> {
  eventos: EventoItem[]
  proveedores: ProveedorItem[]
  equipos: EquipoItem[]
  empleados: EmpleadoItem[]
}

export function RecepcionFormDrawer({
  isOpen,
  isEditing,
  saving,
  form,
  setForm,
  onClose,
  onSubmit,
  eventos,
  proveedores,
  equipos,
  empleados,
}: RecepcionFormDrawerProps) {
  const set = fieldSetter(setForm)
  const delProveedor = (eq: EquipoItem) =>
    eq.propiedad === "Alquilado" && eq.proveedor_nombre === form.proveedor
  const equipoOptions = [...equipos]
    .sort((a, b) => Number(delProveedor(b)) - Number(delProveedor(a)))
    .map((eq) => ({
      label: getEquipoTexto(eq),
      value: getEquipoTexto(eq),
      sublabel: eq.categoria,
      badge: delProveedor(eq) ? "Del proveedor" : eq.propiedad,
    }))

  const updateItem = (index: number, changes: Partial<RecepcionEquipo>) =>
    set({
      items: form.items.map((it, i) => (i === index ? { ...it, ...changes } : it)),
    })

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      title={isEditing ? "Editar recepción" : "Crear recepción"}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormSelect
            label="Evento"
            required
            searchable
            placeholder="Seleccionar evento"
            options={eventos.map((e) => ({ label: e.nombre, value: e.id }))}
            value={String(form.evento_id ?? "")}
            onChange={(val) =>
              set({
                evento_id: Number(val),
                evento: eventos.find((e) => e.id === val)?.nombre ?? "",
              })
            }
          />
          <FormSelect
            label="Empleado responsable"
            required
            searchable
            placeholder="Seleccionar empleado"
            options={empleados.map((e) => ({
              label: getEmpleadoFullName(e),
              value: getEmpleadoFullName(e),
              sublabel: e.cargo,
            }))}
            value={form.responsable}
            onChange={(val) => set(seleccionarResponsable(val, empleados))}
          />
          <FormSelect
            label="Proveedor"
            required
            searchable
            placeholder="Seleccionar proveedor"
            options={proveedores.map((p) => ({
              label: p.razon_social,
              value: p.razon_social,
              sublabel: `NIT ${p.nit_documento}`,
            }))}
            value={form.proveedor}
            onChange={(val) => set({ proveedor: val })}
          />
          <FormSelect
            label="Tipo de acta"
            options={TIPO_RECEPCION_OPTIONS}
            value={form.tipo}
            onChange={(val) => set({ tipo: val as TipoRecepcion })}
          />
          <FormSelect
            label="Estado"
            options={ESTADO_RECEPCION_OPTIONS}
            value={form.estado}
            onChange={(val) => set({ estado: val as EstadoRecepcion })}
          />
          <FormInput
            label="Fecha de verificación"
            type="date"
            required
            value={form.fecha}
            onChange={(e) => set({ fecha: e.target.value })}
          />
          <FormInput
            label="Observaciones"
            value={form.observaciones}
            onChange={(e) => set({ observaciones: e.target.value })}
          />
        </div>

        <FormSection
          title="Equipos recibidos"
          hint="Estado físico, observación y evidencia por cada equipo."
          action={
            <HeaderButton
              icon={Plus}
              label="Agregar equipo"
              onClick={() => set({ items: [...form.items, EMPTY_ITEM] })}
            />
          }
        >
          <div className="divide-y divide-[#2D3748]/60">
            {form.items.map((item, index) => (
              <RecepcionItemFields
                key={index}
                index={index}
                item={item}
                equipoOptions={equipoOptions}
                onChange={(changes) => updateItem(index, changes)}
                onRemove={
                  form.items.length > 1
                    ? () => set({ items: form.items.filter((_, i) => i !== index) })
                    : undefined
                }
              />
            ))}
          </div>
        </FormSection>

        <FormActions
          onCancel={onClose}
          saving={saving}
          submitLabel={isEditing ? "Guardar cambios" : "Crear recepción"}
        />
      </form>
    </Drawer>
  )
}
